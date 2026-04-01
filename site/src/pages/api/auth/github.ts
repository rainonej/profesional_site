import type { APIRoute } from 'astro';

export const prerender = false;

export const GET: APIRoute = () => {
  const clientId = process.env.GITHUB_CLIENT_ID!;
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
