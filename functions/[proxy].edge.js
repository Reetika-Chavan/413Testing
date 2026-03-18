export default async function handler(request, context) {
  const modifiedUrl = new URL(request.url);
  const route = modifiedUrl.pathname;

  if (route === "/about") {
    const redirectHost = context.env.REDIRECT_HOST;
    const redirectUrl = new URL(redirectHost);
    return Response.redirect(redirectUrl, 302);
  }

  const isRSCRequest =
    request.headers.get("RSC") === "1" ||
    request.headers.has("Next-Router-State-Tree") ||
    request.headers.has("Next-Router-Prefetch");

  const response = await fetch(request);
  const headers = new Headers(response.headers);

  if (isRSCRequest) {
    // RSC flight payloads are only meaningful to the Next.js client-side router.
    // Prevent CDNs from ever caching them so they can never poison the HTML cache entry.
    headers.set("Cache-Control", "private, no-store");
  } else {
    // For normal HTML responses, ensure the CDN maintains separate cache entries
    // per RSC header variant so a future RSC response can never overwrite the HTML entry.
    const existing = headers.get("Vary") || "";
    const varyValues = new Set(
      existing.split(",").map((v) => v.trim()).filter(Boolean)
    );
    varyValues.add("RSC");
    varyValues.add("Next-Router-State-Tree");
    varyValues.add("Next-Router-Prefetch");
    headers.set("Vary", [...varyValues].join(", "));
  }

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}