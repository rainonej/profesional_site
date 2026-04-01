import type { APIRoute } from 'astro';

export const prerender = false;

export const GET: APIRoute = ({ request }) => {
  const startOrigin = new URL(request.url).origin;
  // #region agent log
  fetch('http://127.0.0.1:7928/ingest/43834006-f204-41c2-8d39-e4c8c0de5ae3', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Debug-Session-Id': '8d268e',
    },
    body: JSON.stringify({
      sessionId: '8d268e',
      location: 'github.ts:start',
      message: 'OAuth start',
      data: {
        hypothesisId: 'H1',
        startOrigin,
        hasClientId: Boolean(process.env.GITHUB_CLIENT_ID),
      },
      timestamp: Date.now(),
    }),
  }).catch(() => {});
  // #endregion
  const clientId = process.env.GITHUB_CLIENT_ID!;
  if (!clientId) {
    return new Response('Server misconfiguration', {
      status: 500,
      headers: {
        'X-Admin-Debug': JSON.stringify({
          hypothesisId: 'H4',
          reason: 'GITHUB_CLIENT_ID_missing',
        }),
        'Cache-Control': 'no-store',
      },
    });
  }
  const state = crypto.randomUUID();
  const params = new URLSearchParams({
    client_id: clientId,
    scope: 'read:user public_repo',
    state,
  });
  const headers = new Headers({
    Location: `https://github.com/login/oauth/authorize?${params}`,
    'Set-Cookie': `oauth_state=${state}; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=600`,
  });
  return new Response(null, { status: 302, headers });
};
