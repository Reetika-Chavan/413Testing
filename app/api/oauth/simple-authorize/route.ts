import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { getBaseUrl } from "@/utils/getBaseUrl";
import crypto from "crypto";

/**
 * Red Panda–style OAuth authorize: `state` required → passes guard → `getUser()`.
 * Missing `state` → immediate 400 (no Supabase).
 *
 * RCA repro: set `NEXT_PUBLIC_SUPABASE_URL` without `https://` (or invalid host);
 * with `state` present, `getUser()` may hang → same pattern as customer reports.
 */
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const startedAt = Date.now();
  const traceId = `oauth-simple-authorize:${crypto.randomUUID().slice(0, 8)}`;

  try {
    console.log(`[${traceId}] start`);

    const { searchParams } = request.nextUrl;
    const clientId = searchParams.get("client_id");
    const redirectUri = searchParams.get("redirect_uri");
    const state = searchParams.get("state");

    console.log(
      `[${traceId}] parsed in ${Date.now() - startedAt}ms (client_id=${Boolean(clientId)}, redirect_uri=${Boolean(redirectUri)}, state=${Boolean(state)})`
    );

    if (!clientId || !redirectUri || !state) {
      console.warn(`[${traceId}] missing required params, returning 400`);
      return NextResponse.json(
        {
          error: "Missing required parameters: client_id, redirect_uri, state",
        },
        { status: 400 }
      );
    }

    const baseUrl = await getBaseUrl(request);
    const supabase = await createClient();
    console.log(
      `[${traceId}] supabase client created in ${Date.now() - startedAt}ms`
    );

    console.log(`[${traceId}] before getUser`);
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();
    console.log(
      `[${traceId}] after getUser in ${Date.now() - startedAt}ms (has_user=${Boolean(user)}, has_error=${Boolean(userError)})`
    );

    if (userError || !user) {
      const loginUrl = new URL("/api/oauth/simple-login", baseUrl);
      loginUrl.searchParams.set("client_id", clientId);
      loginUrl.searchParams.set("redirect_uri", redirectUri);
      loginUrl.searchParams.set("state", state);
      console.log(
        `[${traceId}] redirecting to simple-login after ${Date.now() - startedAt}ms`
      );
      return NextResponse.redirect(loginUrl.toString());
    }

    return NextResponse.json(
      {
        message:
          "Authorize OK (demo): user session present; full app would show consent or issue code",
        traceId,
        hasUser: true,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(`[${traceId}] error after ${Date.now() - startedAt}ms`, error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
