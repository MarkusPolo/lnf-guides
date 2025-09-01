export {};

declare global {
  interface ConsentRecord {
    version: number;
    policyVersion: number;
    ts: number;
    decisions: {
      analytics: boolean;
      external: boolean;
      ads: boolean;
    };
  }
  interface Window {
    consent?: {
      KEY: string;
      VERSION: number;
      POLICY: number;
      get(): ConsentRecord;
      set(p: Partial<ConsentRecord["decisions"]>): ConsentRecord;
      setAll(v: boolean): ConsentRecord;
      decided(): boolean;
      open(): void;
    };
  }
}
