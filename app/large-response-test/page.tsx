import Link from "next/link";

export const dynamic = "force-dynamic";

type Props = {
  searchParams: Promise<{ size?: string }>;
};

export default async function LargeResponseTest({ searchParams }: Props) {
  const params = await searchParams;
  const sizeMB = Math.min(Math.max(parseFloat(params.size || "1"), 0.1), 5);
  const targetChars = Math.ceil(sizeMB * 1024 * 1024);
  const bigString = "X".repeat(targetChars);

  return (
    <div>
      <nav style={{ padding: "24px" }}>
        <Link href="/">Home</Link> | <Link href="/ssr-demo">SSR Demo</Link>
      </nav>
      <main style={{ padding: "24px" }}>
        <h1>Large Response Test (~{sizeMB} MB content)</h1>
        <p>
          Content size: {sizeMB} MB ({targetChars.toLocaleString()} chars) |
          Rendered: {new Date().toISOString()}
        </p>
        <p style={{ fontSize: "12px", color: "#666" }}>
          Use ?size=N to adjust (in MB, max 5).
        </p>
        <div style={{ maxHeight: "200px", overflow: "hidden", wordBreak: "break-all", fontSize: "10px", color: "#999" }}>
          {bigString}
        </div>
      </main>
    </div>
  );
}
