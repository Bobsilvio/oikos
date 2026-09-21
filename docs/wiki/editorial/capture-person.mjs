// Render the original card, unchanged, with deterministic demo Home Assistant data.
// Usage: node capture-person.mjs /absolute/path/to/italysat
import { createRequire } from 'node:module'
import { resolve, dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { mkdtemp, writeFile, mkdir, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { createServer } from 'node:http'
const parent = resolve(process.argv[2] || '../../../..')
const app = join(parent, 'silviosmart-dashboard')
const require = createRequire(join(app, 'package.json'))
const { build } = require('esbuild')
const { chromium } = require('@playwright/test')
const output = resolve(dirname(fileURLToPath(import.meta.url)), '../assets/person')
const temporary = await mkdtemp(join(tmpdir(), 'oikos-person-docs-'))
const source = join(parent, 'oikos-cards/cards/person/src/Card.jsx')
const translations = join(parent, 'oikos-cards/cards/person/src/i18n/it.json')
const sdk = join(temporary, 'sdk.js')
await writeFile(sdk, `
import translations from ${JSON.stringify(translations)};
export function registerCardTranslations() {}
export function useT() {return {t:(key,args={}) => { let value=key.split('.').reduce((v,k)=>v?.[k],translations) ?? key; for(const [k,v] of Object.entries(args)) value=value.replaceAll('{{'+k+'}}',String(v)); return value;}}}
export function useCardConfig(id,defaults) {return [{...defaults,...window.demo.config}]}
export function useDashboard() {return {dark:window.demo.dark,haStates:window.demo.states,getState:id=>window.demo.states[id]?.state}}
`)
const compiled = await build({stdin:{contents:`import React from 'react'; import {createRoot} from 'react-dom/client'; import Card from ${JSON.stringify(source)}; createRoot(document.getElementById('card')).render(<Card cardId="person-demo"/>);`,resolveDir:app,loader:'jsx'},bundle:true,write:false,jsx:'automatic',alias:{'@oikos/sdk':sdk},nodePaths:[join(app,'node_modules')],define:{'process.env.NODE_ENV':'"production"'}})
const server=createServer((req,res)=>{res.setHeader('Content-Type','text/javascript');res.end(compiled.outputFiles[0].text)})
await new Promise(r=>server.listen(0,'127.0.0.1',r))
let browser
try {
 browser=await chromium.launch({headless:true,channel:'chrome'})
 await mkdir(output,{recursive:true})
 const base={personEntity:'person.demo',gpsEntity:'',batteryEntity:'',walkEntity:'',driveEntity:'',label:'',showMap:false}
 const cases=[
 ['01-non-configurata',{personEntity:''},'Configura'],
 ['02-persona',{},'Giulia'],
 ['03-nome',{label:'Giulia · telefono'},'Giulia · telefono'],
 ['04-batteria',{batteryEntity:'sensor.battery'},'76%'],
 ['05-piedi',{walkEntity:'sensor.walk'},'18 min'],
 ['06-auto',{driveEntity:'sensor.drive'},'7 min'],
 ['07-mappa-senza-coordinate',{showMap:true},'Giulia'],
 ['08-completa',{batteryEntity:'sensor.battery',walkEntity:'sensor.walk',driveEntity:'sensor.drive'},'76%'],
 ['09-scuro',{batteryEntity:'sensor.battery',walkEntity:'sensor.walk',driveEntity:'sensor.drive'},'76%',true],
 ]
 const report=[]
 for(const [id,config,expected,dark=false] of cases){
  const page=await browser.newPage({viewport:{width:600,height:320},deviceScaleFactor:2})
  const errors=[];page.on('pageerror',error=>errors.push(error.message))
  const demo={config:{...base,...config},dark,states:{'person.demo':{state:'home',attributes:{friendly_name:'Giulia'},last_updated:new Date().toISOString()},'sensor.battery':{state:'76',attributes:{unit_of_measurement:'%'}},'sensor.walk':{state:'18',attributes:{unit_of_measurement:' min'}},'sensor.drive':{state:'7',attributes:{unit_of_measurement:' min'}}}}
  await page.setContent(`<html lang="it"><style>body{margin:0;background:${dark?'#151b25':'#f1f5f9'};font-family:system-ui;--text-muted:#64748b}#frame{padding:24px;width:480px}#card{width:480px}</style><div id="frame"><div id="card"></div></div></html>`)
  await page.evaluate(data=>window.demo=data,demo)
  await page.addScriptTag({url:`http://127.0.0.1:${server.address().port}/card.js`})
  await page.getByText(expected,{exact:false}).first().waitFor()
  if(errors.length) throw new Error(errors.join('\n'))
  if(await page.locator('iframe').count()) throw new Error('Unexpected map in no-coordinate fixture')
  await page.locator('#frame').screenshot({path:join(output,id+'.png'),animations:'disabled'})
  report.push({id,config:demo.config,dark,expected,errors})
  await page.close()
 }
 await writeFile(join(output,'captures.json'),JSON.stringify({source:'oikos-cards/cards/person/src/Card.jsx',mode:'Original component with demo SDK; not full-dashboard validation; map with coordinates not captured.',cases:report},null,2)+'\n')
 console.log(`Captured and verified ${report.length} variants in ${output}`)
} finally {await browser?.close();await new Promise(r=>server.close(r));await rm(temporary,{recursive:true,force:true})}
