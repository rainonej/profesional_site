export const config = { runtime: 'edge' };

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

export default async function handler(request: Request): Promise<Response> {
  const url = new URL(request.url);
  const code = url.searchParams.get('code');
  const stateParam = url.searchParams.get('state');

  // Verify CSRF state
  const cookies = parseCookies(request.headers.get('cookie'));
  const storedState = cookies['oauth_state'];
  if (!stateParam || !storedState || stateParam !== storedState) {
    return new Response('Invalid state parameter', { status: 400 });
  }

  if (!code) {
    return new Response('Missing OAuth code', { status: 400 });
  }

  // Exchange code for access token
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
  if (!tokenData.access_token) {
    return new Response('OAuth token exchange failed', { status: 400 });
  }

  const { access_token } = tokenData;

  // Get authenticated GitHub user
  const userRes = await fetch('https://api.github.com/user', {
    headers: {
      Authorization: `Bearer ${access_token}`,
      Accept: 'application/vnd.github+json',
      'User-Agent': 'profesional-site-admin',
    },
  });
  const user = (await userRes.json()) as { login: string };
  const { login } = user;

  // Verify the user is a repo collaborator
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
    });
  }

  // Create signed session token: "{login}.{issuedAt}.{hmac(login.issuedAt)}"
  // The issuedAt timestamp is included in the signed payload so expiry is
  // enforced server-side in /api/auth/session, not just via cookie Max-Age.
  const issuedAt = Date.now().toString();
  const payload = `${login}.${issuedAt}`;
  const sig = await hmac(payload, process.env.SESSION_SECRET!);
  const sessionToken = `${payload}.${sig}`;
  const maxAge = 24 * 60 * 60; // 24 hours in seconds

  const headers = new Headers({ Location: `${url.origin}/admin` });
  headers.append(
    'Set-Cookie',
    `session=${sessionToken}; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=${maxAge}`
  );
  // Clear the one-time CSRF state cookie
  headers.append(
    'Set-Cookie',
    'oauth_state=; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=0'
  );
  return new Response(null, { status: 302, headers });
}
