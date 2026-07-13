# Changelog

All notable changes to Oikos are documented in this file.
Format follows [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).
Versioning follows [Semantic Versioning](https://semver.org/).

---

## [2.6.54] - 2026-07-13

### Added
- Screensaver: cards you already configured on your dashboards (including "Card YAML") can now be added as widgets with their own settings — the "Add card" menu has a new "From dashboard" group. Before, cards always appeared with default settings, so YAML cards showed up empty.

### Fixed
- Screensaver: cards are now always rendered with the dark theme inside the screensaver (and its editor preview) — with the light theme they appeared white and unreadable over the background.
- Screensaver editor: dropdown menus were unreadable (white on white) on some devices — options now use explicit theme colors.

## [2.6.53] - 2026-07-09

### Added
- Screensaver editor: optional grid overlay and snap-to-align ("magnet") with visual alignment guides against other widgets and screen edges/center.
- Screensaver editor: preview now uses the real aspect ratio of your device, with presets (16:9, 4:3, 9:16). Devices that run the screensaver register their resolution automatically and appear in the list — edit on your PC, preview exactly what the tablet will show.
- Screensaver editor: widgets can be dragged from anywhere on their body, clicked to select, nudged with arrow keys (Shift = larger steps) and removed with Del.

### Fixed
- Screensaver: widgets and cards are no longer cut off at screen edges — layouts saved on a different device are clamped into view and oversized cards scale down automatically.
- Screensaver editor: cards in the preview now render at the real device width, so their layout matches what you actually see on screen.

## [2.6.52] - 2026-07-03

### Changed
- Licensing reliability improvements.

## [2.6.51] - 2026-07-02

### Added
- The "update available" banner now shows both versions (e.g. "2.6.50 → 2.6.51"), not just a generic notice.

### Fixed
- Home Assistant's built-in cards (entities, glance, picture-elements, gauge, markdown, etc.) can now be used inside the "Native HA card" card — before they showed "unsupported type". Only custom (HACS) cards worked previously.

## [2.6.50] - 2026-06-26

### Added
- **Multiple PV plants (multi-inverter)**: you can now define several solar plants in Settings → Solar plants (name, kWp, photo, and entities for production, battery and grid). The energy cards show the **combined production** automatically; the Image Flow card lets you choose per card between aggregated total or a per-plant breakdown. If you have a single inverter, nothing changes.

## [2.6.49] - 2026-06-26

### Fixed
- Graphics quality (High / Medium / Low) now actually takes effect: before, switching it changed almost nothing. Medium removes blur and flattens shadows/transitions; Low turns off animations, blur and shadows for the smoothest experience on slower devices.

## [2.6.48] - 2026-06-26

### Fixed
- Configuring a card placed inside a Card Panel / Popup Panel now opens its settings correctly: before, the editor came up blank (white on white, no controls visible) because it lost the theme styles.

## [2.6.47] - 2026-06-25

### Changed
- When opening a support ticket, the diagnostics are no longer attached automatically: a new optional checkbox "Include diagnostics" lets you decide whether to share versions, errors and system status.

### Fixed
- The "Open ticket" button now shows a clear hint when it's greyed out (subject and message too short), so it's obvious what's missing instead of looking broken.
- Internal: clearer support reports (license state and de-duplicated repeated errors) to speed up troubleshooting.

## [2.6.46] - 2026-06-20

### Fixed
- The "update available" banner now also appears on computers kept open for a long time: the version is re-checked periodically and when you return to the tab, not only at first load.

## [2.6.45] - 2026-06-20

### Changed
- The diagnostics report (download / send to support) moved to the Support page too, next to tickets — no longer in Settings.

## [2.6.44] - 2026-06-20

### Added
- Login security: after 3 failed attempts the account is locked and can only be recovered via "Forgot password" (a temporary password is emailed, which must be changed at first login). Works from both the add-on and the website. The website account page now also lets you change your password.

## [2.6.43] - 2026-06-20

### Changed
- Support tickets moved to their own "Support" page in the three-dots menu (open a ticket + read/reply), instead of being inside Settings.

## [2.6.42] - 2026-06-20

### Added
- Support tickets are now fully interactive from the panel: Settings → My tickets lets you read replies and reply, without going to the website.

## [2.6.41] - 2026-06-20

### Fixed
- HACS cards: all of them now show up in the card picker. Some setups only listed 2-3 because their resources weren't all loaded — they're now preloaded in parallel at startup. Thanks to **G-LuKe** for the fix.

### Added
- Support tickets from the panel: Settings → Diagnostics → "Open a ticket". The diagnostics report is attached automatically, no need to go to the website.

## [2.6.40] - 2026-06-20

### Added
- Diagnostics: Settings → Diagnostics lets you download a technical report (versions, environment, installed cards/packages, recent errors, connectivity) or send it to support, which returns a short code to paste into your ticket. No sensitive data, license key masked.

## [2.6.39] - 2026-06-20

### Fixed
- Badge/chip popups (lights, openings, shutters, vacuum, custom badges) rendered unstyled — white, full-width, no labels — after the previous update. They now open correctly themed, above the cards.

## [2.6.38] - 2026-06-20

### Changed
- Package cards: after a package update, the card settings now clearly show that Home Assistant needs a restart to apply the new features (before you only saw it in the notifications).
- Premium cards now require an active subscription to load.

## [2.6.37] - 2026-06-20

### Changed
- HACS cards: removed the manual enable step (in Settings and the setup wizard). All detected HACS cards are now available in the card picker right away.

## [2.6.36] - 2026-06-20

### Fixed
- Badge popups (lights, openings, shutters, vacuum and custom badges) now open above the cards instead of behind them (iOS).

### Added
- Panel/popup container cards: each card you add inside can now be configured directly, with a settings button next to it.

## [2.6.35] - 2026-06-20

### Fixed
- The required `packages:` line is now added to configuration.yaml automatically at startup (with the folder), so card packages load without any manual step.

### Changed
- Animated weather background and graphics quality are now remembered **per device** (phone vs computer) and survive app restarts.

## [2.6.34] - 2026-06-20

### Fixed
- The "animated weather background" setting now stays off after reopening the app (it was reverting on iOS).

## [2.6.33] - 2026-06-20

### Changed
- License handling improvements.

## [2.6.32] - 2026-06-20

### Fixed
- Installing a card's package now works in Docker mode (the request no longer fails after a while).
- Icon picker no longer fails to open on some cards (fixed a broken lazy-loaded module).

## [2.6.31] - 2026-06-20

### Fixed
- Card translations (extra languages) now load correctly in Docker mode.

## [2.6.30] - 2026-06-19

### Fixed
- Installing premium cards now works in Docker mode.

### Added
- The current Oikos version is now shown in the License panel.

## [2.6.29] - 2026-06-19

### Changed
- Microsoft email addresses (Hotmail, Outlook, Live) are temporarily not accepted when signing up, because the confirmation email often doesn't reach them. Please use a different address (e.g. Gmail).

## [2.6.28] - 2026-06-19

### Fixed
- Subscription and plan pages now load correctly from any Home Assistant address.

## [2.6.27] - 2026-06-19

### Fixed
- With photovoltaic turned off, solar cards no longer appear in the "Add card" menu.

## [2.6.26] - 2026-06-19

### Fixed
- With photovoltaic turned off, solar cards (e.g. Tigo Panels) no longer appear in the Store.

## [2.6.25] - 2026-06-19

### Changed
- More consistent card layout in the Store: title on top, image below.

## [2.6.24] - 2026-06-19

### Fixed
- Premium card previews now show correctly in Docker mode.

## [2.6.23] - 2026-06-19

### Fixed
- Fixed several features (Store, settings, card management) that weren't working in Docker mode.

## [2.6.22] - 2026-06-19

### Added
- Image Flow card: new "Invert grid sign" and "Invert battery sign" options, for inverters that report values with the opposite sign (e.g. Sofar/Solarman).

## [2.6.21] - 2026-06-19

### Fixed
- Several fixes for Docker mode (settings, uninstall, card install).

### Added
- Image Flow card: the battery charge % can now be chosen directly in the card settings; if not set, the battery shows kW.

## [2.6.20] - 2026-06-18

### Added
- **Docker (Home Assistant Container) support**: Oikos can now run as a standalone Docker container and works from anywhere, Nabu Casa included. First-time setup is automatic — just restart Home Assistant once.

### Changed
- Security and stability improvements for Docker mode.

## [2.6.19] - 2026-06-18

### Added
- **"Add it automatically" for the packages include**: cards that need an HA package now offer a one-click button to insert `packages: !include_dir_named packages` into `configuration.yaml` (with a timestamped backup). If the file structure is unclear (commented/inline `homeassistant:`, an existing `packages:` with a different value) it does **not** touch the file and tells you to add the line manually.

### Fixed
- **Package install is blocked until the include is present**: previously the package YAML could be written even without `packages: !include_dir_named packages`, so HA never loaded it and the entities never appeared (leading users to recreate the sensors by hand). The install is now disabled with a clear, copyable hint until the include is added.

## [2.6.18] - 2026-06-18

### Fixed
- **Solar/FV cards are now hidden inside Card Panels and popups too** when the photovoltaic feature is turned off in Settings — previously the filter applied only to top-level cards and the Store.
- **No more console warning when no weather entity is configured**: the forecast fetch fails benignly and falls back to the entity attribute; the warning is now only logged for real errors.

## [2.6.17] - 2026-06-18

### Fixed
- **Registration page showed wrong trial/price** (stuck at the 15-day / €9.99 defaults): the page couldn't read `/api/public/settings` and `/api/public/plans` because the license gate blocked them before activation. They're now public, so the page shows the real values (e.g. 40-day trial) and the plan's actual price with its real period (e.g. **€9.99/year**, no longer divided into a misleading monthly figure).
- **HA connection form hidden in panel mode** (add-on and Docker): the host/WebSocket/token form is only relevant when running Oikos as a standalone web app outside Home Assistant. In panel mode the connection is automatic via `hass`, so the form is hidden to avoid confusion (it could show a stale host).

## [2.6.16] - 2026-06-18

### Fixed
- **Login screen now follows the Home Assistant language.** It defaulted to English regardless of your HA language; it now switches to HA's language (it/en/fr/es/de) as soon as HA is available, unless you picked a language manually.
- **Login footer showed a raw i18n error** ("key 'support (en)' returned an object instead of string"): the support contact line referenced an object key. Added a dedicated `needHelp` string in all 5 languages.

## [2.6.15] - 2026-06-18

### Fixed
- **Store: premium cards weren't recognizable on mobile.** The "Premium" badge only showed in the desktop layout, so on phones (compact list) premium cards looked identical to free ones. Premium cards now show a "PRO" mini-badge next to the name in the compact list too.

## [2.6.14] - 2026-06-18

### Fixed
- **Chip editor: Save button cut off on mobile.** The editor panel (92dvh, centered) overflowed below the browser bar, so the Save button was unreachable. On phones (≤720px) it's now a bottom sheet (anchored to the bottom, 94dvh) with safe-area padding, so Save/Cancel are always reachable.

## [2.6.13] - 2026-06-17

### Added
- **"Invert battery sign" option** (Settings → Energy flow): companion to the grid-sign option. Some inverters (e.g. Sofar/Solarman) report battery power with the opposite sign, so charge/discharge appeared swapped in the flow. Enabling it flips the battery sign across the Hero, Live boxes and Energy flow cards.

## [2.6.12] - 2026-06-17

### Added
- **"Invert grid sign" option** (Settings → Energy flow): some inverters/meters (e.g. Sofar/Solarman) report grid power with the opposite sign to Oikos' convention, so the flow showed "drawing from grid" while the system was actually exporting (and vice versa). Enabling the option flips the sign across the Hero, Live boxes and Energy flow cards.

## [2.6.11] - 2026-06-12

### Fixed
- **Card translations now update correctly after a card update**: new i18n keys added by an updated card (e.g. a new state label) showed up as the raw key (like `subtitle.charging`) until a full page reload, because the translation registrar skipped a namespace already loaded in the session. It now always merges/overwrites, so updated card translations apply immediately.

## [2.6.10] - 2026-06-11

### Fixed
- **iPad: the bottom navbar could be dragged up, revealing a black gap below it.** iOS rubber-band overscroll on the scrollable content was chaining up to the Home Assistant page body, lifting the whole panel. Overscroll chaining is now contained on the scroll container and on `<body>`, so the layout stays anchored.

## [2.6.9] - 2026-06-11

### Fixed
- **"Open Oikos on startup" now writes to the correct setting**: the previous version stored the preference under the wrong user-data key, so Home Assistant never read it back and the toggle had no effect. It now updates the same per-user `core` setting the HA profile dashboard selector uses (verified against real HA storage), merged without touching your other preferences.

## [2.6.8] - 2026-06-11

### Fixed
- **Add-on build no longer risks failing on `npm ci`**: the image build now uses `npm install` (with the shipped lockfile kept for deterministic versions) instead of `npm ci`. `npm ci` hard-fails on any package.json↔lockfile mismatch — including differences between the npm that generated the lock and the one in the Alpine base — which could break the add-on build on some setups. `npm install` honors the lockfile but doesn't crash.

## [2.6.7] - 2026-06-11

### Fixed
- **Backup restore now actually restores background images** (they were silently lost): the image-restore request used a wildcard `image/*` content-type the server couldn't parse, so every uploaded background dropped on import. Fixed the content-type on both sides; cards that fail to reinstall (or when the backend is unreachable) are now reported instead of silently swallowed.
- **"Open Oikos on startup" cleanup no longer risks an invalid `configuration.yaml`**: removing the legacy `default_panel` line could orphan other keys under `frontend:` (e.g. `themes:`) when a blank line sat between them — exactly the kind of invalid config that blocks an HA restart. The cleanup is now line-based and leaves a non-empty `frontend:` block intact.
- Backup seal memory limit lowered to 64 MB to avoid OOM on low-RAM HA OS devices.

## [2.6.6] - 2026-06-11

### Changed
- **Reproducible add-on dependency builds**: the add-on now ships a `package-lock.json` and installs with `npm ci`, so the entire dependency tree (the 4 direct packages plus their ~66 transitive ones) is frozen to exact versions — previously only the 4 direct packages were pinned and the rest were re-resolved on every build. Installs are also slightly faster and stricter.

## [2.6.5] - 2026-06-11

### Fixed
- **"Open Oikos on startup" now actually works**: recent HA versions resolve the default dashboard from the *per-user* setting stored server-side (`userData.default_panel`) before looking at the browser's localStorage — so if you had ever picked a dashboard from your HA profile, the toggle was silently ignored. The toggle now writes the per-user setting via WebSocket (applies to your user on **all devices**, no restart) with localStorage kept as fallback for older HA versions.

### Changed
- **Backups are now encrypted**: the exported file (`.oikosbackup`) contains your license key and full configuration, so it is sealed with AES-256-GCM by the add-on — it can't be opened with a regular unzip, and a tampered/corrupted file is detected and rejected on import. Old `.zip`/`.json` backups can still be imported.
- **Add-on build installs dependencies online again** (vendored `node_modules` removed): versions stay pinned exactly, the Alpine base image stays pinned at 3.21.

## [2.6.4] - 2026-06-11

### Added
- **One-click uninstall** (Settings → Uninstall): removes everything Oikos installed on Home Assistant — dashboards and settings, installed cards, uploaded images, YAML packages, the sidebar entry in `configuration.yaml` and the browser data — with a double confirmation. Other custom panels in `configuration.yaml` are left untouched, and a timestamped backup of the file is kept. The license is not affected: reinstalling on the same HA restores it. After the cleanup, just uninstall the add-on from the Supervisor and restart HA.

## [2.6.3] - 2026-06-11

### Changed
- **Offline, reproducible add-on builds (HA OS)**: the Supervisor builds the add-on image directly on your device — previously this ran `npm install` at build time, which could fail with flaky DNS/registry and produced non-deterministic images. Dependencies (pure-JS, no native binaries) are now shipped pre-vendored with the add-on and the Alpine base image is pinned (3.21, Node 22) instead of `:latest`. Installs and updates are faster, work offline, and behave identically on every architecture, Raspberry Pi included.

## [2.6.2] - 2026-06-10

### Changed
- **Full 1:1 backup**: Settings → Backup now exports a ZIP containing the whole configuration, the uploaded background images and the list of cards installed from the store. On restore everything comes back exactly as it was: images are written back under their original names and cards are reinstalled automatically. **License-aware**: premium cards are reinstalled only if the subscription is still active — if the license has meanwhile dropped to trial/expired they are skipped and reported (their layout configuration is kept, so re-subscribing and reinstalling restores them in place). Old `.json` backups can still be imported.

## [2.6.1] - 2026-06-10

### Fixed
- **"Open Oikos on startup" no longer breaks Home Assistant restarts**: the toggle used to write `frontend: default_panel` into `configuration.yaml`, an option recent HA versions reject as invalid — blocking every restart until the line was removed by hand. The preference is now stored in the HA frontend itself (same per-device mechanism as the profile dashboard selector): it takes effect immediately, needs no restart, and the add-on automatically cleans up the invalid line left by previous versions on next boot.

## [2.6.0] - 2026-06-10

### Security
- **Add-on no longer exposes port 3000 on the host network.** The dashboard talks to the add-on exclusively through the HA ingress proxy, but the published port also exposed — without any authentication — the Supervisor-authenticated WebSocket proxy, HA service calls, all entity states, and the license key to anyone on the LAN. The port mapping has been removed and, as defense in depth, the server now rejects API and WebSocket requests that don't come from the HA ingress network (developer override: `OIKOS_ALLOW_DIRECT=1`).
- **Rate limiting on login/registration**: the add-on no longer forwards credential brute-force attempts to the license server (max 10 requests per minute per client).

### Added
- **Health check + Supervisor watchdog**: new `/api/health` endpoint and `watchdog` entry in the add-on config — if the server hangs, the Supervisor restarts the add-on automatically.
- **Backup management**: entity-registry snapshots can now be downloaded and deleted via API, with automatic rotation (the 20 most recent are kept).
- **Multilingual add-on status page**: the page shown when opening the add-on URL directly is now served in EN/IT/FR/DE/ES based on the browser language.

### Changed
- **Server errors are now translatable**: every user-facing error from the add-on carries a machine code (e.g. `premium_required`, `zip_too_big`) that the dashboard translates into the 5 supported languages. Previously the raw Italian text from the server was shown to all users.
- **Much smaller Docker image**: the add-on image now installs only the four runtime dependencies the server needs, instead of the entire dashboard frontend stack — significantly faster installs and updates, especially on ARM boards.
- **`configuration.yaml` backups are timestamped** (last 5 kept). The previous single `.oikos.bak` file was overwritten on every change, so two consecutive edits lost the original.

### Fixed
- **Card translations now self-heal**: if i18n files couldn't be downloaded when a card was installed (e.g. HA was offline), the add-on retries on the next boot instead of giving up forever.
- **Shared realtime stream protection**: WS subscription commands are rejected on the generic command endpoint — a subscription opened by one browser would have leaked its events to every connected client.
- **Unique upload filenames**: concurrent image uploads could overwrite each other (timestamp-only names); a random suffix is now added.
- **License-expired responses now include CORS headers**, so the dashboard shows the real message instead of a network error.

### Removed
- Unused `share:rw` permission (smaller attack surface), dead code in the server and start script.
