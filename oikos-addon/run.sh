#!/usr/bin/with-contenv bashio

# License server fisso (nessuna opzione utente)
LICENSE_SERVER_URL="https://homeoikos.com"

bashio::log.info "Avvio Oikos..."

# SUPERVISOR_TOKEN: iniettato dal Supervisor HA. Su versioni precedenti si chiamava HASSIO_TOKEN.
if [[ -z "${SUPERVISOR_TOKEN:-}" ]]; then
    SUPERVISOR_TOKEN="${HASSIO_TOKEN:-}"
fi
if [[ -z "${SUPERVISOR_TOKEN:-}" ]]; then
    SUPERVISOR_TOKEN=$(bashio::api.supervisor_token 2>/dev/null || true)
fi
export SUPERVISOR_TOKEN
bashio::log.info "SUPERVISOR_TOKEN: $([ -n "${SUPERVISOR_TOKEN}" ] && echo 'presente' || echo 'MANCANTE')"

# Discovery: scrive l'URL ingress dell'addon in /config/www/oikos/discovery.json
# così il panel custom (caricato da /local/oikos-panel.js) sa dove chiamare
# /api/config senza configurazione manuale. Cross-device, cross-utente.
if [ -n "${SUPERVISOR_TOKEN:-}" ]; then
  INGRESS_URL=$(curl -fsSL \
    -H "Authorization: Bearer ${SUPERVISOR_TOKEN}" \
    http://supervisor/addons/self/info 2>/dev/null \
    | grep -o '"ingress_url"[[:space:]]*:[[:space:]]*"[^"]*"' \
    | head -1 \
    | sed 's/.*"ingress_url"[[:space:]]*:[[:space:]]*"\([^"]*\)"/\1/')
  if [ -n "${INGRESS_URL}" ]; then
    mkdir -p /config/www/oikos
    cat > /config/www/oikos/discovery.json <<EOF
{ "ingressUrl": "${INGRESS_URL}", "version": "$(date -u +%Y-%m-%dT%H:%M:%SZ)" }
EOF
    bashio::log.info "Discovery scritto: ${INGRESS_URL}"
  else
    bashio::log.warning "Impossibile rilevare ingress_url dal supervisor"
  fi
fi

# ── Auto-registrazione panel_custom (una sola volta) ─────────────────────────
# Rileva se Oikos è già registrato controllando il JS URL (indipendente dal
# nome scelto dall'utente) E il flag /data/panel_registered.
# Gestisce: panel_custom con altre dashboard già presenti, commenti inline,
# panel_custom: !include (in quel caso appende una sezione separata).
_oikos_panel_present() {
  grep -q "oikos-panel\.js" /config/configuration.yaml 2>/dev/null || \
  grep -q "name:[[:space:]]*oikos[[:space:]]*$" /config/configuration.yaml 2>/dev/null
}

if [ -f /data/panel_registered ]; then
  bashio::log.info "Panel Oikos già registrato."
elif _oikos_panel_present; then
  # Presente ma flag mancante (es. installazione manuale precedente) — allinea il flag
  touch /data/panel_registered
  bashio::log.info "Panel Oikos già presente in configuration.yaml."
else
  bashio::log.info "Prima installazione: aggiungo panel_custom oikos a configuration.yaml..."

  cp /config/configuration.yaml /config/configuration.yaml.oikos.bak 2>/dev/null || true

  CFG='/config/configuration.yaml'
  TMP="${CFG}.oikos.tmp"

  # Doppio controllo in bash
  if grep -q "oikos-panel.js" "$CFG" 2>/dev/null; then
    touch /data/panel_registered
    bashio::log.info "Panel Oikos già presente in configuration.yaml."
  elif grep -qE '^panel_custom:[[:space:]]*(#.*)?$' "$CFG" 2>/dev/null; then
    # Esiste "panel_custom:" come chiave root senza valore inline → inserisci subito sotto
    # Accetta:  "panel_custom:"  |  "panel_custom:  # commento"
    # Rifiuta:  "  panel_custom:" (indentata) | "panel_custom: !include ..."
    awk '/^panel_custom:[[:space:]]*(#.*)?$/ && !done {
      print
      print "  - name: oikos"
      print "    sidebar_title: Oikos"
      print "    sidebar_icon: mdi:view-dashboard-variant"
      print "    url_path: oikos"
      print "    js_url: /local/oikos-panel.js"
      done=1; next
    }
    { print }' "$CFG" > "$TMP" && mv "$TMP" "$CFG" \
      && touch /data/panel_registered \
      && bashio::log.info "✅ Panel Oikos aggiunto a configuration.yaml" \
      && bashio::log.warning "↻  Riavvia Home Assistant una volta per vedere Oikos nella sidebar" \
      || { cp "${CFG}.oikos.bak" "$CFG" 2>/dev/null; bashio::log.error "❌ Impossibile modificare configuration.yaml — aggiungi panel_custom manualmente"; }
  else
    # Nessuna sezione panel_custom (o era "panel_custom: !include ...") → aggiungi in fondo
    {
      printf '\n# Aggiunto automaticamente da Oikos add-on\n'
      printf 'panel_custom:\n'
      printf '  - name: oikos\n'
      printf '    sidebar_title: Oikos\n'
      printf '    sidebar_icon: mdi:view-dashboard-variant\n'
      printf '    url_path: oikos\n'
      printf '    js_url: /local/oikos-panel.js\n'
    } >> "$CFG" \
      && touch /data/panel_registered \
      && bashio::log.info "✅ Panel Oikos aggiunto a configuration.yaml" \
      && bashio::log.warning "↻  Riavvia Home Assistant una volta per vedere Oikos nella sidebar" \
      || { cp "${CFG}.oikos.bak" "$CFG" 2>/dev/null; bashio::log.error "❌ Impossibile scrivere configuration.yaml — aggiungi panel_custom manualmente"; }
  fi
fi

# ── Panel custom: deploy auto del loader + bundle versionato ─────────────────
# Il loader `/local/oikos-panel.js` è statico (non cambia mai dopo il primo
# install). Il bundle vero ha nome versionato `oikos-panel.<tag>.js` e vive
# in `/local/oikos/` insieme a manifest.json. Ad ogni avvio dell'addon
# riallineiamo i file con quelli dell'immagine: install/upgrade dell'addon
# = deploy del panel automatico, l'utente non tocca configuration.yaml.
if [ -d /app/panel ] && [ -d /config/www ]; then
  mkdir -p /config/www/oikos
  # Loader: copia solo se diverso (evita di invalidare la cache HA inutilmente)
  if ! cmp -s /app/panel/oikos-panel.js /config/www/oikos-panel.js 2>/dev/null; then
    cp /app/panel/oikos-panel.js /config/www/oikos-panel.js
    bashio::log.info "Panel loader aggiornato: /local/oikos-panel.js"
  fi
  # Pulisce bundle versionati e chunk async vecchi (filename con un secondo
  # punto: `oikos-panel.<tag>.js`, `oikos-panel.chunk.<name>.<hash>.js`).
  # Il loader stesso è `oikos-panel.js` (un solo punto) e vive in /config/www/,
  # non viene toccato qui.
  find /config/www/oikos -maxdepth 1 -name 'oikos-panel.*.js' -delete 2>/dev/null || true
  cp /app/panel/oikos-panel.*.js /config/www/oikos/ 2>/dev/null || true
  cp /app/panel/manifest.json    /config/www/oikos/manifest.json 2>/dev/null || true
  if [ -f /config/www/oikos/manifest.json ]; then
    NEW_BUILD=$(grep -o '"build"[[:space:]]*:[[:space:]]*"[^"]*"' /config/www/oikos/manifest.json | sed 's/.*"\([^"]*\)"$/\1/')
    bashio::log.info "Panel bundle: $NEW_BUILD (in /local/oikos/)"
  fi
fi

# Card-previews → /config/www/card-previews/ accessibili via /local/
if [ -d /app/card-previews ] && [ -d /config/www ]; then
  mkdir -p /config/www/card-previews
  cp -r /app/card-previews/. /config/www/card-previews/ 2>/dev/null || true
fi


# Questa variabile viene letta da server.js e iniettata nell'index.html
# come window.__OIKOS_ENV__ → useLicense.js la legge a runtime
export LICENSE_SERVER_URL="${LICENSE_SERVER_URL}"
export PORT=3000

# Avvia il server Express
exec node /app/server.js
