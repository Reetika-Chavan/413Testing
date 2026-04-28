import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { getBaseUrl } from "@/utils/getBaseUrl";

/**
 * Minimal login hop: preserves OAuth params (same idea as red-panda simple-login).
 * Demo app sends users to home with oauth_return instead of /account/login.
 */
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const clientId = searchParams.get("client_id");
  const redirectUri = searchParams.get("redirect_uri");
  const state = searchParams.get("state");
  const baseUrl = await getBaseUrl(request);

  const oauthReturn = Buffer.from(
    JSON.stringify({ client_id: clientId, redirect_uri: redirectUri, state })
  ).toString("base64");

  const loginUrl = new URL("/", baseUrl);
  loginUrl.searchParams.set("oauth_return", oauthReturn);

  return NextResponse.redirect(loginUrl.toString());
}
