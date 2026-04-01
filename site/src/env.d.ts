/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

interface ImportMetaEnv {
  /** Optional override for the Admin nav link origin (defaults to Vercel when `base` is a GitHub Pages path). */
  readonly PUBLIC_ADMIN_ORIGIN?: string;
}
