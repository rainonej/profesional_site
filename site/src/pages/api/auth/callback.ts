import type { APIRoute } from 'astro';
import { parseCookies, buildSessionToken } from '../../../lib/session';

export const prerender = false;

const NO_STORE = { 'Cache-Control': 'no-store' } as const;

export const GET: APIRoute = async ({ request, url }) => {
  const code = url.searchParams.get('code');
  const stateParam = url.searchParams.get('state');

  const cookies = parseCookies(request.headers.get('cookie'));
  const storedState = cookies['oauth_state'];
  if (!stateParam || !storedState || stateParam !== storedState) {
    return new Response('Invalid state parameter', {
      status: 400,
      headers: NO_STORE,
    });
  }

  if (!code) {
    return new Response('Missing OAuth code', {
      status: 400,
      headers: NO_STORE,
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

  // GitHub may return HTTP 200 with { error } in the body for OAuth failures.
  if (!tokenData.access_token) {
    return new Response('OAuth token exchange failed', {
      status: 400,
      headers: NO_STORE,
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
  if (!userRes.ok || !user.login) {
    return new Response('GitHub user request failed', {
      status: 502,
      headers: NO_STORE,
    });
  }

  const { login } = user;

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
  if (collabRes.status !== 204) {
    return new Response('Access denied — not a repo collaborator', {
      status: 403,
      headers: NO_STORE,
    });
  }

  const secret = process.env.SESSION_SECRET;
  if (!secret) {
    return new Response('Server misconfiguration', {
      status: 500,
      headers: NO_STORE,
    });
  }

  const issuedAt = Date.now();
  const sessionToken = await buildSessionToken(
    login,
    issuedAt,
    access_token,
    secret
  );
  const maxAge = 24 * 60 * 60;

  const headers = new Headers({
    Location: `${url.origin}/admin`,
    ...NO_STORE,
  });
  headers.append(
    'Set-Cookie',
    `session=${sessionToken}; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=${maxAge}`
  );
  headers.append(
    'Set-Cookie',
    'oauth_state=; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=0'
  );
  return new Response(null, { status: 302, headers });
};
