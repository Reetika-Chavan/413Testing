import { NextRequest, NextResponse } from "next/server";

/**
 * Neutral OAuth authorize stub for Launch/edge testing: always completes with 200.
 * (App Router equivalent of res.status(200).json({ message, stateLength }).)
 */
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const state = request.nextUrl.searchParams.get("state");

  return NextResponse.json({
    message: "Request received",
    stateLength: state?.length ?? 0,
  });
}
