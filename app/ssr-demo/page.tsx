import Link from "next/link";

export const cachePrimingEnabled = true;

export default async function SSRDemo() {
  const big = "A".repeat(12000);


  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <nav className="container mx-auto px-6 py-6">
        <div className="flex items-center justify-between">
          <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            TestApp
          </div>
          <div className="flex gap-4 flex-wrap">
            <Link
              href="/"
              className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium"
            >
              Home
            </Link>
            <Link
              href="/about"
              className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium"
            >
              About
            </Link>
            <Link
              href="/services"
              className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium"
            >
              Services
            </Link>
            <Link
              href="/contact"
              className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium"
            >
              Contact
            </Link>
            <Link
              href="/ssr-demo"
              className="px-4 py-2 text-blue-600 dark:text-blue-400 font-medium border-b-2 border-blue-600 dark:border-blue-400"
            >
              SSR Demo
            </Link>
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-6 py-20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Next.js SSR Demo
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Testing Server-Side Rendering with large content
            </p>
          </div>

          <div className="grid gap-8">
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg border border-gray-100 dark:border-gray-700">
              <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-200">
                Large Content Test
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                This page contains {big.length.toLocaleString()} characters of repeated content to test SSR performance.
              </p>
              <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-6 border border-gray-200 dark:border-gray-700 max-h-96 overflow-auto">
                <p className="font-mono text-sm break-all text-gray-700 dark:text-gray-300">
                  {big}
                </p>
              </div>
            </div>

            <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
              <h2 className="text-2xl font-bold mb-4">Performance Info</h2>
              <ul className="space-y-2">
                <li>✅ Server-Side Rendered (SSR)</li>
                <li>✅ Content generated at request time</li>
                <li>✅ Total characters: {big.length.toLocaleString()}</li>
                <li>✅ Rendered on Next.js server</li>
              </ul>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg border border-gray-100 dark:border-gray-700">
              <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-200">
                Additional SSR Test
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Here's another section with dynamic content generated at request time:
              </p>
              <div className="space-y-4">
                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
                  <p className="text-blue-800 dark:text-blue-200">
                    Current timestamp: {new Date().toISOString()}
                  </p>
                </div>
                <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4 border border-purple-200 dark:border-purple-800">
                  <p className="text-purple-800 dark:text-purple-200">
                    Random value: {Math.random().toString(36).substring(7)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="container mx-auto px-6 py-8 mt-20 border-t border-gray-200 dark:border-gray-700">
        <p className="text-center text-gray-600 dark:text-gray-400">
          Next.js SSR Demo Page - Testing large content rendering
        </p>
      </footer>
    </div>
  );
}
