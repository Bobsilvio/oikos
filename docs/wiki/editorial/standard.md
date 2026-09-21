# Standard editoriale e verifica

## Struttura di una guida card

1. Scopo, versione esaminata e prerequisiti.
2. Configurazione iniziale seguendo i nomi e l'ordine dei controlli reali.
3. Tabella di ogni opzione: etichetta, default, valori/range/passo, effetto, dipendenze e ambito.
4. Confronti visivi per le opzioni estetiche e sequenze per quelle comportamentali.
5. Esempi completi e combinazioni significative.
6. Dati mancanti, limiti, problemi frequenti.
7. Stato della verifica e collegamenti alle impostazioni comuni pertinenti.

Le impostazioni comuni del contenitore, quelle del singolo tipo di card e quelle globali hanno pagine distinte. Ogni guida deve chiarire quale ambito modifica il controllo.

## Copertura delle opzioni

Per ogni pagina confrontare manifest, default runtime, componente Settings, componenti delegati, traduzioni e rendering effettivo. Non limitarsi a estrarre `cfg.*`: alcune opzioni si trovano in oggetti annidati, elenchi dinamici o componenti condivisi. Segnalare i valori presenti soltanto per compatibilità e quelli non esposti nell'interfaccia. Un controllo condizionale va documentato insieme alla condizione che lo rende visibile.

Per ogni opzione registrare separatamente: descritta dal codice, verificata nella dashboard, immagine/sequenza acquisita, tradotta IT/EN. Una pagina è pronta quando tutti i controlli applicabili sono coperti; gli stati pendenti rimangono espliciti.

## Immagini

Usare lo stesso dataset dimostrativo, lingua, dimensione della card e tema per ogni confronto. Cambiare un'opzione alla volta, salvo esempi dichiaratamente combinati. Per slider mostrare un valore iniziale e valori rappresentativi agli estremi; per selettori mostrare tutte le varianti visive. Per entità mostrare selezione vuota, dato valido e dato non disponibile quando il risultato cambia. Documentare le dipendenze tra controlli senza tentare tutte le combinazioni cartesiane.

Acquisire sia il pannello del controllo sia il risultato, con didascalie e testo alternativo. Usare dati dimostrativi, evitando nomi, foto e coordinate private. Le mappe usano luoghi pubblici scelti esplicitamente per la demo. Le immagini di runtime isolati vanno etichettate e non sostituiscono la verifica nella dashboard.

## Riprodurre le anteprime Persona

Prerequisiti: checkout affiancati `oikos-cards` e `silviosmart-dashboard`, dipendenze esbuild/Playwright già installate nella dashboard e Google Chrome installato.

```sh
node docs/wiki/editorial/capture-person.mjs /percorso/alla/cartella/che/contiene/i/repository
```

Lo script avvia un server solo su loopback, importa il componente originale e fornisce un SDK dimostrativo. Usa un browser headless isolato; non si collega a Home Assistant e non modifica le configurazioni delle card. Produce nove PNG e `assets/person/captures.json`. Verifica l'assenza di errori JavaScript, i testi attesi e l'assenza della mappa nei casi senza coordinate. Non acquisisce il pannello Settings o una mappa con coordinate.

## Discrepanze trovate nella card Persona 1.3.9

- L'etichetta della mappa e il commento iniziale descrivono un retro/flip non presente nel rendering.
- La descrizione nel manifest cita passi/km; i campi Settings parlano di tempi. Il runtime mostra valori e unità dei sensori, senza conversioni.
- Per una zona diversa da casa/fuori, il testo preferisce `friendly_name` della persona allo stato: verificare se questo comportamento è intenzionale.

Non sono state modificate le card per correggere queste discrepanze.
