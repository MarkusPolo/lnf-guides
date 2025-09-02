// src/lib/consent.ts
export const CONSENT_KEY = 'lnf-consent-v1';
export const CONSENT_VERSION = 2;   // technische Banner-Version (UI/Logik)
export const POLICY_VERSION = 2;    // rechtstextliche Version (neuer Zweck: personalized ads)

export type ConsentDecisions = {
  analytics: boolean;
  external: boolean;
  ads: boolean;
  adsPersonalized: boolean;
};

export type ConsentRecord = {
  version: number;
  policyVersion: number;
  ts: number; // Unix ms
  decisions: ConsentDecisions;
};

const defaults: ConsentRecord = {
  version: CONSENT_VERSION,
  policyVersion: POLICY_VERSION,
  ts: 0,
  decisions: { analytics: false, external: false, ads: false, adsPersonalized: false },
};

export function read(): ConsentRecord {
  try {
    const raw = localStorage.getItem(CONSENT_KEY);
    if (!raw) return { ...defaults };
    const parsed = JSON.parse(raw);
    const d = parsed?.decisions || {};
    return {
      version: parsed?.version ?? CONSENT_VERSION,
      policyVersion: parsed?.policyVersion ?? POLICY_VERSION,
      ts: parsed?.ts ?? 0,
      decisions: {
        analytics: !!d.analytics,
        external: !!d.external,
        ads: !!d.ads,
        adsPersonalized: !!d.adsPersonalized
      },
    };
  } catch {
    return { ...defaults };
  }
}

export function write(next: ConsentRecord) {
  localStorage.setItem(CONSENT_KEY, JSON.stringify(next));
  const detail = next.decisions;
  window.dispatchEvent(new CustomEvent('consent:changed', { detail }));
  window.dispatchEvent(new Event('consent:updated'));
}

export function decideAll(value: boolean) {
  const v = !!value;
  write({
    version: CONSENT_VERSION,
    policyVersion: POLICY_VERSION,
    ts: Date.now(),
    decisions: { analytics: v, external: v, ads: v, adsPersonalized: v },
  });
}

export function savePartial(partial: Partial<ConsentDecisions>) {
  const prev = read();
  write({
    ...prev,
    version: CONSENT_VERSION,
    policyVersion: POLICY_VERSION,
    ts: Date.now(),
    decisions: { ...prev.decisions, ...partial },
  });
}

export function decided(): boolean {
  const r = read();
  return r.ts > 0 && r.policyVersion === POLICY_VERSION;
}

export function needsRenewal(): boolean {
  const r = read();
  return r.version !== CONSENT_VERSION || r.policyVersion !== POLICY_VERSION;
}

export function openManager() {
  window.dispatchEvent(new Event('consent:open'));
}

export function attachToWindow() {
  // @ts-expect-error
  window.consent = {
    KEY: CONSENT_KEY,
    version: CONSENT_VERSION,
    policyVersion: POLICY_VERSION,
    get: () => read().decisions,
    setAll: decideAll,
    set: savePartial,
    decided,
    needsRenewal,
    open: openManager,
  };
}
