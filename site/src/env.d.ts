/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

interface ImportMetaEnv {
  /** Optional override for the Admin nav link origin (defaults to Vercel when `base` is a GitHub Pages path). */
  readonly PUBLIC_ADMIN_ORIGIN?: string;
  /** GitHub repo owner for collaborator auth check and content API (default: rainonej). */
  readonly REPO_OWNER?: string;
  /** GitHub repo name for collaborator auth check and content API (default: profesional_site). */
  readonly REPO_NAME?: string;
}
