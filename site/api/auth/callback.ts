export const config = { runtime: 'edge' };

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

  // Create signed session token: "{login}.{hmac(login)}"
  const sig = await hmac(login, process.env.SESSION_SECRET!);
  const sessionToken = `${login}.${sig}`;
  const maxAge = 24 * 60 * 60; // 24 hours

  return new Response(null, {
    status: 302,
    headers: {
      Location: `${url.origin}/admin`,
      'Set-Cookie': `session=${sessionToken}; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=${maxAge}`,
    },
  });
}
