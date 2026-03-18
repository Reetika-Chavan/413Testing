import Link from "next/link";

export const cachePrimingEnabled = true;

export async function generateStaticParams() {
  return [
    { slug: "article-1" },
    { slug: "article-2" },
    { slug: "article-3" },
  ];
}

const posts: Record<string, { title: string; date: string; author: string; body: string }> = {
  "article-1": {
    title: "Getting Started with Next.js",
    date: "February 10, 2026",
    author: "Jane Doe",
    body: "Next.js is a powerful React framework that gives you the best developer experience with all the features you need for production: hybrid static and server rendering, TypeScript support, smart bundling, route pre-fetching, and more.",
  },
  "article-2": {
    title: "Understanding Cache Priming",
    date: "February 14, 2026",
    author: "John Smith",
    body: "Cache priming warms up your CDN before real users arrive. By pre-fetching key pages at deploy time, you eliminate cold-cache latency for the first visitors after a new deployment — making every page load feel instant.",
  },
  "article-3": {
    title: "Edge Functions Explained",
    date: "February 18, 2026",
    author: "Jane Doe",
    body: "Edge functions run your code at the network edge, closer to your users than a traditional server. This reduces round-trip latency and enables powerful use cases like personalisation, A/B testing, and request rewriting — all without a full server.",
  },
};

type Props = {
  params: Promise<{ slug: string }>;
};

export default async function BlogPost({ params }: Props) {
  const { slug } = await params;
  const post = posts[slug];

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4 text-gray-900 dark:text-gray-100">404</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">Post not found.</p>
          <Link href="/blog" className="text-blue-600 hover:underline">← Back to Blog</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <nav className="container mx-auto px-6 py-6">
        <div className="flex items-center justify-between">
          <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            TestApp
          </div>
          <Link
            href="/"
            className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium"
          >
            ← Home
          </Link>
        </div>
      </nav>

      <main className="container mx-auto px-6 py-16 max-w-3xl">
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-10 shadow-lg border border-gray-100 dark:border-gray-700">
          <div className="mb-8">
            <span className="text-sm font-medium text-blue-600 dark:text-blue-400 uppercase tracking-wide">
              Blog
            </span>
            <h1 className="text-4xl font-bold mt-2 mb-4 text-gray-900 dark:text-gray-100">
              {post.title}
            </h1>
            <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
              <span>{post.author}</span>
              <span>·</span>
              <span>{post.date}</span>
              <span>·</span>
              <code className="bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded text-xs">
                /blog/{slug}
              </code>
            </div>
          </div>

          <div className="prose dark:prose-invert max-w-none">
            <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
              {post.body}
            </p>
          </div>
        </div>

        <div className="mt-8 flex gap-4">
          {Object.keys(posts)
            .filter((s) => s !== slug)
            .map((s) => (
              <Link
                key={s}
                href={`/blog/${s}`}
                className="flex-1 bg-white dark:bg-gray-800 rounded-xl p-4 shadow border border-gray-100 dark:border-gray-700 hover:shadow-md transition-all"
              >
                <p className="text-xs text-blue-600 dark:text-blue-400 mb-1">Up next</p>
                <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                  {posts[s].title}
                </p>
              </Link>
            ))}
        </div>
      </main>
    </div>
  );
}
