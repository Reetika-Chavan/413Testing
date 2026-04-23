import { Stack } from "@/lib/contentstack";

/** Serve fresh data from Contentstack on each request (not a stale static shell). */
export const dynamic = "force-dynamic";

function pickStringField(
  entry: Record<string, unknown>,
  fieldUid: string
): string | null {
  const v = entry[fieldUid];
  if (typeof v === "string" && v.trim().length > 0) return v;
  if (fieldUid !== "title") {
    const t = entry.title;
    if (typeof t === "string" && t.trim().length > 0) return t;
  }
  return null;
}

async function loadContactIntroFromStack(): Promise<string> {
  if (
    !process.env.NEXT_PUBLIC_CONTENTSTACK_API_KEY ||
    !process.env.NEXT_PUBLIC_CONTENTSTACK_DELIVERY_TOKEN ||
    !process.env.NEXT_PUBLIC_CONTENTSTACK_ENVIRONMENT
  ) {
    return "";
  }

  const contentTypeUid =
    process.env.CONTENTSTACK_CONTACT_CONTENT_TYPE_UID ?? "header";
  const fieldUid = process.env.CONTENTSTACK_CONTACT_INTRO_FIELD_UID ?? "title";
  const entryUid = process.env.CONTENTSTACK_CONTACT_ENTRY_UID;
  const locale = process.env.NEXT_PUBLIC_CONTENTSTACK_LOCALE;

  async function fetchEntryByUid(uid: string, withLocale: boolean) {
    let r = Stack.ContentType(contentTypeUid).Entry(uid);
    if (withLocale && locale) {
      r = r.language(locale);
    }
    const entry = (await r.toJSON().fetch()) as Record<string, unknown>;
    return pickStringField(entry, fieldUid);
  }

  async function fetchViaQuery(withLocale: boolean) {
    let q = Stack.ContentType(contentTypeUid).Query().only(fieldUid).limit(1);
    if (withLocale && locale) {
      q = q.language(locale);
    }
    const res = (await q.toJSON().find()) as {
      entries?: Record<string, unknown>[];
    };
    const first = res.entries?.[0];
    if (!first) return null;
    return pickStringField(first, fieldUid);
  }

  try {
    if (entryUid) {
      const withLocale = await fetchEntryByUid(entryUid, true);
      if (withLocale) return withLocale;
      const anyLocale = await fetchEntryByUid(entryUid, false);
      if (anyLocale) return anyLocale;
    } else {
      const q1 = await fetchViaQuery(true);
      if (q1) return q1;
      const q2 = await fetchViaQuery(false);
      if (q2) return q2;
    }
  } catch (e) {
    console.error("[contact] Contentstack fetch failed", e);
  }
  return "";
}

export default async function Contact() {
  const text = await loadContactIntroFromStack();

  return (
    <main className="min-h-screen p-8">
      {text ? (
        <p className="text-lg text-zinc-800 dark:text-zinc-100">{text}</p>
      ) : null}
    </main>
  );
}
