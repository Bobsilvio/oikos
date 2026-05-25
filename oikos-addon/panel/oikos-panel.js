// oikos-panel.js — loader stub statico
//
// Questo file viene servito da HA come `/local/oikos-panel.js` ed è il
// punto di ingresso del panel_custom. NON contiene la logica della
// dashboard: legge `manifest.json` (no-cache) e importa dinamicamente
// il bundle versionato `/local/oikos/oikos-panel.<buildtag>.js`.
//
// Effetti:
//   • Il contenuto del loader non cambia mai → cache HA innocua
//   • Il bundle ha filename diverso a ogni build → cache busting automatico
//   • L'utente non deve toccare nulla né su `configuration.yaml` né altrove
//
// Lifecycle HA:
//   `panel_custom` istanzia l'elemento `oikos-panel` e gli setta `hass`,
//   `narrow`, `route`, `panel`. Noi salviamo questi valori finché il
//   bundle non è caricato, poi creiamo l'elemento implementativo
//   `oikos-panel-impl` e gli inoltriamo le proprietà.

// ── Global rejection guard (early) ───────────────────────────────────────────
// Registrato qui nel loader (eseguito sincronamente al primo script load) per
// catturare anche le rejection HA che avvengono PRIMA che il bundle versionato
// sia stato scaricato. Tipico esempio: HA WebSocket reconnect che scatena
// "Subscription not found" mentre il bundle React non è ancora montato.
// Senza questo guard, quelle rejection bubblavano fino al global error handler
// di HA → schermata bianca durante il loading.
if (typeof window !== 'undefined' && !window.__OIKOS_REJECTION_GUARD__) {
  window.__OIKOS_REJECTION_GUARD__ = true
  var HA_KNOWN_CODES = new Set([
    'not_found', 'connection_lost', 'invalid_format', 'id_reuse',
    'invalid_entity_id', 'invalid_message', 'service_validation_error',
    'home_assistant_error', 'unknown_command',
  ])
  window.addEventListener('unhandledrejection', function (e) {
    var r = e && e.reason
    var code = (r && (r.code || (r.error && r.error.code))) || ''
    var msg  = ((r && (r.message || r.error)) || '').toString()
    if (code && (HA_KNOWN_CODES.has(code) || /websocket|connection|subscription/i.test(msg))) {
      e.preventDefault()
      return
    }
    if (/connection.*lost|websocket.*closed|subscription not found/i.test(msg)) {
      e.preventDefault()
    }
  })
}

let _bundlePromise = null
async function loadBundle() {
  if (_bundlePromise) return _bundlePromise
  _bundlePromise = (async () => {
    const res = await fetch('/local/oikos/manifest.json?_=' + Date.now(), { cache: 'no-store' })
    if (!res.ok) throw new Error('manifest.json non trovato — l\'addon Oikos non è stato avviato?')
    const { bundle } = await res.json()
    if (typeof bundle !== 'string' || !bundle.endsWith('.js')) {
      throw new Error('manifest.json malformato (atteso { "bundle": "...js" })')
    }
    await import('/local/oikos/' + bundle)
  })()
  _bundlePromise.catch(() => { _bundlePromise = null })  // permette retry alla prossima connectedCallback
  return _bundlePromise
}

class OikosPanel extends HTMLElement {
  constructor() {
    super()
    this._impl = null
    this._props = {}  // hass / narrow / route / panel salvati prima del load
  }

  set hass(v)   { this._props.hass   = v; this._forward() }
  set narrow(v) { this._props.narrow = v; this._forward() }
  set route(v)  { this._props.route  = v; this._forward() }
  set panel(v)  { this._props.panel  = v; this._forward() }

  get hass()   { return this._impl?.hass   ?? this._props.hass }
  get narrow() { return this._impl?.narrow ?? this._props.narrow }
  get route()  { return this._impl?.route  ?? this._props.route }
  get panel()  { return this._impl?.panel  ?? this._props.panel }

  _forward() {
    const el = this._impl
    if (!el) return
    for (const k of ['hass', 'narrow', 'route', 'panel']) {
      if (this._props[k] !== undefined) el[k] = this._props[k]
    }
  }

  async connectedCallback() {
    if (this._inited) return
    this._inited = true
    try {
      await loadBundle()
      // Il bundle ha registrato `oikos-panel-impl`
      this._impl = document.createElement('oikos-panel-impl')
      this._impl.style.cssText = 'display:block;width:100%;height:100%'
      this.appendChild(this._impl)
      this._forward()
    } catch (e) {
      console.error('[oikos-panel] load failed:', e)
      this.innerHTML = `<div style="padding:24px;font:14px system-ui;color:#dc2626">
        <strong>Oikos: impossibile caricare la dashboard</strong><br>
        <small>${e.message}</small><br><br>
        <small>Controlla che l'addon Oikos sia in esecuzione, poi ricarica la pagina.</small>
      </div>`
    }
  }

  disconnectedCallback() {
    try { this._impl?.remove?.() } catch {}
    this._impl = null
    this._inited = false
  }
}

if (!customElements.get('oikos-panel')) {
  customElements.define('oikos-panel', OikosPanel)
}
