# Oikos

**Dashboard componibile per Home Assistant** — crea e personalizza card, chip, distintivi e popup direttamente dal browser, senza scrivere codice.

[![Add repository to my Home Assistant](https://my.home-assistant.io/badges/supervisor_add_addon_repository.svg)](https://my.home-assistant.io/redirect/supervisor_add_addon_repository/?repository_url=https%3A%2F%2Fgithub.com%2FBobsilvio%2Foikos)

---

## 📸 Preview

<div align="center">

<img src="docs/screenshots/flat-devices-mockup.png" alt="Oikos — desktop, tablet e mobile" width="90%"/>

</div>

---

## Installazione su Home Assistant

### Metodo 1 — Click sul badge qui sopra
Apre direttamente Home Assistant e aggiunge questo repo come sorgente add-on.

### Metodo 2 — Manuale
1. In Home Assistant vai su **Impostazioni → Add-on → Add-on Store**
2. In alto a destra menu **⋮ → Repositories**
3. Incolla questa URL:
   ```
   https://github.com/Bobsilvio/oikos
   ```
4. Chiudi il dialog e ricarica la pagina
5. Trovi **Oikos** nella lista add-on → **Installa**
6. Avvia l'add-on → apri l'interfaccia dal pannello laterale di HA

---

## Cosa fa Oikos

Piattaforma per costruire dashboard Home Assistant a modo tuo. Tutto personalizzabile dall'editor visuale, nessun YAML da scrivere.

### Card componibili (Smart Card)
Crea card visuali combinando widget primitivi — rettangoli, cerchi, testi, icone, valori di entità HA, grafici storici, gauge, slider — posizionati con drag&drop. Ogni card salvata in JSON, condivisibile su GitHub.

### Store della community
- **Smart Card**: installa card JSON create da altri — da GitHub, da file o incollando il JSON
- **Card Lovelace**: aggiungi qualsiasi card Lovelace della community (come fossero HACS) via URL repo + Release
- Aggiornamenti automatici con notifica

### Chip navbar custom
Chip configurabili con entità HA, icona Lucide, dimensione (sm/md/lg), colore, formato valore (watt, percentuale, testo).

### Distintivi di pagina
Badge con stato statico o dinamico (template `{value}`), animazione pulse, posizione left/center/right.

### Popup custom
Crea popup con trigger programmato (orario+giorni), condizione HA (entità > valore) o manuale.

### Temi e responsività
- Tema chiaro/scuro con scheduling automatico alba/tramonto
- Sfondo meteo dinamico (sereno, nuvoloso, pioggia, notte)
- Layout responsive mobile/tablet/desktop
- Doppio tema per card (colori diversi light/dark)

---

## Card disponibili

### Energia ⚡
Richiedono impianto fotovoltaico configurato (attivabile nel wizard).

| Card | Descrizione |
|---|---|
| **Stato Immediato** | Potenza FV, stato batteria e percentuale autoconsumo in tempo reale |
| **Live Energia** | Box valori live: FV, rete, batteria, carico casa |
| **Flusso Energia** | Flusso energetico animato con grafico storico |
| **Riepilogo Oggi** | Produzione, consumo, prelievo e cessione della giornata |
| **Previsione Domani** | Stima kWh produzione, condizioni meteo e qualità fascia |
| **Flusso su Immagine** | Nodi energia animati sovrapposti a un'immagine personalizzata |
| **Bolletta Energia** 🇮🇹 ⭐ | Stima bolletta mensile, breakdown 4 voci, live W, storico 6 mesi |

> **Bolletta Energia — solo mercato italiano**
> La card è calibrata sulle fasce orarie GSE (F1/F2/F3), le componenti tariffarie ARERA e il meccanismo di scambio sul posto vigenti in Italia. Non è compatibile con mercati esteri.
>
> Richiede il package **Calcolo Bolletta** installato su Home Assistant (sensori `sensor.sm_bolletta_*`). Il package è disponibile su Ko-fi:
> 👉 **[ko-fi.com/s/ee740d920c](https://ko-fi.com/s/ee740d920c)**
>
> La card è accessibile solo con **licenza attiva** (non nel periodo di prova).

---

### Meteo 🌤️

| Card | Descrizione |
|---|---|
| **Meteo** | Previsioni meteo con stima produzione solare giornaliera |
| **Meteo + Previsioni** | Meteo attuale (temp, umidità, vento, pressione) e previsioni 5 giorni — non richiede impianto FV |

---

### Casa 🏠

| Card | Descrizione |
|---|---|
| **Stanza** | Temperatura, umidità, sparkline 24h e badge per luci, tapparelle, sensori |
| **Luci** | Controllo rapido delle luci configurate in HA |
| **Batterie** | Stato carica di più batterie raggruppato in 4 fasce (Critico/Basso/Medio/Pieno) |
| **Auto (Batteria)** | Batteria auto elettrica, potenza wallbox live, switch on/off ricarica |
| **Tesla** | Batteria, autonomia, ricarica live (kW / kWh / ETA), pressione gomme, Sentry, porte, temperature |
| **Elettrodomestici** | Consumo watt per elettrodomestico con barra e colore adattivi (spento/standby/attivo/piena potenza) |
| **Lista Entità** | Lista configurabile di entità HA con icona, nome, valore e colori per riga |

---

### Custom 🛠️

| Card | Descrizione |
|---|---|
| **Smart Card** | Card visuale con widget SVG (rettangoli, cerchi, testi, icone, gauge, grafici) posizionabili in drag&drop |
| **Card YAML** | Incolla YAML di qualsiasi card Lovelace / HACS (Mushroom, Bubble, card-mod…) con anteprima live |
| **HTML Card** | Iframe con contenuto HTML personalizzato |
| **Popup Panel** | Pannello popup che contiene altre card — aperto al click o da SmartCard/chip |

---

### Community Premium ⭐

Card aggiuntive distribuite separatamente, riservate agli abbonati attivi.

| Card | Descrizione |
|---|---|
| **Zigbee Watchdog** | Monitor dispositivi Zigbee: last-seen, link quality, alert dispositivi caduti |

Le card community premium si installano dallo **Store → Community** di Oikos come qualsiasi altra card della community.

---

## Requisiti

- Home Assistant OS, Supervised, o Container (con Supervisor)
- Architettura: `amd64`, `aarch64`, `armv7`, `armhf`, `i386`
- RAM libera: ~200 MB

---

## Licenza e abbonamento

Oikos offre una **prova gratuita di 30 giorni** al primo avvio. Dopo il periodo trial è richiesto un abbonamento.

L'abbonamento si gestisce dal portale utente (Stripe o PayPal). Licenza legata al tuo account email, 1 installazione HA.

---

## Aggiornamenti

Gli aggiornamenti appaiono automaticamente nel pannello Supervisor di Home Assistant quando pubblico una nuova versione. Clicca **Aggiorna** e il gioco è fatto.

Per il changelog dettagliato: vedi le [Release](https://github.com/Bobsilvio/oikos/releases) su GitHub.

---

## Supporto

- 🐛 Bug: [Issues GitHub](https://github.com/Bobsilvio/oikos/issues)
- 💬 Domande e discussioni: [Discussions](https://github.com/Bobsilvio/oikos/discussions)
- 📧 Email: contatta dall'interno dell'app (menu Impostazioni)

---

## Contribuire card alla community

Puoi pubblicare le tue Smart Card o Card Lovelace come repository separato. Chiunque può installarle dalla schermata **Comunità** dello Store di Oikos.

📘 **Guida completa per sviluppare card**: [SKILL.md](SKILL.md) — specifica formato `.js`, manifest, API `__OIKOS_React` / `__OIKOS_Lucide`, helpers HA, pubblicazione GitHub.

---

Made with ⚡ by [Bobsilvio](https://github.com/Bobsilvio)
