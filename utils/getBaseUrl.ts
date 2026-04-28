import type { NextRequest } from "next/server";

/**
 * Public base URL for redirects (matches Red Panda / Launch proxy headers).
 */
export async function getBaseUrl(request: NextRequest): Promise<string> {
  if (process.env.NEXT_PUBLIC_APP_URL) {
    return process.env.NEXT_PUBLIC_APP_URL.replace(/\/$/, "");
  }

  const forwardedHost = request.headers.get("x-forwarded-host");
  const forwardedProto = request.headers.get("x-forwarded-proto") || "https";

  if (forwardedHost) {
    return `${forwardedProto}://${forwardedHost}`;
  }

  const host = request.headers.get("host");
  if (host && !host.includes("localhost")) {
    return `https://${host}`;
  }

  const url = new URL(request.url);
  return `${url.protocol}//${url.host}`;
}
