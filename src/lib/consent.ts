// src/lib/consent.ts
export const CONSENT_KEY = 'lnf-consent';
export const CONSENT_VERSION = 1;   // technische Banner-Version (UI/Logik)
export const POLICY_VERSION = 1;    // rechtstextliche Version (Privacy-Änderungen => ++)

export type ConsentDecisions = {
  analytics: boolean;
  external: boolean;
  ads: boolean;
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
  decisions: { analytics: false, external: false, ads: false },
};

export function read(): ConsentRecord {
  try {
    const raw = localStorage.getItem(CONSENT_KEY);
    if (!raw) return { ...defaults };
    const parsed = JSON.parse(raw);
    return {
      ...defaults,
      ...parsed,
      decisions: { ...defaults.decisions, ...(parsed?.decisions || {}) },
    };
  } catch {
    return { ...defaults };
  }
}

export function write(next: ConsentRecord) {
  localStorage.setItem(CONSENT_KEY, JSON.stringify(next));
  window.dispatchEvent(new CustomEvent('consent:changed', { detail: next }));
}

export function decideAll(value: boolean) {
  const prev = read();
  write({
    ...prev,
    version: CONSENT_VERSION,
    policyVersion: POLICY_VERSION,
    ts: Date.now(),
    decisions: { analytics: value, external: value, ads: value },
  });
  window.dispatchEvent(new Event('consent:updated'));
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
  window.dispatchEvent(new Event('consent:updated'));
}

export function decided(): boolean {
  return read().ts > 0;
}

export function needsRenewal(): boolean {
  const r = read();
  return r.version !== CONSENT_VERSION || r.policyVersion !== POLICY_VERSION;
}

export function openManager() {
  window.dispatchEvent(new Event('consent:open'));
}

// Für bequemen Zugriff im Browser:
export function attachToWindow() {
  // @ts-expect-error
  window.consent = {
    KEY: CONSENT_KEY,
    version: CONSENT_VERSION,
    policyVersion: POLICY_VERSION,
    get: read,
    setAll: decideAll,
    set: savePartial,
    decided,
    needsRenewal,
    open: openManager,
  };
}
