// scripts/media/compress-videos.mjs - Recomprime los vídeos de public/ a bitrate de web sin cambiar rutas ni resolución.
//
// Por qué existe: cada despliegue de Vercel congela una copia entera de public/, así que un máster de
// 23 Mbps que nadie distingue de uno de 3,5 Mbps se paga en almacenamiento en CADA deploy. Este script
// deja los vídeos en su sitio (mismas rutas, misma resolución) y solo baja el bitrate.
//
// Uso:
//   node scripts/media/compress-videos.mjs --dry-run   (solo informa, no escribe)
//   node scripts/media/compress-videos.mjs             (recomprime y reemplaza)
import { execFileSync } from "node:child_process";
import { mkdtempSync, readdirSync, renameSync, rmSync, statSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, relative, resolve } from "node:path";

const VIDEO_DIR = resolve(process.cwd(), "public/assets/videos");

// Por debajo de este bitrate el vídeo ya es de web: recomprimir solo perdería calidad.
const ALREADY_WEB_BITRATE = 4_000_000;
// Constant Rate Factor de libx264. 26 se comparo fotograma a fotograma contra el master en la fusion mas
// exigente (gemgpt, lluvia fina sobre metal) y no se distingue, pesando un 61% menos. Bajarlo a 30 empieza
// a arriesgar bloques en los fondos oscuros en movimiento.
const CRF = "26";
const AUDIO_BITRATE = "128k";
// No se reemplaza el original si el ahorro no compensa la pérdida de generación.
const MIN_SAVING_RATIO = 0.15;

const isDryRun = process.argv.includes("--dry-run");

/** Lista recursiva de .mp4 bajo public/assets/videos. */
function collectVideos(dir, files = []) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory()) collectVideos(fullPath, files);
    else if (entry.isFile() && entry.name.toLowerCase().endsWith(".mp4")) files.push(fullPath);
  }
  return files;
}

/** Bitrate total del contenedor en bits por segundo (0 si ffprobe no lo sabe). */
function readBitrate(filePath) {
  const output = execFileSync(
    "ffprobe",
    ["-v", "error", "-show_entries", "format=bit_rate", "-of", "default=noprint_wrappers=1:nokey=1", filePath],
    { encoding: "utf8" },
  ).trim();
  return Number.parseInt(output, 10) || 0;
}

/** Recomprime a H.264/AAC con faststart (cabecera al principio: el navegador empieza a pintar antes). */
function encode(inputPath, outputPath) {
  execFileSync(
    "ffmpeg",
    [
      "-v", "error", "-y",
      "-i", inputPath,
      "-c:v", "libx264", "-crf", CRF, "-preset", "slow", "-pix_fmt", "yuv420p",
      "-c:a", "aac", "-b:a", AUDIO_BITRATE,
      "-movflags", "+faststart",
      outputPath,
    ],
    { stdio: ["ignore", "ignore", "inherit"] },
  );
}

function toMegabytes(bytes) {
  return `${(bytes / 1_048_576).toFixed(1)} MB`;
}

function main() {
  const videos = collectVideos(VIDEO_DIR).sort();
  const workDir = mkdtempSync(join(tmpdir(), "aigioh-video-"));
  let before = 0;
  let after = 0;

  try {
    for (const videoPath of videos) {
      const label = relative(VIDEO_DIR, videoPath).replaceAll("\\", "/");
      const originalSize = statSync(videoPath).size;
      before += originalSize;

      const bitrate = readBitrate(videoPath);
      if (bitrate > 0 && bitrate < ALREADY_WEB_BITRATE) {
        after += originalSize;
        console.log(`= ${label.padEnd(34)} ${toMegabytes(originalSize).padStart(9)}  ya es de web (${Math.round(bitrate / 1000)} kbps)`);
        continue;
      }

      const candidatePath = join(workDir, `${label.replaceAll("/", "_")}`);
      encode(videoPath, candidatePath);
      const candidateSize = statSync(candidatePath).size;
      const saving = 1 - candidateSize / originalSize;

      if (saving < MIN_SAVING_RATIO) {
        after += originalSize;
        console.log(`= ${label.padEnd(34)} ${toMegabytes(originalSize).padStart(9)}  sin ahorro suficiente`);
        continue;
      }

      after += candidateSize;
      const detail = `${toMegabytes(originalSize)} -> ${toMegabytes(candidateSize)} (-${Math.round(saving * 100)}%)`;
      if (isDryRun) {
        console.log(`~ ${label.padEnd(34)} ${detail}  [dry-run]`);
        continue;
      }
      renameSync(candidatePath, videoPath);
      console.log(`> ${label.padEnd(34)} ${detail}`);
    }
  } finally {
    rmSync(workDir, { recursive: true, force: true });
  }

  const total = `Total: ${toMegabytes(before)} -> ${toMegabytes(after)} (-${Math.round((1 - after / before) * 100)}%)`;
  console.log(isDryRun ? `\n[dry-run] ${total}` : `\n${total}`);
}

main();
