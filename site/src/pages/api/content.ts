/**
 * Content API — GitHub Contents API proxy for the in-house CMS.
 *
 * All operations require a valid session cookie containing the GitHub access
 * token (set by /api/auth/callback). Writes target the `dev` branch.
 *
 * GET  ?path={repoFilePath}
 *   Returns { sha, content } — base64-encoded file content + file SHA needed
 *   for subsequent PUT/DELETE calls.
 *
 * PUT  body: { path, content, message, sha? }
 *   Creates (no sha) or updates (with sha) a file. Content is the raw string;
 *   this endpoint base64-encodes it before sending to GitHub.
 *
 * DELETE  body: { path, sha, message }
 *   Deletes a file. Requires the current file SHA.
 */

import type { APIRoute } from 'astro';
import { parseCookies, verifySession } from '../../lib/session';

export const prerender = false;

const NO_STORE = { 'Cache-Control': 'no-store' } as const;
const REPO = 'rainonej/profesional_site';
const BRANCH = 'dev';
const GH_API = 'https://api.github.com';

/** Encode each path segment but preserve slashes. */
function encodePath(p: string) {
  return p.split('/').map(encodeURIComponent).join('/');
}

function ghHeaders(token: string) {
  return {
    Authorization: `Bearer ${token}`,
    Accept: 'application/vnd.github+json',
    'Content-Type': 'application/json',
    'User-Agent': 'profesional-site-admin',
    'X-GitHub-Api-Version': '2022-11-28',
  };
}

async function getSession(request: Request) {
  const cookies = parseCookies(request.headers.get('cookie'));
  const token = cookies['session'];
  if (!token) return null;
  const secret = process.env.SESSION_SECRET;
  if (!secret) return null;
  return verifySession(token, secret);
}

// ── GET ───────────────────────────────────────────────────────────────────────

export const GET: APIRoute = async ({ request, url }) => {
  const session = await getSession(request);
  if (!session) {
    return Response.json(
      { error: 'Unauthorized' },
      { status: 401, headers: NO_STORE }
    );
  }

  const path = url.searchParams.get('path');
  if (!path) {
    return Response.json(
      { error: 'Missing path' },
      { status: 400, headers: NO_STORE }
    );
  }

  const res = await fetch(
    `${GH_API}/repos/${REPO}/contents/${encodePath(path)}?ref=${BRANCH}`,
    { headers: ghHeaders(session.accessToken) }
  );

  if (!res.ok) {
    const body = await res.text();
    return Response.json(
      { error: `GitHub API error: ${res.status}`, detail: body },
      { status: res.status, headers: NO_STORE }
    );
  }

  const data = (await res.json()) as { sha: string; content: string };
  return Response.json(
    { sha: data.sha, content: data.content },
    { headers: NO_STORE }
  );
};

// ── PUT ───────────────────────────────────────────────────────────────────────

export const PUT: APIRoute = async ({ request }) => {
  const session = await getSession(request);
  if (!session) {
    return Response.json(
      { error: 'Unauthorized' },
      { status: 401, headers: NO_STORE }
    );
  }

  const body = (await request.json()) as {
    path: string;
    content: string;
    message: string;
    sha?: string;
  };

  if (!body.path || body.content === undefined || !body.message) {
    return Response.json(
      { error: 'Missing required fields' },
      { status: 400, headers: NO_STORE }
    );
  }

  // Base64-encode the raw file content for the GitHub API
  const encoded = btoa(unescape(encodeURIComponent(body.content)));

  const payload: Record<string, string> = {
    message: body.message,
    content: encoded,
    branch: BRANCH,
  };
  if (body.sha) payload['sha'] = body.sha;

  const res = await fetch(
    `${GH_API}/repos/${REPO}/contents/${encodeURIComponent(body.path)}`,
    {
      method: 'PUT',
      headers: ghHeaders(session.accessToken),
      body: JSON.stringify(payload),
    }
  );

  if (!res.ok) {
    const detail = await res.text();
    return Response.json(
      { error: `GitHub API error: ${res.status}`, detail },
      { status: res.status, headers: NO_STORE }
    );
  }

  const result = (await res.json()) as { commit: { sha: string } };
  return Response.json(
    { ok: true, commitSha: result.commit.sha },
    { headers: NO_STORE }
  );
};

// ── DELETE ────────────────────────────────────────────────────────────────────

export const DELETE: APIRoute = async ({ request }) => {
  const session = await getSession(request);
  if (!session) {
    return Response.json(
      { error: 'Unauthorized' },
      { status: 401, headers: NO_STORE }
    );
  }

  const body = (await request.json()) as {
    path: string;
    sha: string;
    message: string;
  };

  if (!body.path || !body.sha || !body.message) {
    return Response.json(
      { error: 'Missing required fields' },
      { status: 400, headers: NO_STORE }
    );
  }

  const res = await fetch(
    `${GH_API}/repos/${REPO}/contents/${encodeURIComponent(body.path)}`,
    {
      method: 'DELETE',
      headers: ghHeaders(session.accessToken),
      body: JSON.stringify({
        message: body.message,
        sha: body.sha,
        branch: BRANCH,
      }),
    }
  );

  if (!res.ok) {
    const detail = await res.text();
    return Response.json(
      { error: `GitHub API error: ${res.status}`, detail },
      { status: res.status, headers: NO_STORE }
    );
  }

  return Response.json({ ok: true }, { headers: NO_STORE });
};
