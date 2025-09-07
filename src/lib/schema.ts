// Klein, rein funktional, gut testbar
export type BreadcrumbLD = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: Array<{ '@type': 'ListItem'; position: number; name: string; item: string }>
};

export type ArticleLikeLD = {
  '@context': 'https://schema.org',
  '@type': string; // 'Article' | 'BlogPosting' | 'NewsArticle' ...
  headline: string;
  description?: string;
  datePublished?: string;
  dateModified?: string;
  image?: string[]; // recommended
  mainEntityOfPage?: string;
  author?: any;
  publisher?: any;
  hasPart?: any[]; // can include FAQPage etc.
};

export type FAQItem = { q: string; a: string };
export type FAQSection = { id?: string; headline?: string; items: FAQItem[] };

export function buildBreadcrumbLD(items: Array<{ name: string; url: string }>): BreadcrumbLD {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((it, idx) => ({
      '@type': 'ListItem',
      position: idx + 1,
      name: it.name,
      item: it.url,
    })),
  };
}

export function buildArticleLD(params: {
  type?: string; // default 'Article'
  headline: string;
  description?: string;
  datePublished?: string;
  dateModified?: string;
  image?: string[];
  canonical?: string;
}): ArticleLikeLD {
  const {
    type = 'Article',
    headline,
    description,
    datePublished,
    dateModified,
    image,
    canonical,
  } = params;

  const ld: ArticleLikeLD = {
    '@context': 'https://schema.org',
    '@type': type,
    headline,
    ...(description ? { description } : {}),
    ...(datePublished ? { datePublished } : {}),
    ...(dateModified ? { dateModified } : {}),
    ...(image?.length ? { image } : {}),
    ...(canonical ? { mainEntityOfPage: canonical } : {}),
  };

  return ld;
}

// Baue ein einzelnes FAQPage-Objekt aus einer Section
export function buildFAQPageLD(section: FAQSection & { url?: string }): any {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    ...(section.headline ? { name: section.headline } : {}),
    ...(section.url ? { mainEntityOfPage: section.url } : {}),
    mainEntity: section.items.map((qa) => ({
      '@type': 'Question',
      name: qa.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: qa.a,
      },
    })),
  };
}

// Hänge FAQ-Teile als hasPart an den Artikel (ohne ihn in FAQPage umzudefinieren)
export function attachFAQPartsToArticle(article: ArticleLikeLD, faqSections: FAQSection[], pageUrl: string): {
  article: ArticleLikeLD;
  faqPages: any[]; // separat rendern ist ok; Google versteht mehrere JSON-LDs
} {
  if (!faqSections?.length) return { article, faqPages: [] };

  const faqPages = faqSections.map((sec) => buildFAQPageLD({ ...sec, url: pageUrl + (sec.id ? `#${sec.id}` : '') }));
  const augmented: ArticleLikeLD = {
    ...article,
    hasPart: [
      ...(article.hasPart ?? []),
      ...faqPages.map((f) => ({ '@type': 'FAQPage', name: f.name, mainEntityOfPage: f.mainEntityOfPage })),
    ],
  };

  return { article: augmented, faqPages };
}
