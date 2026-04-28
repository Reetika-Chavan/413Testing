import Link from "next/link";

export default function Test2Page() {
  return (
    <main className="mx-auto max-w-lg p-8 font-sans">
      <h1 className="text-2xl font-semibold text-neutral-900 dark:text-neutral-100">
        Test 2
      </h1>
      <p className="mt-3 text-neutral-600 dark:text-neutral-400">
        Redirect target page.
      </p>
      <Link
        href="/test1"
        className="mt-6 inline-block text-purple-600 underline dark:text-purple-400"
      >
        Go to /test1 (Launch will redirect here)
      </Link>
    </main>
  );
}
