export const config = { runtime: 'edge' };

export default function handler(): Response {
  const clientId = process.env.GITHUB_CLIENT_ID!;
  const state = crypto.randomUUID();
  const params = new URLSearchParams({
    client_id: clientId,
    scope: 'read:user public_repo',
    state,
  });
  const headers = new Headers({
    Location: `https://github.com/login/oauth/authorize?${params}`,
    // Store state in a short-lived httpOnly cookie for CSRF verification in callback
    'Set-Cookie': `oauth_state=${state}; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=600`,
  });
  return new Response(null, { status: 302, headers });
}
