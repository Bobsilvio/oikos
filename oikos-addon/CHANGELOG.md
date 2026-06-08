# Changelog

All notable changes to Oikos are documented in this file.
Format follows [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).
Versioning follows [Semantic Versioning](https://semver.org/).

---

## [2.5.7] - 2026-06-08

### Fixed
- **Hide HA sidebar on Home Assistant 2026.6+**: the sidebar toggle only hid the icons, leaving the ~56px bar, because HA replaced the old material drawer (`.mdc-drawer`) with a new layout (`div.sidebar-shell` / `div.app-content`). The toggle now detects the new structure and collapses the whole bar; older HA versions keep the previous behavior.

---

## [2.5.6] - 2026-06-08

### Fixed
- **Card changelog now shows on the installed-card detail**: the "What's new" section was only wired into the community-card detail; for installed cards (premium included) the store uses the main detail panel, so the changelog didn't appear. It now renders there too, reading the changelog from the resolved remote manifest when an update is available.

---

## [2.5.5] - 2026-06-08

### Added
- **Card changelog in the store**: opening a card in the store now shows a "What's new" section with its version history. Entries newer than the installed version are highlighted, so before updating you can see exactly what changed. Card authors document changes in a per-card `CHANGELOG.md`, embedded into the store manifest at build time.
- **Home Assistant panel settings** (Settings → Home Assistant panel): a toggle to open Oikos on startup (sets it as HA's default dashboard via `frontend: default_panel`, since a custom panel can't be picked in the HA profile selector) and a picker to change the sidebar icon (e.g. a house). Both edit `configuration.yaml` with a backup and prompt for an HA restart.

---

## [2.5.4] - 2026-06-08

### Added
- **Support ticket when your email isn't verified**: if login fails because the address was never confirmed (some providers such as Hotmail/Live/Outlook often don't deliver the verification email), the login screen now offers a form to open a support ticket directly — no login required.
- **Microsoft email warning at sign-up**: registering with a `@hotmail`, `@live`, `@outlook` or `@msn` address now shows a notice that the verification email may not arrive, in all 5 languages.

### Changed
- **License check decoupled from the website**: the dashboard re-validates the license at most once every 24 hours instead of on every refresh, and keeps working from its local cache when the license server is unreachable. The add-on no longer blocks if the site is temporarily down.

### Fixed
- **Offline license validation restored**: signed offline tokens (EC P-256) are issued and verified again, so the dashboard can confirm its license without contacting the server for up to 48 hours. The feature was inactive because the signing key had been lost — a new key pair has been generated.

---

## [2.5.3] - 2026-06-07

### Changed
- **Settings — "Mobile" section**: *Single column on mobile* and *Auto-scale on mobile* are grouped into one dedicated **Mobile** section instead of two separate cards.
- **Weather animated background — clouds redesigned**: clouds are now one continuous soft shape (SVG "goo"/metaball filter) instead of visibly joined circles, with a vertical gradient for volume and a soft shadow. Each cloud has a unique procedural shape, an irregular (non-flat) lumpy bottom, and clouds are distributed in clusters — some grouped, some separate. Overcast conditions clump the clouds into a denser mass.

---

## [2.5.2] - 2026-06-07

### Fixed
- **Language switch to French/Spanish/German didn't apply** (e.g. in the wizard it stayed English). All five languages are now bundled directly instead of lazy-loading FR/ES/DE over HTTP, so switching to any language always works — no runtime fetch dependency.

---

## [2.5.1] - 2026-06-06

### Changed
- **Default language is now English** (`fallbackLng: en`) and browser-language auto-detection was removed from the picker order — a fresh install starts in English instead of inheriting the browser locale. A manually chosen language is still remembered in `localStorage`.
- **Setup wizard now starts with a language step**: the very first screen lets you pick the language (IT/EN/FR/ES/DE); the choice applies live so the rest of the wizard runs in the selected language.

---

## [2.5.0] - 2026-06-06

### Added
- **Four new premium store cards**: *Media Player* (artwork, transport, seek, volume, source), *Alarm* (alarm_control_panel: arm Home/Night/Away, disarm, PIN keypad), *Calendar* (upcoming events from `calendar.*` via `calendar.get_events`, day grouping, multi-calendar colors), *Covers* (shutters/garage/curtains with a **Modern** layout: animated window figure, drag-to-set position, dynamic light, type-aware figures, tilt for venetian blinds, grid + scroll).
- **System card**: added a **1h** range to the CPU/RAM trend charts (1h / 6h / 24h / 3d).
- **Doors & Windows badge** is now **configurable** (gear in the popup): turn auto-detect on/off, exclude unwanted sensors, add extra ones — no longer fixed auto-only.
- **Privacy policy** page (`docs/privacy/`), bilingual IT/EN, hostable on GitHub Pages.
- **Climatizzatore** (community card): optional home-humidity sensor override.

### Changed
- **License instance binding hardened**: the addon binds the license once to the real `ha-<uuid>` (bind-once; provisional random IDs get upgraded, a bound ID is never silently changed), and falls back to reading `core.uuid` from disk when the supervisor API isn't ready at boot. The client always sends the stable instance ID, never a per-browser hostname. → reliable "one license per HA install".

### Fixed
- **Store: installing a card emptied the others** — the community/premium stub list is now rebuilt from the last-known-good source cache (cards are preserved even when a fetch flakes), so installing one card no longer makes the rest disappear until a manual refresh.

---

## [2.4.0] - 2026-06-06

### Added
- **System card — CPU/RAM trend charts**: area charts over time with a 6h / 24h / 3d range selector, read from the configured CPU/RAM sensors via history. Toggle in card settings.
- **Doors & Windows chip + badge**: auto-detect door/window/garage opening sensors (by `device_class`). The chip shows how many are open; the badge opens a popup listing **which** ones (open first, tap → native more-info). 5 languages.
- **Two premium security cards** in the store: *Cameras* (single or multi viewer — one large main feed + clickable thumbnails, near-live snapshots, fullscreen, mobile arrow switcher, native HA stream on tap) and *Doors & Windows* (open/closed overview with auto-detect or manual sensors, elapsed time, "all closed" summary). 5 languages.

### Changed
- **Appliance card — Modern layout**: uniform figure height across all appliance types; animated progress ring + digital timer on the washer figure; larger figures; Statistics button moved inside the panel; figure centered and stacked on mobile.

### Fixed
- **Premium store HTTP 429**: the update checker no longer fires one premium-manifest request per installed card on a forced refresh — identical requests within a run are coalesced, so the aggregated premium manifest is fetched once. No more request burst to the license server.
- **License price stuck at €9,99**: Settings → License now reads the real plan price from the server (free → "Free", unreachable → hidden) instead of a hardcoded value.
- **Appliance program states untranslated**: raw phase-sensor states (e.g. `running`, `rinse`) are now localized via a `programs` map (~30 common washer/dryer/dishwasher states, 5 languages); the Modern progress ring is also larger and no longer cramped.
- **Irrigation popup button** "OK, got it" → "Close" (5 languages).

---

## [2.3.0] - 2026-06-04

### Added
- **Full 5-language support** — Italian, English, French, Spanish, German across the whole dashboard (all 12 namespaces) and **every built-in card, its settings and the card names** (Instant Status, Live Energy, Energy Flow, Image Energy Flow, Today, Forecast, Weather, Room, Batteries, Bill, System, Entity List/Cleanup, Person, Car, Tesla, Smart Card editor, HA Card, HTML Card, Card/Popup Panel, Thermostat, Vacuum settings, …). Community/premium store cards ship the 5 languages too (Vacuum, Light Control, Air Quality, Alexa, Bill, Waste Collection, Irrigation, Zigbee Watchdog, Mailbox, Wallbox, Appliance, VisioneViva). ~2.700 dashboard strings + per-card strings translated.

### Changed
- **Store update check** is now throttled (every 6 h or on manual refresh ⟳) with a persistent result cache, instead of running on every page open / card install. Installing a card removes it from the update list locally without a network re-check.
- **Weather card** — forecast sensors (`sm_fv_*`) are taken from the package automatically; settings now only ask for the weather entity.

### Fixed
- **Automatic popups** (custom/community) not appearing — popups now resolve from the merged card registry (built-in + plugin), not only the static one.
- **Store "update available" badges flickering** — the manifest fetch falls back to the last cached value when the premium proxy flakes, and concurrent checks are de-duplicated.
- **Irrigation (Orto) card crash** — a temporal-dead-zone (`switchOk` used before declaration) that the obfuscator exposed in Firefox.
- **Popup HA-condition trigger** — the Entity ID field now uses the entity picker instead of free text.
- Removed the deprecated `WEBGL_debug_renderer_info` console warning (uses `gl.RENDERER` first).

---

## [2.2.1] - 2026-06-02

### Added
- **VisioneViva (premium card)** — movie & TV catalog powered by TMDB. Poster grid (in theaters, upcoming, popular, trending, top rated), search (movies/TV/people), genre/year/sort filters. Detail sheet with synopsis, ratings, cast (actor drill-down to their other works), seasons & episodes, recommendations, where-to-watch streaming providers, image gallery, certification, saga/collection and YouTube trailers. Two layouts (**Modern** and **Cinema** — large poster over a backdrop with the film's title logo), full-screen poster lightbox, configurable cover count and size, optional trailer auto-play, and a TTL response cache (memory + localStorage) to avoid refetching. Bundled shared TMDB key with per-install override.

---

## [2.2.0] - 2026-06-01

### Added
- **Store — chip & badge packages** — chips and badges can now be published and installed as store packages (`manifest.type: "chip" | "badge"`). They appear and install directly in their own **Chips** / **Badges** tabs (community packages route to the right tab), and show up in the add-chip / add-badge pickers once installed. The **Card** tab now lists cards only.
- **Waste Collection (Raccolta Differenziata)** — new **premium card** showing today's and tomorrow's waste plus the whole week, with reminder notifications (push / Alexa / Google) repeated within a time window. Includes a built-in **badge** (today/tomorrow waste) and **chip** (next collection, shown only when it's today or tomorrow). Auto-installs the HA package `oikos_raccolta_differenziata` with configurable sources and per-day waste type.

---

## [2.1.0] - 2026-05-31

### Added
- **Themes** — fully custom color themes (complete palette). Theme library with one-tap switch, import from `.json` file, paste JSON, and an inline color-picker editor with live preview. Ships 7 Material Design presets (Indigo, Teal, Orange, Magenta, Purple, Cyan, Green) plus a **Liquid Glass** style (floating detached sidebar, glass cards, gradient background). New themeable tokens `--overlay-scrim` and `--knob`. Custom themes sync across devices.
- **Side navigation bar** — option to move the navigation bar to the side (left) on iPad/PC (≥900px); toggle in nav settings. Stays at the bottom on phones.
- **System card** — host/Supervisor performance monitor: CPU, RAM and disk usage (threshold-colored bars), temperature, uptime (from `last_boot`), and available updates auto-detected from `update.*` entities. Configurable entities.
- **Entity Cleanup card** — remove `unavailable`/orphaned entities, or filter the registry by text (e.g. "fridge"), with select-all and bulk removal via `config/entity_registry/remove`. **Automatic backup** of removed entities to `/config/oikos/backups/` before deletion (server endpoint `POST /api/oikos/backup`, with client-download fallback). Shows which entities could not be removed and why.
- **Badges — open a card on click** — new `popupCardId` option opens a popup-panel card on tap (same mechanism as chips).
- **Layout — copy a card to another page** — new toolbar action in edit mode copies a card (with its configuration) to any other page.

### Changed
- **Theme-aware components** — all first-party cards, chips and badges now use theme CSS variables instead of hardcoded colors, so they follow custom themes (Vacuum, Appliance, badges, chips, popups, scrims, toggle knobs).

### Fixed
- **Theme persistence** — the active theme no longer reverts to default after a re-sync (active id read/written as JSON for the server round-trip + 60s guard so a locally-changed key is not overwritten by a stale server value from the 30s poll).
- **Liquid Glass — card popups** — popups opened by cards were trapped inside the card; removed the `backdrop-filter` on card cells that created a containing block for `position: fixed` descendants.
- **Appliance popup** — restored the icon ring and accent colors (per-appliance accent kept as a hex value).
- **Lights badge** — the "N on" label no longer wraps onto two lines and gets clipped in the badge bar.

---

## [2.0.7] - 2026-05-28

### Added
- **Badge — popup sensori** — cliccando un badge con la lista `sensors` configurata si apre un modal con lo stato di tutti i sensori associati (`BadgeSensorsModal`).
- **Badge — colorRules dinamico** — il colore del badge cambia automaticamente in base allo stato aggregato dei sensori (`all_off` / `mixed` / `all_on`); configurabile dall'editor con campo `allOffColor`, `anyOnColor`, `allOnColor`.

### Fixed
- **Navbar — iOS notch/Dynamic Island** — aggiunto `padding-top: env(safe-area-inset-top)` alla Navbar; la seconda riga chip usa `top: calc(56px + env(safe-area-inset-top))`. Fix completo per iPhone con HA Companion App.
- **useGraphicsQuality — crash WebGL renderer detection** — corretto accesso a `UNMASKED_RENDERER_WEBGL` tramite `ext` object; fallback a `gl.RENDERER` se l'estensione non è disponibile.
- **Vite — chunk filename con caratteri speciali** — `chunkFileNames` ora sanitizza il nome del chunk (`replace(/[^a-zA-Z0-9_-]/g, '_')`) per evitare errori di deploy con path non validi.

---

## [2.0.6] - 2026-05-27

### Changed
- **Layout — autoScale in modalità modifica** — il ridimensionamento proporzionale delle card affiancate (`cardCols > 1`) ora è attivo anche in modalità modifica; prima avveniva solo all'uscita dall'edit mode. Il clipping è gestito da un wrapper interno così la toolbar della card non viene tagliata.

---

## [2.0.5] - 2026-05-26

### Fixed
- **Dashboard — `LayoutGrid is not defined`** — `LayoutGrid` usato nel registry della card `card-panel` non era incluso nell'import da `lucide-react`; causava crash dell'intera dashboard al caricamento.

---

## [2.0.4] - 2026-05-26

### Added
- **Irrigation card v1.7.x — stepper durata manuale** — controllo `−` / `+` a fianco del tasto "Avvia manuale" per impostare i minuti prima dell'avvio; valore predefinito da `input_number.irrigatore_durata_irrigazione`. L'irrigazione parte tramite script HA (`script.irrigatore_acqua_e_orto`) con auto-stop server-side — funziona anche a browser chiuso.
- **Irrigation card — storico sessioni 7 giorni** — pannello espandibile con lista sessioni (durata, ora inizio/fine) recuperate da `fetchHistory` sulle tre entità consuntivo. Sezione vuota se nessuna sessione nell'arco.

### Fixed
- **Irrigation card v1.7.3 — `Template rendered invalid service: unknown`** — HA valuta i template `service:` in tutti i branch di `choose:` prima di controllare le condizioni (eager evaluation); le guardie di condizione da sole non bastano. Aggiunto `continue_on_error: true` su tutti gli 11 service-call template in entrambi i file YAML (IT + EN). Lo script non abortisce più quando `input_text.irrigatore_push_service` o `irrigatore_telegram_service` è in stato `unknown`.
- **Irrigation card — stato "in irrigazione" non visibile** — `isIrrigating` dipendeva solo dallo switch HA che resta `off` per qualche istante dopo l'avvio dello script. Aggiunto `scriptRunning = getState('script.irrigatore_acqua_e_orto') === 'on'` come fallback; la card mostra subito lo stato attivo.
- **Irrigation card — `precipitation_probability` crash con open-meteo** — open-meteo non espone questo attributo nel forecast; accesso diretto causava `UndefinedError`. Fix: `fc.get('precipitation_probability', 100)` con default 100% in tutti i sensori template (3 occorrenze, IT + EN).
- **Irrigation card — package bloccato a v1.6.2** — l'header `# oikos:package_version:` in entrambi i YAML non era aggiornato; `usePackageInstaller` usava quella versione per decidere se aggiornare il package. Allineato a ogni release.
- **Store update checker — aggiornamenti premium non visibili** — `/api/store/manifest` richiede il cookie di sessione ingress ma `cardUpdateChecker.js` usava `fetch` plain → 401 silenzioso → array vuoto. Fix: `isAddonUrl()` rileva URL stesso-origin e usa `apiFetch`; URL esterni usano `fetch` plain per evitare CORS.

### Changed
- **Irrigation card v1.7.x — avvio manuale via script HA** — il tasto "Avvia manuale" non chiama più direttamente `switch.turn_on`; imposta `input_number.irrigatore_durata_irrigazione` e lancia `script.turn_on` su `script.irrigatore_acqua_e_orto`. L'auto-stop è server-side (delay HA), indipendente dal browser.

---

## [2.0.3] - 2026-05-26

### Added
- **Addon — porta host configurabile** — `ports: 3000/tcp` ora ha default `3000` ma è modificabile dall'utente nella scheda **Rete** dell'addon in HA Supervisor. Utile se un altro addon occupa già la porta 3000.

### Fixed
- **iOS — Navbar sovrapposta alla status bar** — aggiunto `padding-top: env(safe-area-inset-top)` alla Navbar; il contenuto (orologio, chip, pulsanti) viene posizionato sotto il notch/dynamic island. La seconda riga chip mobile usa `top: calc(56px + env(safe-area-inset-top))`. Fix su tutti i dispositivi iPhone con HA Companion App.
- **Irrigation card v1.6.6 — `callService` con oggetto invece di stringa** — `handleStart`, `handleStop`, `handleReset` in Card.jsx passavano un oggetto `{ entity_id: ... }` come terzo argomento (firma raw HA) invece della stringa entityId richiesta dall'SDK Oikos. Stessa correzione applicata ai 6 `useEffect` di sync in Settings.jsx e a `HaTimeRow`.
- **Irrigation card — sensore temperatura errato in Settings** — al mount, sensori del package (es. `sensor.irrigatore_temperatura_prevista_domani`) venivano salvati come sensore "temperatura attuale" dell'utente. Aggiunto reset `PACKAGE_SENSORS` e auto-select corretto su `sensor.irrigatore_temperatura_corrente`.
- **Irrigation card — `sensor.irrigatore_temperatura_corrente` restituiva 0** — il template YAML usava `| float(0)` quando l'entità meteo era vuota, mostrando `0°` invece di `—`. Fix: `this.state` come fallback per preservare l'ultimo valore noto.
- **Irrigation card — fallback `tempDomani`/`pioggiaDomani` semanticamente errato** — il fallback usava `config.temperatureSensor` (sensore fisico) per la metrica "domani". Ora usa `sensor.irrigatore_temperatura_corrente` / `sensor.irrigatore_pioggia_corrente` (sensori del package).
- **Card picker — anteprime PNG assenti** — le card premium installate prima del supporto preview non mostravano l'immagine di anteprima nel pannello `+card`. Fix: `prepare-addon.sh` copia le PNG in `public/card-previews/<id>.png`; il server usa quel percorso come fallback se `cards-store/<id>/preview.png` è assente.

### Changed
- **Irrigation card v1.6.6 — sensori temperatura/pioggia semplificati** — rimosso il picker "Sensore pioggia attuale"; `input_text.irrigatore_rain_sensor` viene impostato automaticamente a `sensor.irrigatore_pioggia_corrente` (sensore del package). Il picker "Sensore temperatura esterno" rimane con nuovo hint: se disponibile usa il sensore fisico, altrimenti usa la temperatura dal meteo.
- **Irrigation card — label "Sensore temperatura attuale" → "Sensore temperatura esterno"** — chiarisce che il campo è per un sensore fisico opzionale, non per il sensore derivato dal meteo.

---

## [1.1.0] - 2026-05-22

### Added
- **Mobile — auto-scale uniforme card che strabordano** — se una card ha larghezza interna superiore al contenitore (tipico su mobile con configurazione desktop), viene scalata proporzionalmente in X e Y (`scale(ratio)`) in modo da rientrare nello schermo. Il sistema misura la larghezza naturale del contenuto via `scrollWidth` e aggiorna il fattore di scala via `ResizeObserver` al resize/rotazione. Attivo solo fuori da editMode.
- **Store — conflict detection installazione card** — quando si installa una card con stesso `id` ma proveniente da una sorgente diversa (community ↔ premium), il server restituisce `409 { conflict: true, existing, incoming }`. La UI mostra un dialog di conferma; se confermato, re-invia con `force: true`.
- **Comunità card `appliance-list`** — la card lista elettrodomestici in `oikos-cards` rinominata da `appliance` a `appliance-list` per co-installazione con la premium `appliance`. Dist files aggiornati.

### Fixed
- **Mobile — colonna singola sempre attiva sotto 768 px** — `forceSingleCol` ora è incondizionato su mobile (rimosso il legame con la preferenza utente `getMobileSingleCol`). Le celle si impilano verticalmente sempre; le card affiancate dentro una singola cella (`cardCols=2/3`) rimangono affiancate e vengono auto-scalate.
- **Mobile — `getMobileSingleCol()` default era `false` su device nuovi** — il default era derivato da `window.innerWidth <= 768` a module-load (sincrono), restituendo sempre `false` sul server o prima del paint. Ora il default è `true` (opt-out esplicito).
- **`prepare-addon.sh` — `server.js` ri-offuscato ad ogni run** — rsync sovrascriveva la destinazione offuscata con il sorgente plain ad ogni esecuzione. Fix: `server.js` escluso da entrambi i blocchi rsync; nuovo helper `_deploy_server()` con pattern cache+sentinel (`dist-panel/.server.obf`, `.server-obf-cache.js`) — offusca solo se sorgente più recente del sentinel, altrimenti riusa la cache. `OIKOS_DEV=1` bypassa l'offuscazione.

---

## [1.0.9] - 2026-05-21

### Added
- **`PackageSection` — collapsible with auto-collapse** — the install section is now collapsible; it auto-collapses after a successful package install (detected via `false → true` transition on `installed`). `Section` component gains optional controlled mode (`open` + `onToggle` props) to support this.
- **Appliance card — install section moved to top** — `sectionPackage` is now the first section in `ApplianceSettings`, matching the standard layout of all other premium cards. Auto-collapse state added inline (uses `useRef` transition detection, same pattern as `PackageSection`). Bumped to v0.5.15.

### Fixed
- **Community/premium cards — i18n locale files 404 on load** — three-layer fix:
  - `POST /api/cards/install` now downloads `i18n/{it,en,fr,de,es}.json` alongside every card bundle at install time.
  - On-demand route `GET /cards-store/:id/i18n/:lang.json` fetches and caches missing locale files for cards already installed; falls back to Docker-bundled copies for premium cards.
  - Boot repair: `setImmediate` block on server start scans `cards-store/` and back-fills any missing `i18n/` dirs from `.meta.json` → re-download. Eliminates all i18n 404s without reinstalling cards.
- **`prepare-addon.sh` / Dockerfile / `run.sh`** — `cards-i18n/` directory now collected from both `oikos-cards` and `oikos-cards-premium` repos, bundled into the Docker image, and deployed to existing card installs at addon boot.
- **"Flusso Energia su Immagine" settings — strings hardcoded Italian** — `ImageFlowSettings.jsx` fully migrated to `useTranslation('cards')`; all node labels, flow labels, placeholder text, builtin flow names and hint strings now use i18n keys. Five locale files updated with `imageflow.*` keys.

---

## [1.0.8] - 2026-05-20

### Added
- **WeatherForecastCard — collapsible forecast section** — "Next days" panel can now be collapsed or expanded; state persisted per-card via `useCardConfig`.

### Fixed
- **Card/badge picker — names and descriptions hardcoded Italian** — `SortableCard`, `CardPickerModal` and `BadgePickerModal` now use `useTranslation('cards')` for all name/desc strings; all five locale files updated.
- **MDI icon picker — search stuck on "Loading"** — `@mdi/js` chunk is now pre-loaded at mount instead of on first open; `.catch()` added so a failed import falls back to FAVORITES; search works immediately even before the chunk arrives.
- **HACS settings — "Enable all" button did nothing** — `showAllHacsCards()` was called without arguments; `undefined` caused `JSON.stringify` to drop the `allowed` key, saving `{}` and loading as an empty list. Fixed by passing `hacsCards.map(c => c.id)`.
- **HA-card visual editor — Mushroom entity selection resets** — `VisualEditor` now feeds `cardConfig` back to the config element after every external change via a new `useEffect`. A `suppressRef` + `requestAnimationFrame` guard blocks the bounce-back `config-changed` event that stateless editors (Mushroom, etc.) fire in response to `setConfig`.
- **Community cards — i18n locale files 404 on load** — `POST /api/cards/install` now downloads `i18n/{it,en,fr,de,es}.json` alongside the bundle. An on-demand route (`GET /cards-store/:id/i18n/:lang.json`) fetches and caches missing locale files for cards already installed; eliminates all i18n 404s on load.

---

## [1.0.7] - 2026-05-20

### Added
- **Appliance wizard** — when configuring the first appliance card, a wizard lets you select all the appliance types you want and installs all their HA packages in one batch. A single HA restart covers everything.
- **Wallbox typology** — `wallbox` added to the appliance system with MDI icon `ev-station`.

### Fixed
- **Badge editor — entity picker closes editor on select** — clicking an entity in the picker caused the entire editor to close. `EntityPickerModal` instances were children of the outer `onClick={onClose}` overlay; React bubbled the synthetic click up through the component tree. Fix: moved pickers outside the overlay div into a fragment.
- **PackageSection precheck false positive** — `configuration.yaml` packages warning always showed because the frontend checked `pkg.precheck.hasPackagesInclude` (undefined) instead of `pkg.precheck.hasPackages`. Fix: corrected key name.
- **BottomNav — icons clipped on rounded-corner phones** — leftmost and rightmost nav tabs were cut off on phones with rounded display corners. Fix: added `padding-left/right: max(env(safe-area-inset-left/right), 8px)` and `padding-bottom: env(safe-area-inset-bottom)` to the nav bar.
- **WeatherCard — remaining Italian strings** — `FASCIA_MAP` labels, forecast panel header, `tomorrowProduction`, `maxTempForecast`, `estimated`, loading button and `nextDays` were still hardcoded Italian. All migrated to i18n keys in all five locales.

### Changed
- **`PackageSection` standardized across all cards** — component now includes: green update-available banner, always-visible Reinstall button, built-in Uninstall button, styled operation message with icons. All five locale files updated with `reinstallBtn`, `uninstallBtn`, `updateAvailable`, `updateVersion`, `updateBtn` keys. Premium cards (zigbee-watchdog 1.1.2, mailbox-card 1.8.17, irrigation 1.5.6, wallbox 1.0.1) moved `PackageSection` to top of settings; wallbox custom pkg section replaced with standard component.
- **`SETTINGS_STANDARD.md`** — updated with full `PackageSection` capabilities and mandatory first-position rule.

---

## [1.0.6] - 2026-05-19

### Added
- **Store — `repository.json`** — new lightweight catalog format: a root `repository.json` lists card paths; the Store fetches individual `manifest.json` files in parallel (`Promise.all`) instead of a single monolithic file. Zero duplication: each card's `manifest.json` is the sole source of truth. Backward-compatible fallback to legacy `manifest.json` if `repository.json` is not found.
- **`tier: "free"`** added to all `oikos-cards` card manifests.

### Fixed
- **Popup buttons not clickable** — `#oikos-overlay` (portal root) was appended as a sibling of `#oikos-root` in the shadow DOM. React 18 event delegation listens on `#oikos-root`; events from sibling portals never reached it. Fix: overlay is now a child of `#oikos-root`, restoring click handling for all modals and notifications.
- **Night-mode colors in `StatsModal` / `DetailModal` (appliance card)** — hardcoded inline colors based on a `dark` boolean that was not synced with the HA night theme. Replaced with CSS custom properties (`--bg-elevated`, `--text-primary`, `--text-muted`) which the Oikos shadow DOM already sets correctly for all themes.

### Changed
- **i18n — complete second pass** — all remaining hardcoded Italian strings migrated to `useTranslation` across ~40 dashboard components (BadgesBar, Navbar, BottomNav, BollettaCard, ImageFlowCard, BatteriesSettings, RoomCard, SmartCardEditor, MdiIconPicker, StepHacs, StepTutorial, and more). Five new namespaces registered in bundle: `login`, `license`, `screensaver`, `chips`, `badges`.
- **Package naming standard** — `silviosmart_elettrodomestici` renamed to `oikos_elettrodomestici` in the appliance card. Standard: all HA package subdirs use the `oikos_` prefix.
- **`oikos-cards` / `oikos-cards-premium`** — room-sensor `relTime()` and `EmptyState` now use translation keys; appliance `DetailModal` strings migrated to i18n.

---

## [1.0.5] - 2026-05-17

### Added
- **Internationalization (i18n)** — full multilingual system built on `i18next` + `react-i18next`
  - Italian and English always bundled (zero latency); French, Spanish and German lazy-loaded via HTTP backend
  - 6 namespaces: `common`, `layout`, `wizard`, `tutorial`, `settings`, `cards`
  - Language selector in Settings page — preference stored in `localStorage` and auto-detected from browser on first launch
  - Native i18next plurals replace manual ternary hacks (e.g. "1 day left" / "3 days left")
  - Dates and numbers use `i18n.language` instead of hardcoded `'it-IT'` locale
  - Vite automatically copies lazy locale files (`fr/es/de/*.json`) to `dist-panel/locales/` on every build
- **SDK i18n (v1.2.0)** — three new public exports in `@oikos/sdk`:
  - `useT(namespace)` — `t()` hook in the current language
  - `registerCardTranslations(namespace, { it, en, … })` — registers translation bundles into the shared i18n instance (idempotent)
  - `i18n` — shared i18next instance for reading or changing the current language
- **Community card translations** (`oikos-cards`) — 10 cards now ship `src/i18n/it.json` + `src/i18n/en.json`:
  air-quality, bridge-status, climatizzatore, clock, person, room-sensor, thermostat, tigo-panels, vacuum, yesterday
- **Premium card translations** (`oikos-cards-premium`) — 5 cards now ship `src/i18n/it.json` + `src/i18n/en.json`:
  appliance, irrigation, mailbox-card, wallbox, zigbee-watchdog
- **Tutorial wizard — two new interactive steps** (12 → 14 total):
  - `close-lights-panel` (step 12) — guides the user to press ⚙️ again and tap the backdrop to close the Lights panel
  - `exit-edit` (step 14) — guides the user to tap "Done editing" before proceeding to the Store slides
- **`oikos-lights-panel-closed`** — new custom event fired by `LightsChip` when its bottom sheet closes; used by the tutorial to advance step 12
- **`oikos-lights-updated`** — event fired by `saveLights()` so the tutorial detects when the user adds a light entity
- **`TRANSLATIONS.md`** added to both `oikos-cards` and `oikos-cards-premium` with instructions for adding new languages
- **`CHANGELOG.md` copied to `oikos-addon/`** during `prepare-addon.sh` so the file is included in every add-on build

### Changed
- `applyDefaultLayout` now accepts `{ preserveLayout: true }` — when the wizard completes, the home layout built during the tutorial is no longer wiped
- Tutorial step 11 (`select-light`) now advances on `oikos-lights-updated` (light added) instead of `badge-settings-closed`; the new step 12 handles panel dismissal
- `forceTop: true` added to steps `configure-badge`, `select-light`, `close-lights-panel`, `add-chip`, `exit-edit` — keeps the guide card at the top when the target element is inside a bottom sheet
- `noDim: true` added to steps `add-chip` and `close-lights-panel` — bottom sheets are no longer dimmed by the tutorial overlay
- `DEFAULT_CHIPS = []` — no chips pre-loaded on fresh install; the user adds the Temperature chip during the tutorial
- `SDK_VERSION` bumped from `1.1.0` to `1.2.0`

### Fixed
- Completing the wizard wiped the Weather card added during the tutorial; fixed by passing `preserveLayout: true` to `applyDefaultLayout`
- Missing `useEffect` import in `LightsChip.jsx` caused `ReferenceError: useEffect is not defined` at tutorial step 10

---

## [1.0.4] - 2026-05-16

### Added
- **Tutorial wizard** — interactive 7-step guided tour of the dashboard UI
  - Spotlight effect on the ⋮ menu button using SVG mask (shadow DOM compatible)
  - Amber ring + animated arrow to highlight the target element
  - Pulsing beacon rings for all non-spotlight steps
  - Steps: open menu → add row → add column → add card → move card → configure card → side-by-side info
  - All steps positioned top-left with slide-in animation
  - "Skip this step" link on optional steps
- **Tutorial card filter** — during the "add card" step the picker shows only the Weather Forecast card (`weather-forecast`), guiding the user to add the right card
- **`configure-card` tutorial step** — teaches the user to open a card's settings via the ⚙️ toolbar button; replaces the former `add-card-2` step
- **Store wizard steps** — three new wizard slides explaining the Store (intro, sections, community & premium)
  - `StepStore.jsx` with animated variants: `store-intro`, `store-sections`, `store-premium`
- **`tutorialStore.js`** — lightweight module-level store for the tutorial card filter (`setTutorialCardFilter`, `clearTutorialCardFilter`, `getTutorialCardFilter`)
- **`defaultLayout.js`** — shared utility that applies the standard Oikos default layout (Home + Statistics, weather card, temperature chip, lights badge); used by both SetupWizard and SettingsPage
- **Settings page — layout reset (fixed)** — "Ripristina layout predefinito" now correctly clears all `oikos-dashboard-*` keys (real storage location) instead of the legacy `oikos-layout-v2` key; nullifies the removed keys on the server so they are not re-imported on next boot
- **Settings page — factory reset** — new "Reset completo" section that:
  - Downloads a backup automatically before wiping
  - Clears all `oikos-*` keys except `oikos-license-key` and `oikos-ha-config`
  - Nullifies the cleared keys on the server
  - Reloads the app → wizard restarts as if it were a fresh installation
- **`nullifyServerKeys(keys)`** in `backupRestore.js` — POSTs `null` values for a list of keys to the server, effectively removing them from the remote config without requiring a DELETE endpoint
- **Two-step confirmation** for both reset actions — prevents accidental data loss
- **Shadow DOM fix in `TutorialGuide`** — `document.querySelector` cannot find elements inside the Lovelace `panel_custom` shadow root; fixed by attaching a hidden anchor ref and using `getRootNode()` to query within the correct shadow root
- **`data-tutorial-target` on card settings button** — `SectionLayout` settings button now dispatches `oikos-card-settings-opened` custom event when clicked, detected by the tutorial
- **CardPickerModal tutorial mode** — when a tutorial filter is active the picker switches to a simplified full-width UI showing only the filtered card with an amber tutorial banner, hiding search and tab bar

### Changed
- Tutorial starts from a completely empty dashboard (no placeholder row pre-seeded); the user creates the first row themselves during step 2
- `applyDefaultLayout` extracted from `SetupWizard.jsx` into `src/utils/defaultLayout.js` and shared with `SettingsPage`
- Settings auto-open after card selection is suppressed during tutorial mode (user opens settings manually at the configure-card step)
- PreviewPane "Aggiungi alla dashboard" button pinned to the bottom of the panel; preview image fills the remaining space
- Wizard step labels updated: "Seconda" → "Configura"
- Version bumped to `1.0.4` in both `package.json` and `oikos-addon/config.yaml`

### Fixed
- `applyDefaultLayout` was duplicated between `SetupWizard` and `SettingsPage`; now lives in a single shared module
- Layout reset was a no-op (removed a non-existent legacy key); now targets the correct `oikos-dashboard-*` namespace and also clears the server copy
- Framer Motion `transform` conflict with CSS `translateX(-50%)` on the tutorial card — resolved by using `x: '-50%'` in motion props (later removed when switching to fixed top-left positioning)

---

## [1.0.3] - 2026-04-xx

### Added
- Setup wizard with feature detection (photovoltaic system yes/no)
- Standard default layout applied on first install (Home + Statistics pages)
- FV feature flag hides FV-only chips and badges when disabled

### Fixed
- Tesla card image aspect ratio (16/7 instead of fixed height)
- Store plugin tier propagation to PLUGIN_REGISTRY for premium badge display
- GlobalPopupSheet backdrop no longer blocks card-level popups
- Person card replaced Google Maps iframe with static OSM image

---

## [1.0.2] - 2026-03-xx

### Added
- Global popup sheet (`GlobalPopupSheet`) with slide-up/left/right animation
- Popup panel card type (`popup-panel`) with configurable child cards
- `openPopup` / `closePopup` in DashboardContext

---

## [1.0.1] - 2026-02-xx

### Added
- Card drag & drop between columns and rows (cross-row support)
- Column resize (flex ratio cycling) and card resize (drag handle)
- Duplicate card action with config copy

---

## [1.0.0] - 2026-01-xx

### Added
- Initial release of Oikos Dashboard
- Section layout engine (Rows → Columns → Cards)
- Card registry with built-in cards: weather, energy, FV forecast, lights, people, system
- Store with Oikos, HACS, and Community tabs
- Chip bar and page badges
- HA WebSocket connection with real-time state updates
- Dark / light theme with auto-schedule
- Backup & restore (JSON export/import)
- License gate (Stripe + PayPal)
