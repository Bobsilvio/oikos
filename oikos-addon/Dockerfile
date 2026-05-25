ARG BUILD_FROM
FROM ${BUILD_FROM}

# Installa Node.js 20
RUN apk add --no-cache nodejs npm

WORKDIR /app

# ── 1. Dipendenze di produzione ───────────────────────────────────────────────
COPY package.json package-lock.json* ./
RUN npm ci --omit=dev

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
