import type { APIRoute } from 'astro';

export const prerender = false;

function parseCookies(header: string | null): Record<string, string> {
  if (!header) return {};
  return Object.fromEntries(
    header.split(';').map((c) => {
      const eq = c.indexOf('=');
      return eq === -1
        ? [c.trim(), '']
        : [c.slice(0, eq).trim(), c.slice(eq + 1).trim()];
    })
  );
}

async function hmac(data: string, secret: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  const sig = await crypto.subtle.sign(
    'HMAC',
    key,
    new TextEncoder().encode(data)
  );
  return Array.from(new Uint8Array(sig))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

export const GET: APIRoute = async ({ request, url }) => {
  const code = url.searchParams.get('code');
  const stateParam = url.searchParams.get('state');

  const cookies = parseCookies(request.headers.get('cookie'));
  const storedState = cookies['oauth_state'];
  const stateOk = Boolean(
    stateParam && storedState && stateParam === storedState
  );
  // #region agent log
  fetch('http://127.0.0.1:7928/ingest/43834006-f204-41c2-8d39-e4c8c0de5ae3', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Debug-Session-Id': '8d268e',
    },
    body: JSON.stringify({
      sessionId: '8d268e',
      location: 'callback.ts:entry',
      message: 'OAuth callback',
      data: {
        hypothesisId: 'H1',
        origin: url.origin,
        hasStateParam: Boolean(stateParam),
        hasStoredStateCookie: Boolean(storedState),
        statesMatch: stateOk,
      },
      timestamp: Date.now(),
    }),
  }).catch(() => {});
  // #endregion
  if (!stateParam || !storedState || stateParam !== storedState) {
    return new Response('Invalid state parameter', {
      status: 400,
      headers: {
        'X-Admin-Debug': JSON.stringify({
          hypothesisId: 'H1',
          reason: 'state_mismatch_or_missing',
          callbackOrigin: url.origin,
          hasStateParam: Boolean(stateParam),
          hasStoredStateCookie: Boolean(storedState),
        }),
        'Cache-Control': 'no-store',
      },
    });
  }

  if (!code) {
    return new Response('Missing OAuth code', {
      status: 400,
      headers: {
        'X-Admin-Debug': JSON.stringify({
          hypothesisId: 'H1',
          reason: 'missing_code',
        }),
        'Cache-Control': 'no-store',
      },
    });
  }

  const tokenRes = await fetch('https://github.com/login/oauth/access_token', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      client_id: process.env.GITHUB_CLIENT_ID,
      client_secret: process.env.GITHUB_CLIENT_SECRET,
      code,
    }),
  });
  const tokenData = (await tokenRes.json()) as {
    access_token?: string;
    error?: string;
  };
  // #region agent log
  fetch('http://127.0.0.1:7928/ingest/43834006-f204-41c2-8d39-e4c8c0de5ae3', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Debug-Session-Id': '8d268e',
    },
    body: JSON.stringify({
      sessionId: '8d268e',
      location: 'callback.ts:token',
      message: 'Token exchange result',
      data: {
        hypothesisId: 'H2',
        tokenResOk: tokenRes.ok,
        hasAccessToken: Boolean(tokenData.access_token),
        oauthError: tokenData.error ?? null,
      },
      timestamp: Date.now(),
    }),
  }).catch(() => {});
  // #endregion
  if (!tokenData.access_token) {
    return new Response('OAuth token exchange failed', {
      status: 400,
      headers: {
        'X-Admin-Debug': JSON.stringify({
          hypothesisId: 'H2',
          tokenResOk: tokenRes.ok,
          oauthError: tokenData.error ?? null,
        }),
        'Cache-Control': 'no-store',
      },
    });
  }

  const { access_token } = tokenData;

  const userRes = await fetch('https://api.github.com/user', {
    headers: {
      Authorization: `Bearer ${access_token}`,
      Accept: 'application/vnd.github+json',
      'User-Agent': 'profesional-site-admin',
    },
  });
  const user = (await userRes.json()) as { login?: string };
  const { login } = user;
  if (!login) {
    return new Response('GitHub user response missing login', {
      status: 502,
      headers: {
        'X-Admin-Debug': JSON.stringify({
          hypothesisId: 'H5',
          userResOk: userRes.ok,
        }),
        'Cache-Control': 'no-store',
      },
    });
  }

  const collabRes = await fetch(
    `https://api.github.com/repos/rainonej/profesional_site/collaborators/${login}`,
    {
      headers: {
        Authorization: `Bearer ${access_token}`,
        Accept: 'application/vnd.github+json',
        'User-Agent': 'profesional-site-admin',
      },
    }
  );
  // #region agent log
  fetch('http://127.0.0.1:7928/ingest/43834006-f204-41c2-8d39-e4c8c0de5ae3', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Debug-Session-Id': '8d268e',
    },
    body: JSON.stringify({
      sessionId: '8d268e',
      location: 'callback.ts:collab',
      message: 'Collaborator check',
      data: {
        hypothesisId: 'H3',
        collabStatus: collabRes.status,
        loginLen: login.length,
      },
      timestamp: Date.now(),
    }),
  }).catch(() => {});
  // #endregion
  if (collabRes.status !== 204) {
    return new Response('Access denied — not a repo collaborator', {
      status: 403,
      headers: {
        'X-Admin-Debug': JSON.stringify({
          hypothesisId: 'H3',
          collabStatus: collabRes.status,
        }),
        'Cache-Control': 'no-store',
      },
    });
  }

  const secret = process.env.SESSION_SECRET;
  if (!secret) {
    return new Response('Server misconfiguration', {
      status: 500,
      headers: {
        'X-Admin-Debug': JSON.stringify({
          hypothesisId: 'H4',
          reason: 'SESSION_SECRET_missing',
        }),
        'Cache-Control': 'no-store',
      },
    });
  }

  const issuedAt = Date.now().toString();
  const payload = `${login}.${issuedAt}`;
  const sig = await hmac(payload, secret);
  const sessionToken = `${payload}.${sig}`;
  const maxAge = 24 * 60 * 60;

  const headers = new Headers({ Location: `${url.origin}/admin` });
  headers.append(
    'Set-Cookie',
    `session=${sessionToken}; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=${maxAge}`
  );
  headers.append(
    'Set-Cookie',
    'oauth_state=; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=0'
  );
  // #region agent log
  fetch('http://127.0.0.1:7928/ingest/43834006-f204-41c2-8d39-e4c8c0de5ae3', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Debug-Session-Id': '8d268e',
    },
    body: JSON.stringify({
      sessionId: '8d268e',
      location: 'callback.ts:success',
      message: 'OAuth success redirect',
      data: {
        hypothesisId: 'H0',
        redirectTo: `${url.origin}/admin`,
      },
      timestamp: Date.now(),
    }),
  }).catch(() => {});
  // #endregion
  return new Response(null, { status: 302, headers });
};
