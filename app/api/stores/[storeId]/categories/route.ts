import { NextRequest, NextResponse } from "next/server";

/**
 * Red Panda–style: DELETE with JSON body
 * {"categoryIds":["..."]} — some clients send DELETE+body; edge/proxies may differ from DELETE without body.
 */
export const dynamic = "force-dynamic";

type RouteContext = { params: Promise<{ storeId: string }> };

function log(
  method: string,
  request: NextRequest,
  storeId: string,
  extra?: Record<string, unknown>
) {
  const u = request.nextUrl;
  console.log(`[api/stores/.../categories] ${method}`, {
    storeId,
    path: u.pathname,
    search: u.search,
    href: u.href,
    ...extra,
  });
}

export async function GET(request: NextRequest, ctx: RouteContext) {
  const { storeId } = await ctx.params;
  log("GET", request, storeId);
  return NextResponse.json({ ok: true, method: "GET", storeId });
}

export async function POST(request: NextRequest, ctx: RouteContext) {
  const { storeId } = await ctx.params;
  log("POST", request, storeId);
  return NextResponse.json({ ok: true, method: "POST", storeId });
}

export async function DELETE(request: NextRequest, ctx: RouteContext) {
  const { storeId } = await ctx.params;
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    body = null;
  }
  log("DELETE", request, storeId, { body });
  return NextResponse.json({
    ok: true,
    method: "DELETE",
    storeId,
    receivedBody: body,
  });
}
