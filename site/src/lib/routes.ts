/**
 * Route registry — single source of truth for all v1 routes.
 *
 * Each RouteRecord describes a page in the site. Fields are designed to
 * support future engine extraction (Task 3.4) where the engine can remap,
 * disable, or inject routes at install time.
 */

export type RouteSection = 'main' | 'content' | 'admin';
export type RouteVisibility =
  | 'public' // top-level, listed in nav and publicRoutes
  | 'hidden' // publicly accessible URL but not a primary nav destination (e.g. detail pages)
  | 'protected'; // requires authentication

export interface RouteRecord {
  /** URL pattern, using Astro file-based routing syntax */
  pattern: string;
  /** Human-readable label used in nav and admin views */
  label: string;
  /** Grouping for display and classification purposes */
  section: RouteSection;
  /**
   * Visibility level.
   * - `public`: top-level route, included in nav and publicRoutes
   * - `hidden`: accessible to anyone but not a primary nav item (e.g. [slug] detail pages)
   * - `protected`: requires authentication
   */
  visibility: RouteVisibility;
  /** Whether the engine can override this route's pattern at install time */
  remappable: boolean;
  /** Whether the engine can turn this route off entirely */
  disableable: boolean;
}

export const routes: RouteRecord[] = [
  {
    pattern: '/',
    label: 'Home',
    section: 'main',
    visibility: 'public',
    remappable: false,
    disableable: false,
  },
  {
    pattern: '/about',
    label: 'About',
    section: 'main',
    visibility: 'public',
    remappable: true,
    disableable: true,
  },
  {
    pattern: '/work',
    label: 'Work',
    section: 'content',
    visibility: 'public',
    remappable: true,
    disableable: true,
  },
  {
    pattern: '/work/[slug]',
    label: 'Work Detail',
    section: 'content',
    visibility: 'hidden',
    remappable: true,
    disableable: true,
  },
  {
    pattern: '/writing',
    label: 'Writing',
    section: 'content',
    visibility: 'public',
    remappable: true,
    disableable: true,
  },
  {
    pattern: '/writing/[slug]',
    label: 'Writing Detail',
    section: 'content',
    visibility: 'hidden',
    remappable: true,
    disableable: true,
  },
  {
    pattern: '/contact',
    label: 'Contact',
    section: 'main',
    visibility: 'public',
    remappable: true,
    disableable: true,
  },
  {
    pattern: '/admin',
    label: 'Admin',
    section: 'admin',
    visibility: 'protected',
    remappable: false,
    disableable: false,
  },
];

/** All public-facing routes (excludes protected and hidden) */
export const publicRoutes = routes.filter((r) => r.visibility === 'public');

/** Routes grouped by section */
export const routesBySection = routes.reduce<
  Record<RouteSection, RouteRecord[]>
>(
  (acc, route) => {
    acc[route.section].push(route);
    return acc;
  },
  { main: [], content: [], admin: [] }
);
