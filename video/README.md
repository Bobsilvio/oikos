# Video presentazione Oikos

Due versioni, entrambe a 30 fps e **senza audio** (voce e musica si aggiungono dopo):

- **Social verticale 9:16** — `social.html`, 1080×1920, 43 secondi, ritmo veloce per Reels, TikTok e Shorts.
- **Orizzontale 16:9** — `presentazione.html`, 1920×1080, 91 secondi, più descrittiva.

## Versione social (9:16)

```bash
node render.js --page social.html      # → oikos-social.mp4
```

Testi e contenuti importanti stanno lontani dal bordo alto e basso, dove le app social mettono nome utente, didascalia e pulsanti.

| Tempo | Scena |
|---|---|
| 0:00 | "La tua casa. Finalmente bellissima." |
| 0:03 | Logo con esplosione di luce, "Oikos" |
| 0:06 | Telefono in 3D con la dashboard che si popola: "Tutta la casa. In tasca." |
| 0:10 | Casa con impianto FV in panoramica, valori kW che salgono: "Il sole, in tempo reale." |
| 0:15 | Card Bolletta che si ribalta in 3D: "Sai quanto spendi. Prima." |
| 0:19 | Muro di card in prospettiva: "Decine di card. Pronte." |
| 0:23 | I widget volano nella card: "Crea la tua. Drag & drop." |
| 0:28 | Prompt a Claude Code, la card appare: "Descrivila. Claude la crea." |
| 0:34 | Raffica: Screen saver, Meteo dinamico, Popup smart, Dark mode, Card HACS |
| 0:38 | Logo, homeoikos.com, 15 giorni gratis |

## Elettrodomestici in modalità Pulse (9:16)

```bash
node render.js --page elettrodomestici.html --out oikos-elettrodomestici.mp4
```

40 secondi che imitano la dashboard sul telefono: gli otto elettrodomestici si accendono uno dopo l'altro nel riepilogo, la pagina scorre tra le card in modalità Pulse (anello e bordo pulsano più veloci quanto più l'apparecchio assorbe), zoom su lavatrice e wallbox, poi arriva la notifica "Lavatrice: ciclo terminato". Le card sono ricostruite in HTML sull'aspetto di `card-previews/appliance.png`; i consumi sono inventati ma plausibili (circa 7,3 kW coperti da un FV da 6,8 kW). Dati e orari sono nell'array `AP` in fondo al file.

## Versione orizzontale (16:9)

- `presentazione.html` — tutte le scene, animate in HTML/CSS. Aperta nel browser si riproduce in loop; `presentazione.html?t=40` salta al secondo 40.
- `render.js` — la trasforma in `oikos-presentazione.mp4` fotogramma per fotogramma.
- `assets/` — font Inter (licenza OFL, in `Inter-LICENSE.txt`).

Immagini usate: `docs/screenshots/flat-devices-mockup.png`, `oikos-addon/icon.png` e le anteprime in `oikos-addon/card-previews/`.

## Rigenerare il video

Servono Node, Playwright (con Chromium) e ffmpeg.

```bash
cd video
npm i -D playwright && npx playwright install chromium   # se non già presenti
pip install imageio-ffmpeg                              # se ffmpeg non è nel PATH
node render.js                                          # → oikos-presentazione.mp4
node render.js --from 45 --to 53 --out prova.mp4        # solo un pezzo
node render.js --stills 10,40                           # PNG singoli in frames/
```

Per cambiare testi, durate o l'ordine delle scene si modifica `presentazione.html`: ogni `<section class="scene">` ha `--s` (inizio, in secondi) e `--d` (durata); `--i` sugli elementi è il ritardo di entrata rispetto all'inizio della scena. Se allunghi il video aggiorna anche `window.DURATION` in fondo al file.

## Scaletta e traccia per la voce

I tempi sono quelli del video. Il testo è solo una proposta, da adattare liberamente.

| Tempo | Scena | Cosa si vede | Traccia voce (proposta) |
|---|---|---|---|
| 0:00 – 0:06 | Intro | Logo, "Oikos", sottotitolo | "Questo è Oikos, la dashboard componibile per Home Assistant." |
| 0:06 – 0:11 | Zero YAML | "Costruisci tutto. Zero YAML. Zero codice." | "Costruisci quello che vuoi, senza scrivere YAML e senza codice: tutto dal browser." |
| 0:11 – 0:19 | Responsive | Mockup desktop, tablet, telefono | "Una sola dashboard che si adatta a ogni schermo: computer, tablet, telefono e pannelli a parete, con tema chiaro o scuro automatico." |
| 0:19 – 0:28 | Energia live | Casa con impianto FV e nodi animati | "Vedi il flusso di energia in tempo reale: fotovoltaico, rete, batteria e consumi della casa, anche sopra la foto del tuo impianto." |
| 0:28 – 0:35 | Bolletta | Card Bolletta stimata | "Con la card Bolletta sai quanto spendi prima che arrivi: fasce ARERA, proiezione a fine mese e storico. Pensata per il mercato italiano." |
| 0:35 – 0:45 | Galleria card | Muro di card che scorre | "Decine di card pronte all'uso: energia, clima, meteo, persone, elettrodomestici, e le card della community." |
| 0:45 – 0:53 | Smart Card builder | Editor: i widget vengono trascinati nella card | "E se non basta, crei le tue card con il builder: trascini icone, testi, gauge e grafici, e li colleghi ai sensori di Home Assistant." |
| 0:53 – 1:02 | AI Card Builder | Terminale Claude Code → card generata | "Oppure la descrivi a Claude Code: lui scrive la card, tu la carichi nello store. Una card su misura in pochi minuti." |
| 1:02 – 1:09 | HACS / Lovelace | YAML Mushroom → anteprima live | "Le card HACS e Lovelace che usi già funzionano dentro Oikos: incolli il YAML e le vedi subito." |
| 1:09 – 1:17 | Altre funzioni | 6 riquadri: screen saver, meteo, popup… | "E poi screen saver, meteo dinamico, popup automatici, tema chiaro e scuro e uno store della community." |
| 1:17 – 1:24 | Installazione | 3 passi + 15 giorni di prova | "Si installa in pochi minuti come add-on o con Docker, e puoi provarlo gratis per quindici giorni." |
| 1:24 – 1:31 | Chiusura | Logo, homeoikos.com | "Oikos. Scoprilo su homeoikos.com." |

## Aggiungere l'audio

Con un file voce o musica (`audio.mp3`), senza ricodificare il video:

```bash
ffmpeg -i oikos-presentazione.mp4 -i audio.mp3 -c:v copy -c:a aac -b:a 192k -shortest oikos-con-audio.mp4
```
