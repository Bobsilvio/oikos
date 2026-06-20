# Contribuire a Oikos / Contributing to Oikos

*[Italiano](#italiano) · [English](#english)*

---

## Italiano

### Come puoi contribuire

Ci sono diversi modi per contribuire a Oikos:

- 🐛 **Segnalare bug** — [apri un'issue](https://github.com/Bobsilvio/oikos/issues/new/choose)
- 💡 **Proporre funzionalità** — [apri un'issue feature request](https://github.com/Bobsilvio/oikos/issues/new/choose)
- 💬 **Aiutare altri utenti** — rispondi nelle [Discussions](https://github.com/Bobsilvio/oikos/discussions)
- 🃏 **Pubblicare card** — crea e condividi card con la community (vedi sotto)

---

### Pubblicare card per la community

Chiunque può creare card per Oikos e renderle installabili dallo **Store community** integrato nell'app.

#### Formati supportati

**Smart Card** — card costruite con il builder visuale di Oikos, salvate come JSON.
**Card Lovelace** — qualsiasi card Lovelace della community HA (come HACS), distribuita tramite release GitHub.

#### Come pubblicare una Smart Card

1. Costruisci la tua card nell'editor di Oikos
2. Esporta il JSON (`⋮ → Esporta JSON`)
3. Crea un repository GitHub pubblico con questa struttura:

```
my-oikos-card/
├── manifest.json       ← metadati obbligatori
├── card.json           ← la tua Smart Card esportata
└── preview.png         ← screenshot (consigliato, 800×500px)
```

4. Il `manifest.json` deve contenere:

```json
{
  "name": "Nome della mia card",
  "description": "Breve descrizione",
  "version": "1.0.0",
  "author": "tuo-username",
  "type": "smart-card",
  "tags": ["energia", "lovelace"],
  "ha_min_version": "2024.1",
  "oikos_min_version": "2.0.0",
  "preview": "preview.png",
  "card": "card.json"
}
```

5. Crea una **Release** su GitHub con il tag versione (es. `v1.0.0`)
6. Condividi il link del tuo repo nelle [Discussions → Showcase](https://github.com/Bobsilvio/oikos/discussions/categories/showcase)

Gli utenti potranno installare la tua card da **Store → Community → Aggiungi repository**.

#### Guida completa sviluppatori

Per sviluppare card con codice JavaScript personalizzato (accesso a `hass.states`, chiamate servizi, grafici, ecc.) leggi la guida completa nel repo dedicato: **[oikos-cards](https://github.com/Bobsilvio/oikos-cards)**.

---

### Linee guida

- Testa la card su almeno un'istanza HA prima di pubblicare
- Usa nomi di entità generici come placeholder (es. `sensor.temperature`) — non entity_id specifici del tuo impianto
- Includi sempre un `preview.png` leggibile
- Versiona con semver (`1.0.0`, `1.0.1`, `1.1.0`...)

---

## English

### Ways to contribute

- 🐛 **Report bugs** — [open an issue](https://github.com/Bobsilvio/oikos/issues/new/choose)
- 💡 **Suggest features** — [open a feature request](https://github.com/Bobsilvio/oikos/issues/new/choose)
- 💬 **Help other users** — reply in [Discussions](https://github.com/Bobsilvio/oikos/discussions)
- 🃏 **Publish cards** — create and share cards with the community (see below)

---

### Publishing community cards

Anyone can create Oikos cards and make them installable from the built-in **Community Store**.

#### Supported formats

**Smart Card** — cards built with the Oikos visual editor, saved as JSON.
**Lovelace Card** — any HA community Lovelace card (like HACS), distributed via GitHub release.

#### How to publish a Smart Card

1. Build your card in the Oikos editor
2. Export the JSON (`⋮ → Export JSON`)
3. Create a public GitHub repository with this structure:

```
my-oikos-card/
├── manifest.json       ← required metadata
├── card.json           ← your exported Smart Card
└── preview.png         ← screenshot (recommended, 800×500px)
```

4. `manifest.json` must contain:

```json
{
  "name": "My Card Name",
  "description": "Short description",
  "version": "1.0.0",
  "author": "your-username",
  "type": "smart-card",
  "tags": ["energy", "lovelace"],
  "ha_min_version": "2024.1",
  "oikos_min_version": "2.0.0",
  "preview": "preview.png",
  "card": "card.json"
}
```

5. Create a **GitHub Release** with a version tag (e.g. `v1.0.0`)
6. Share the repo link in [Discussions → Showcase](https://github.com/Bobsilvio/oikos/discussions/categories/showcase)

Users will be able to install your card from **Store → Community → Add repository**.

#### Full developer guide

For cards with custom JavaScript (access to `hass.states`, service calls, charts, etc.) read the full guide in the dedicated repo: **[oikos-cards](https://github.com/Bobsilvio/oikos-cards)**.

---

### Guidelines

- Test your card on at least one HA instance before publishing
- Use generic entity names as placeholders (e.g. `sensor.temperature`) — not your own entity_ids
- Always include a readable `preview.png`
- Use semver (`1.0.0`, `1.0.1`, `1.1.0`...)
