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

/**
 * Baut EINE FAQPage mit allen Q/A aus allen Sektionen.
 * Leer- oder kaputte Einträge werden gefiltert.
 */
export function buildFAQPageFromSections(
  sections: FAQSection[],
  opts?: { name?: string }
) {
  const allQA = (sections || [])
    .flatMap((s) => Array.isArray(s?.items) ? s.items : [])
    .filter((it) => it && typeof it.q === "string" && it.q.trim() && typeof it.a === "string" && it.a.trim())
    .map((it) => ({
      "@type": "Question",
      name: it.q,
      acceptedAnswer: { "@type": "Answer", text: it.a },
    }));

  if (!allQA.length) return null;

  const faq: any = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: allQA,
  };

  if (opts?.name) faq.name = opts.name;
  return faq;
}
