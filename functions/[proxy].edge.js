/**
 * Target path comes from Launch environment (`EDGE_REDIRECT_TEST1_TARGET`, e.g. `/test2`).
 * https://www.contentstack.com/docs/developers/launch/edge-functions#launch-edge-functions-context-object
 */
export default function handler(request, context) {
  const test2Path = context.env?.EDGE_REDIRECT_TEST1_TARGET;
  if (!test2Path || typeof test2Path !== "string") {
    return fetch(request);
  }

  const normalizedTarget =
    test2Path.startsWith("/") ? test2Path : `/${test2Path}`;

  const modifiedUrl = new URL(request.url);
  const route =
    modifiedUrl.pathname.endsWith("/") && modifiedUrl.pathname !== "/"
      ? modifiedUrl.pathname.slice(0, -1)
      : modifiedUrl.pathname;

  if (route === "/test1") {
    modifiedUrl.pathname = normalizedTarget;
    return Response.redirect(modifiedUrl, 302);
  }

  return fetch(request);
}
