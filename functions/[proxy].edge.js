export default function handler(request) {
  const modifiedUrl = new URL(request.url);
  const route =
    modifiedUrl.pathname.endsWith("/") && modifiedUrl.pathname !== "/"
      ? modifiedUrl.pathname.slice(0, -1)
      : modifiedUrl.pathname;

  if (route === "/test1") {
    modifiedUrl.pathname = "/test2";
    return Response.redirect(modifiedUrl, 302);
  }

  return fetch(request);
}
