# Inventario card — checkout locali

Rilevato il 13 settembre 2026 dai manifest dei due repository ufficiali locali. Non certifica quali pacchetti siano attualmente pubblicati nello Store. Non include ancora card native, Smart Card, HTML e repository community esterni.

Pacchetti trovati: **29**. Le versioni sono quelle dei manifest locali.

| Repository | ID | Nome | Versione | Tipo | Impostazioni nel manifest | Documentazione |
| --- | --- | --- | --- | --- | --- | --- |
| oikos-cards | air-quality | Qualità dell'aria | 1.0.5 | card | Sì | Da documentare |
| oikos-cards | climatizzatore | Climatizzatore | 1.1.4 | card | Sì | Da documentare |
| oikos-cards | clock | Clock | 1.0.2 | card | No | Da documentare |
| oikos-cards | light-control | Light Control | 1.1.0 | card | Sì | Da documentare |
| oikos-cards | person | Persona | 1.3.9 | card | Sì | [Modello IT: 7 opzioni, verifica dashboard pendente](../it/cards/person.md) |
| oikos-cards | room-sensor | Room Sensor | 1.1.5 | card | Sì | Da documentare |
| oikos-cards | thermostat | Termostato | 1.0.4 | card | Sì | Da documentare |
| oikos-cards | tigo-panels | Tigo Panels | 1.0.2 | card | Sì | Da documentare |
| oikos-cards | tile | Tile | 1.10.0 | card | Sì | Da documentare |
| oikos-cards | vacuum | Dreame Vacuum | 2.14.2 | card | Sì | Da documentare |
| oikos-cards | yesterday | Fotovoltaico — Ieri | 1.1.0 | card | Sì | Da documentare |
| oikos-cards-premium | alarm | Allarme | 1.1.0 | card | Sì | Da documentare |
| oikos-cards-premium | alexa | Alexa | 0.2.0 | card | Sì | Da documentare |
| oikos-cards-premium | appliance | Elettrodomestico | 0.16.2 | card | Sì | Da documentare |
| oikos-cards-premium | bolletta | Bolletta Stimata | 1.1.4 | card | Sì | Da documentare |
| oikos-cards-premium | bucato | Bucato | 1.0.2 | card | Sì | Da documentare |
| oikos-cards-premium | calendar | Calendario | 1.0.1 | card | Sì | Da documentare |
| oikos-cards-premium | cameras | Telecamere | 1.1.2 | card | Sì | Da documentare |
| oikos-cards-premium | covers | Tapparelle | 1.4.4 | card | Sì | Da documentare |
| oikos-cards-premium | irrigation | Irrigazione | 1.7.15 | card | Sì | Da documentare |
| oikos-cards-premium | mailbox-card | Cassetta delle Lettere | 1.8.22 | card | Sì | Da documentare |
| oikos-cards-premium | media-player | Media Player | 1.0.2 | card | Sì | Da documentare |
| oikos-cards-premium | openings | Porte e Finestre | 1.4.2 | card | Sì | Da documentare |
| oikos-cards-premium | raccolta-differenziata | Raccolta Differenziata | 0.11.1 | card | Sì | Da documentare |
| oikos-cards-premium | report-mensile | Report Mensile | 1.10.4 | card | Sì | Da documentare |
| oikos-cards-premium | visioneviva | VisioneViva | 0.7.4 | card | Sì | Da documentare |
| oikos-cards-premium | visioneviva-top3 | VisioneViva — Top 3 | 0.1.0 | card | No | Da documentare |
| oikos-cards-premium | wallbox | WallBox | 1.0.4 | card | Sì | Da documentare |
| oikos-cards-premium | zigbee-watchdog | Zigbee Watchdog | 1.3.2 | card | Sì | Da documentare |

La colonna impostazioni riflette `hasSettings`, non l’assenza di configurazioni nel runtime. Per esempio Clock dichiara `hasSettings: false`, ma legge `format` tramite `useCardConfig`: va distinto un valore interno da un controllo realmente accessibile.
