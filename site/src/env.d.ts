/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

interface ImportMetaEnv {
  /** Optional override for the Admin nav link origin (defaults to Vercel when `base` is a GitHub Pages path). */
  readonly PUBLIC_ADMIN_ORIGIN?: string;
  /** GitHub repo owner for collaborator auth check (default: rainonej). */
  readonly REPO_OWNER?: string;
  /** GitHub repo name for collaborator auth check (default: profesional_site). */
  readonly REPO_NAME?: string;
  /** GitHub repo in `owner/repo` format for content API calls (default: rainonej/profesional_site). */
  readonly GITHUB_REPO?: string;
}
