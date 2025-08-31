/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

declare global {
  interface Window {
    consent?: {
      get: () => { ads: boolean; external: boolean; ts: number };
      set: (p: Partial<{ ads: boolean; external: boolean }>) => void;
      setAll: (v: boolean) => void;
      decided: () => boolean;
      KEY: string;
    };
  }
}
export {};

