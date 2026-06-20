ARG BUILD_FROM
FROM ${BUILD_FROM}

# Node.js dal repo della base alpine (pinnata in build.json, no :latest →
# versione Node nota; server.js richiede Node ≥18 per fetch/top-level await)
RUN apk add --no-cache nodejs npm

WORKDIR /app

# ── 1. Dipendenze di produzione ───────────────────────────────────────────────
# package.json + package-lock.json generati da prepare-addon.sh: il lock fissa
# l'intero albero (4 radici + ~66 transitive) → con il lock presente npm install
# è deterministico (installa quanto bloccato). NON usiamo `npm ci`: è troppo
# severo — fallisce al minimo disallineamento package.json↔lock (es. differenze
# tra l'npm che ha generato il lock e quello di alpine), bloccando il build
# dell'addon. `npm install` rispetta il lock ma non va in crash.
# L'install avviene online al build (una volta a install/aggiornamento — HA è
# comunque online in quel momento).
COPY package.json package-lock.json ./
RUN npm install --omit=dev --no-audit --no-fund && npm cache clean --force

# ── 2. Panel_custom bundle: loader + bundle versionato + manifest ──────────
# run.sh installa questi file in /config/www/ a ogni avvio così l'utente non
# tocca nulla a installazione/upgrade — il bundle ha filename versionato e la
# cache HA si invalida da sola. È l'unico frontend distribuito con l'addon
# (il vecchio addon-UI ingress è stato dismesso).
COPY panel/ ./panel/

# ── 2b. Card preview statiche (png/gif) servite poi da HA via /local/ ──────
COPY card-previews/ ./card-previews/

# ── 3. Server Express ─────────────────────────────────────────────────────────
COPY server.js ./

# Crea cartelle opzionali
RUN mkdir -p uploads plugins

# ── 4. Script di avvio ────────────────────────────────────────────────────────
COPY run.sh /run.sh
RUN chmod +x /run.sh

EXPOSE 3000
CMD ["/run.sh"]
