#!/usr/bin/env node
// Renderizza presentazione.html in un video MP4 (1920x1080) fotogramma per fotogramma.
//
//   node render.js                      -> oikos-presentazione.mp4 (tutto il video, 30 fps)
//   node render.js --fps 60             -> frame rate diverso
//   node render.js --from 40 --to 50    -> solo un intervallo (anteprima veloce)
//   node render.js --stills 3,15,42     -> salva solo PNG di quegli istanti in frames/
//   node render.js --page social.html   -> versione verticale 9:16 (-> oikos-social.mp4)
//   Una pagina può chiedere una densità diversa con window.DPR (es. 360x640 a 3x = 1080x1920).
//
// Requisiti: Playwright con Chromium e ffmpeg (nel PATH, oppure nella variabile FFMPEG,
// oppure `pip install imageio-ffmpeg`).

const { chromium } = require("playwright");
const { spawn, execSync } = require("child_process");
const path = require("path");
const fs = require("fs");

const args = Object.fromEntries(
  process.argv.slice(2).reduce((acc, a, i, all) => (a.startsWith("--") ? [...acc, [a.slice(2), all[i + 1]]] : acc), [])
);
const FPS = Number(args.fps || 30);
const PAGE_FILE = args.page || "presentazione.html";
const OUT = path.resolve(__dirname, args.out || (PAGE_FILE === "social.html" ? "oikos-social.mp4" : "oikos-presentazione.mp4"));
const PAGE = "file://" + path.resolve(__dirname, PAGE_FILE) + "?render";

function findFfmpeg() {
  if (process.env.FFMPEG) return process.env.FFMPEG;
  try { execSync("ffmpeg -version", { stdio: "ignore" }); return "ffmpeg"; } catch {}
  try { return execSync('python3 -c "import imageio_ffmpeg;print(imageio_ffmpeg.get_ffmpeg_exe())"').toString().trim(); } catch {}
  throw new Error("ffmpeg non trovato: installalo o esegui `pip install imageio-ffmpeg`");
}

(async () => {
  const browser = await chromium.launch();
  let page = await browser.newPage({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: 1 });
  await page.goto(PAGE);
  const size = await page.evaluate(() => ({ width: window.WIDTH || 1920, height: window.HEIGHT || 1080, dpr: window.DPR || 1 }));
  if (size.dpr !== 1) {
    // Pagine disegnate a misura di telefono (es. 360x640 a 3x): serve una pagina nuova con quella densità.
    await page.close();
    page = await browser.newPage({ viewport: { width: size.width, height: size.height }, deviceScaleFactor: size.dpr });
    page.on("pageerror", (e) => console.error("errore nella pagina:", e.message));
    await page.goto(PAGE);
  } else {
    await page.setViewportSize({ width: size.width, height: size.height });
  }
  await page.evaluate(async () => {
    await document.fonts.ready;
    await Promise.all([...document.images].map((i) => i.decode().catch(() => {})));
  });
  const duration = await page.evaluate(() => window.DURATION);

  if (args.stills) {
    const dir = path.resolve(__dirname, "frames");
    fs.mkdirSync(dir, { recursive: true });
    for (const t of args.stills.split(",").map(Number)) {
      await page.evaluate((t) => window.seek(t), t);
      await page.screenshot({ path: path.join(dir, `t${String(t).padStart(5, "0")}.png`) });
    }
    await browser.close();
    return;
  }

  const from = Number(args.from || 0);
  const to = Math.min(Number(args.to || duration), duration);
  const total = Math.round((to - from) * FPS);

  const ff = spawn(findFfmpeg(), [
    "-y", "-loglevel", "error",
    "-f", "image2pipe", "-framerate", String(FPS), "-c:v", "mjpeg", "-i", "-",
    "-c:v", "libx264", "-preset", "slow", "-crf", String(args.crf || 17), "-pix_fmt", "yuv420p",
    "-movflags", "+faststart", OUT,
  ], { stdio: ["pipe", "inherit", "inherit"] });

  const t0 = Date.now();
  for (let f = 0; f < total; f++) {
    await page.evaluate((t) => window.seek(t), from + f / FPS);
    const buf = await page.screenshot({ type: "jpeg", quality: 95 });
    if (!ff.stdin.write(buf)) await new Promise((r) => ff.stdin.once("drain", r));
    if (f % FPS === 0) process.stdout.write(`\r${(from + f / FPS).toFixed(0)}s / ${to}s  (${((Date.now() - t0) / 1000).toFixed(0)}s trascorsi)`);
  }
  ff.stdin.end();
  await new Promise((r) => ff.on("close", r));
  await browser.close();
  console.log(`\nFatto: ${OUT}`);
})();
