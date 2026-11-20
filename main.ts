// gta6-clipper-01-entry: hand the video address in VIDEO.json to the grader.
//
// The entry itself is a YouTube Short. This program does one small job:
// read VIDEO.json from the repository, check it is a well-formed video
// address, and copy its exact bytes to the output directory. It uses
// only the Node standard library, touches no network and no clock, and
// writes the same bytes on every run.

import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

// The grader runs:
//   mkdir -p out && MAKEFUN_BOT_DIR=. MAKEFUN_OUTPUT_DIR=out node main.ts
const botDir = process.env.MAKEFUN_BOT_DIR ?? ".";
const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "out";

const inputPath = join(botDir, "VIDEO.json");
const outputPath = join(outDir, "VIDEO.json");

const MAX_VIDEO_JSON_BYTES = 16384;

function fail(message: string): never {
  throw new Error(`VIDEO.json: ${message}`);
}

if (!existsSync(inputPath)) {
  fail(`missing file at ${inputPath}`);
}

const bytes = readFileSync(inputPath);

if (bytes.length === 0) {
  fail("file is empty");
}

if (bytes.length > MAX_VIDEO_JSON_BYTES) {
  fail(`file is ${bytes.length} bytes, over the ${MAX_VIDEO_JSON_BYTES} byte cap`);
}

let parsed: unknown;
try {
  parsed = JSON.parse(bytes.toString("utf8"));
} catch {
  fail("file is not valid JSON");
}

if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) {
  fail("top level value must be a JSON object");
}

const url = (parsed as Record<string, unknown>).url;
if (typeof url !== "string" || url.length === 0) {
  fail("object must carry a non-empty string field named url");
}

const extraKeys = Object.keys(parsed as Record<string, unknown>).filter((key) => key !== "url");
if (extraKeys.length > 0) {
  fail(`object must carry only the url field, found extra: ${extraKeys.join(", ")}`);
}

const videoId = videoIdFromUrl(url);
if (videoId === null) {
  fail(`url is not a YouTube video address: ${url}`);
}

mkdirSync(outDir, { recursive: true });
writeFileSync(outputPath, bytes);

// Prove the copy landed byte-identical: read it back and compare.
const written = readFileSync(outputPath);
if (!written.equals(bytes)) {
  fail(`copy to ${outputPath} does not match ${inputPath}`);
}

// Pull the 11-character video id out of a YouTube address, or null when
// the address is not one of the three shapes the bounty accepts:
// youtube.com/shorts/<id>, youtube.com/watch?v=<id>, youtu.be/<id>.
// A query string or fragment after the id is read past, as the rules say.
function videoIdFromUrl(url: string): string | null {
  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    return null;
  }
  if (parsed.protocol !== "https:") {
    return null;
  }
  const host = parsed.hostname;
  const idPattern = /^[A-Za-z0-9_-]{11}$/;
  if (host === "youtu.be") {
    const id = parsed.pathname.slice(1);
    return idPattern.test(id) ? id : null;
  }
  if (host === "www.youtube.com" || host === "m.youtube.com" || host === "youtube.com") {
    const shorts = parsed.pathname.match(/^\/shorts\/([A-Za-z0-9_-]{11})$/);
    if (shorts !== null) {
      return shorts[1];
    }
    const watch = parsed.searchParams.get("v");
    if (parsed.pathname === "/watch" && watch !== null && idPattern.test(watch)) {
      return watch;
    }
  }
  return null;
}
