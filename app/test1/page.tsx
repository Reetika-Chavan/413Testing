export default function Test1Page() {
  return (
    <main className="mx-auto max-w-lg p-8 font-sans">
      <h1 className="text-2xl font-semibold text-neutral-900 dark:text-neutral-100">
        Test 1
      </h1>
      <p className="mt-3 text-neutral-600 dark:text-neutral-400">
        You are on <code className="rounded bg-neutral-100 px-1 dark:bg-neutral-800">/test1</code>.
        On Contentstack Launch, the edge proxy redirects this path to{" "}
        <code className="rounded bg-neutral-100 px-1 dark:bg-neutral-800">/test2</code>.
      </p>
    </main>
  );
}
