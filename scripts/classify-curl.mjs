#!/usr/bin/env node
/**
 * Ticket triage helper: run curl -i and classify outcome.
 *
 * Usage:
 *   node scripts/classify-curl.mjs 'https://host/path?...'
 *   npm run classify:url -- 'https://...'
 *
 * Heuristic (ChatGPT-style):
 *   - No headers / curl timeout (28) → origin hang or network stall
 *   - 520 → Cloudflare: bad/empty origin response
 *   - 414 → edge URI limit (OpenResty/nginx)
 */
import { spawnSync } from "node:child_process";

const url = process.argv[2];
if (!url) {
  console.error("Usage: node scripts/classify-curl.mjs <url>");
  process.exit(1);
}

const TIMEOUT_SEC = 25;
const r = spawnSync(
  "curl",
  ["-i", "-sS", "--max-time", String(TIMEOUT_SEC), url],
  { encoding: "utf8", maxBuffer: 12 * 1024 * 1024 }
);

if (r.error) {
  console.error(r.error.message);
  process.exit(1);
}

const out = (r.stdout ?? "").trimStart();

if (r.status === 28) {
  console.log("Classification: TIMEOUT (curl exit 28) — no complete response in time");
  console.log("  → treat as: origin hang / stalled handler / network (no usable headers)");
  process.exit(2);
}

const statusMatch = out.match(/HTTP\/[\d.]+\s+(\d+)/);
const code = statusMatch ? parseInt(statusMatch[1], 10) : null;

if (code === 414) {
  console.log("Classification: HTTP 414 — Request-URI Too Large");
  console.log("  → treat as: edge / proxy URI limit (not app logic)");
} else if (code === 520) {
  console.log("Classification: HTTP 520 — Web server is returning an unknown error");
  console.log("  → treat as: Cloudflare / edge: origin returned invalid or empty response");
} else if (code !== null && code >= 200 && code < 300) {
  console.log(`Classification: HTTP ${code} — origin responded successfully`);
} else if (code !== null) {
  console.log(`Classification: HTTP ${code} — origin returned an error or non-2xx`);
} else {
  console.log("Classification: UNPARSED — could not find HTTP status line");
}

console.log("\n--- curl -i (first 900 bytes) ---\n");
console.log(out.slice(0, 900));
if (out.length > 900) console.log("\n... [truncated]");
