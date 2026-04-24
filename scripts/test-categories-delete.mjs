#!/usr/bin/env node
/**
 * Simulates the browser/Red Panda DELETE: same path, JSON body on DELETE.
 *
 *   BASE_URL=https://apitesting.contentstackapps.com node scripts/test-categories-delete.mjs
 */
const BASE = process.env.BASE_URL?.replace(/\/$/, "") || "http://127.0.0.1:3000";
const STORE_ID = process.env.STORE_ID || "eb83e6ab-6c63-42b3-8f44-511c992130ea";
const path = `/api/stores/${encodeURIComponent(STORE_ID)}/categories`;
const url = `${BASE}${path}`;

const body = JSON.stringify({
  categoryIds: [process.env.CATEGORY_ID || "e661d36a-7e89-4f1d-b885-9f6f5a6fe9ec"],
});

async function main() {
  const res = await fetch(url, {
    method: "DELETE",
    headers: {
      accept: "*/*",
      "content-type": "application/json",
    },
    body,
  });
  const text = await res.text();
  console.log("URL:", url);
  console.log("Status:", res.status);
  try {
    console.log("Body:", JSON.parse(text));
  } catch {
    console.log("Body (raw):", text);
  }
}

main().catch(console.error);
