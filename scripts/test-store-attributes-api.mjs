#!/usr/bin/env node
/**
 * Quick HTTP checks against /api/stores/:storeId/attributes (all methods).
 * Usage:
 *   node scripts/test-store-attributes-api.mjs
 *   BASE_URL=https://your-app.launch-url.com node scripts/test-store-attributes-api.mjs
 */
const BASE = process.env.BASE_URL?.replace(/\/$/, "") || "http://127.0.0.1:3000";
const STORE_ID = process.env.STORE_ID || "eb83e6ab-6c63-42b3-8f44-511c992130ea";
const path = `/api/stores/${encodeURIComponent(STORE_ID)}/attributes`;
const url = `${BASE}${path}`;

const methods = ["GET", "POST", "PUT", "PATCH", "DELETE"];

async function one(method) {
  const init = { method, headers: { Accept: "application/json" } };
  if (method !== "GET" && method !== "DELETE") {
    init.headers["Content-Type"] = "application/json";
    init.body = "{}";
  }
  const res = await fetch(url, init);
  const text = await res.text();
  let body;
  try {
    body = JSON.parse(text);
  } catch {
    body = text;
  }
  return { method, status: res.status, body };
}

async function main() {
  console.log("Requesting:", url, "\n");
  for (const m of methods) {
    try {
      const r = await one(m);
      console.log(m, "->", r.status, r.body);
    } catch (e) {
      console.log(m, "-> ERROR", e);
    }
  }
}

main();
