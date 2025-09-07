export type BreadcrumbEntry = { name: string; url: string };

export type BuildArticleInput = {
  type?: string;
  headline: string;
  description?: string;
  datePublished: string;
  dateModified?: string;
  image?: string[] | undefined;
  canonical: string;
};

export type FAQItem = { q: string; a: string };
export type FAQSection = { id?: string; headline?: string; items: FAQItem[] };

// ---------- Core builders ----------

export function buildBreadcrumbLD(entries: BreadcrumbEntry[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: entries.map((e, idx) => ({
      "@type": "ListItem",
      position: idx + 1,
      name: e.name,
      item: e.url,
    })),
  };
}

export function buildArticleLD(input: BuildArticleInput) {
  const {
    type = "Article",
    headline,
    description,
    datePublished,
    dateModified,
    image,
    canonical,
  } = input;

  const obj: any = {
    "@context": "https://schema.org",
    "@type": type,
    headline,
    ...(description ? { description } : {}),
    datePublished,
    ...(dateModified ? { dateModified } : {}),
    ...(image && image.length ? { image } : {}),
    mainEntityOfPage: canonical,
  };

  return obj;
}

// ---------- FAQ helpers ----------

function normalizeFAQSections(anySections: any): FAQSection[] {
  // Erwartet bevorzugt: [{ id, headline, items:[{q,a}...] }, ...]
  if (Array.isArray(anySections)) {
    return anySections
      .map((s) => {
        const items: FAQItem[] = Array.isArray(s?.items)
          ? s.items
          : Array.isArray(s) // falls versehentlich direkt [{q,a},…] übergeben wurde
          ? (s as any)
          : [];
        return { id: s?.id, headline: s?.headline, items };
      })
      .filter((s) => Array.isArray(s.items) && s.items.length > 0);
  }
  return [];
}

function normalizeFAQItems(anyItems: any): FAQItem[] {
  // Fallback: frontmatter.schema.faq: [{q,a}, …]
  if (Array.isArray(anyItems)) {
    return anyItems.filter(
      (it) =>
        it &&
        typeof it.q === "string" &&
        it.q.trim() &&
        typeof it.a === "string" &&
        it.a.trim()
    );
  }
  return [];
}

/**
 * Akzeptiert:
 * - sections (bevorzugt): [{ id?, headline?, items:[{q,a}] }]
 * - fallbackItems: [{q,a}] (z.B. frontmatter.schema.faq)
 */
export function buildFAQPage(
  sections: FAQSection[] | any,
  fallbackItems?: FAQItem[] | any,
  opts?: { name?: string }
) {
  const normSections = normalizeFAQSections(sections);
  const fromSections: FAQItem[] = normSections.flatMap((s) => s.items || []);
  const fromFallback = normalizeFAQItems(fallbackItems);

  const all = [...fromSections, ...fromFallback].filter(
    (it) =>
      it &&
      typeof it.q === "string" &&
      it.q.trim() &&
      typeof it.a === "string" &&
      it.a.trim()
  );

  if (!all.length) return null;

  const faq: any = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: all.map((it) => ({
      "@type": "Question",
      name: it.q,
      acceptedAnswer: { "@type": "Answer", text: it.a },
    })),
  };

  if (opts?.name) faq.name = opts.name;
  return faq;
}
