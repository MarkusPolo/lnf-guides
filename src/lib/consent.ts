export type ConsentDecisions = {
  analytics: boolean;
  external: boolean;
  ads: boolean;
  adsPersonalized: boolean;
};

export function get(): ConsentDecisions {
  // @ts-ignore
  if (window.lnfConsent && typeof window.lnfConsent.get === 'function') {
    // @ts-ignore
    return window.lnfConsent.get();
  }
  return { analytics:false, external:false, ads:false, adsPersonalized:false };
}

export function allowed(key: keyof ConsentDecisions): boolean {
  // @ts-ignore
  return !!(window.lnfConsent && typeof window.lnfConsent.allowed === 'function' && window.lnfConsent.allowed(key));
}

export function openManager() {
  // Öffnet die CMP-UI
  // @ts-ignore
  if (typeof window.openPrivacy === 'function') window.openPrivacy();
}
