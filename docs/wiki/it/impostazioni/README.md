# Impostazioni Oikos — mappa della documentazione

Questo è l'indice di lavoro delle impostazioni, non ancora una guida esaustiva di ogni controllo. L'ordine deriva dal rendering di `src/pages/SettingsPage.jsx` nella dashboard locale **2.6.84**, esaminata il 13 settembre 2026. I titoli raggruppano i contenuti: le etichette definitive vanno confrontate con la lingua dell'interfaccia.

| Ordine / area | Pagine da sviluppare | Fonte da esaminare | Stato |
| --- | --- | --- | --- |
| 1. Connessione | Home Assistant: collegamento e configurazione | `SettingsPage.jsx` → `HAConnectionSection` | Da documentare; sezione nascosta in modalità pannello HA |
| 2. Connessione | Pannello Home Assistant | `SettingsPage.jsx` → `HaPanelSection` | Da documentare |
| 3. Connessione | Impianti e associazione delle entità | `pages/PlantsSettings.jsx` | Da documentare |
| 4. Aspetto | Tema chiaro/scuro, temi disponibili, personalizzazioni | `SettingsPage.jsx`, `layout/ThemeSettings.jsx` | Da documentare |
| 5. Aspetto | Sfondo pagina e sfondo meteo | `SettingsPage.jsx` → `PageBgSettings` e blocco meteo | Da documentare |
| 6. Aspetto | Programmazione automatica del tema | `SettingsPage.jsx` → `ThemeScheduleSection` | Da documentare |
| 7. Aspetto | Lingua | `SettingsPage.jsx` → `LanguageSection` | Da documentare |
| 8. Layout | Configurazione guidata / funzionalità | `SettingsPage.jsx` → `WizardSection` | Da documentare |
| 9. Layout | Plance | `layout/DashboardsSettings.jsx` | Da documentare |
| 10. Layout | Pagine di navigazione | `layout/NavSettings.jsx` | Da documentare |
| 11. Layout / mobile | Stile navigazione, colonna singola, adattamento automatico | `SettingsPage.jsx` → blocco mobile | Da documentare |
| 12. Layout | Qualità grafica e rilevamento del dispositivo | `SettingsPage.jsx`, `hooks/useGraphicsQuality.js` | Da documentare |
| 13. Comportamento | Popup e pannelli popup | `popups/PopupSettings.jsx`, `SettingsPage.jsx` → `PopupPanelsSettings` | Da documentare |
| 14. Dati | Backup e ripristino | `SettingsPage.jsx` → `BackupRestoreSection`, `utils/backupRestore.js` | Da documentare |
| 15. Dati | Reimpostazione layout e ripristino completo | `SettingsPage.jsx` → modale reset | Da documentare separando gli effetti delle due azioni |
| 16. Dati | Disinstallazione | `SettingsPage.jsx` → `UninstallSection`, `components/UninstallPanel.jsx` | Da documentare |

I percorsi abbreviati `layout/` e `popups/` sono relativi a `src/components/` nella dashboard.

## Impostazioni fuori dalla pagina principale

L'inventario va esteso anche ai controlli raggiungibili altrove: editor della singola card (`components/layout/CardSettings.jsx`), sezioni della dashboard, chip, distintivi, screensaver, Store e assistenza. Le funzioni diagnostica e ticket sono definite anche in `SettingsPage.jsx`, ma non vanno presentate automaticamente come sezioni della pagina: occorre verificare dove vengono montate nell'interfaccia.

## Cosa deve spiegare ogni controllo

Nome e percorso per raggiungerlo; scopo; default; valori consentiti; dipendenze; effetto immediato o necessità di salvataggio; persistenza per dispositivo, plancia o installazione; effetto sugli altri utenti/dispositivi; esempio e screenshot. Per backup, reset e disinstallazione spiegare quali dati vengono inclusi, conservati o rimossi, ricavandolo dalle implementazioni effettive.

Prima di qualificare una pagina come completa confrontare anche i componenti importati e gli store di persistenza: il solo nome di un controllo non rivela l'ambito del suo effetto.
