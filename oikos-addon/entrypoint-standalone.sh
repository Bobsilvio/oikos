#!/bin/sh
# Entrypoint standalone (Docker / HA Container). POSIX sh, niente bashio.
# 1) Copia il pannello in /config/www/oikos così HA lo serve da /local/oikos/
#    (loader stabile /local/oikos-panel.js + bundle versionato + manifest).
# 2) Avvia il server Express in modalità standalone.
#
# NB: la registrazione panel_custom in configuration.yaml NON è automatica qui
# (niente Supervisor): va aggiunta manualmente una volta — vedi README/wizard.
set -e

if [ -d /config ]; then
  mkdir -p /config/www/oikos
  # Loader stabile → /local/oikos-panel.js
  cp /app/panel/oikos-panel.js /config/www/oikos-panel.js 2>/dev/null || true
  # Bundle versionato: rimuovi i vecchi, copia il nuovo + manifest + chunk
  find /config/www/oikos -maxdepth 1 -name 'oikos-panel.*.js' -delete 2>/dev/null || true
  cp /app/panel/oikos-panel.*.js /config/www/oikos/ 2>/dev/null || true
  cp /app/panel/manifest.json    /config/www/oikos/manifest.json 2>/dev/null || true
  echo "[oikos] pannello copiato in /config/www/oikos/"
else
  echo "[oikos] ATTENZIONE: /config non montato — monta il config di HA come volume"
fi

exec node server.js
