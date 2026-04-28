import { NextRequest, NextResponse } from "next/server";

/**
 * Local repro of red-panda-commerce OAuth symptom: non-empty `state` → no response (hang);
 * missing/empty `state` → fast 400 JSON.
 *
 * Repro:
 *   pnpm dev
 *   curl -sS -m 10 'http://localhost:3000/api/oauth/simple-authorize?client_id=x&redirect_uri=https%3A%2F%2Fexample.com%2Fcb&response_type=code'
 *   curl -sS -m 10 'http://localhost:3000/api/oauth/simple-authorize?client_id=x&redirect_uri=https%3A%2F%2Fexample.com%2Fcb&response_type=code&state=any'
 */
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const state = request.nextUrl.searchParams.get("state");
  const hasNonEmptyState = state !== null && state.length > 0;

  if (!hasNonEmptyState) {
    return NextResponse.json(
      {
        error: "Missing required parameters: client_id, redirect_uri, state",
      },
      { status: 400 }
    );
  }

  // Simulates production hang when `state` is present (never completes).
  await new Promise<void>(() => {});
}
