import { NextRequest } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const sizeMB = parseFloat(searchParams.get("size") || "1");
  const clampedSize = Math.min(Math.max(sizeMB, 0.1), 20);
  const targetBytes = Math.ceil(clampedSize * 1024 * 1024);

  const body = "A".repeat(targetBytes);

  return new Response(body, {
    status: 200,
    headers: {
      "Content-Type": "text/plain",
      "Content-Length": String(body.length),
      "X-Body-Size-Bytes": String(body.length),
      "X-Body-Size-MB": String((body.length / 1024 / 1024).toFixed(2)),
    },
  });
}
