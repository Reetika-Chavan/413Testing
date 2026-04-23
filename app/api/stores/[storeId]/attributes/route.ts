import { NextRequest, NextResponse } from "next/server";

/**
 * Mirrors the support-case route: /api/stores/{uuid}/attributes
 * If DELETE returns 200 locally but CF1003 on Launch, the request is likely
 * blocked or reformatted before Next.js (URL/path validation per CF1003 docs).
 */
export const dynamic = "force-dynamic";

type RouteContext = { params: Promise<{ storeId: string }> };

function log(method: string, request: NextRequest, storeId: string) {
  const u = request.nextUrl;
  console.log(`[api/stores/.../attributes] ${method}`, {
    storeId,
    path: u.pathname,
    search: u.search,
    // Helps catch RFC 3986 issues: raw URL vs parsed path
    href: u.href,
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

export async function PUT(request: NextRequest, ctx: RouteContext) {
  const { storeId } = await ctx.params;
  log("PUT", request, storeId);
  return NextResponse.json({ ok: true, method: "PUT", storeId });
}

export async function PATCH(request: NextRequest, ctx: RouteContext) {
  const { storeId } = await ctx.params;
  log("PATCH", request, storeId);
  return NextResponse.json({ ok: true, method: "PATCH", storeId });
}

export async function DELETE(request: NextRequest, ctx: RouteContext) {
  const { storeId } = await ctx.params;
  log("DELETE", request, storeId);
  return NextResponse.json({ ok: true, method: "DELETE", storeId });
}
