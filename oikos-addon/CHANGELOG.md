# Changelog

All notable changes to Oikos are documented in this file.
Format follows [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).
Versioning follows [Semantic Versioning](https://semver.org/).

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
