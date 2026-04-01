import type { APIRoute } from 'astro';
import { parseCookies, verifySession } from '../../../lib/session';

export const prerender = false;

const NO_STORE = { 'Cache-Control': 'no-store' } as const;

export const GET: APIRoute = async ({ request }) => {
  const cookies = parseCookies(request.headers.get('cookie'));
  const token = cookies['session'];

  if (!token) {
    return Response.json({ authenticated: false }, { headers: NO_STORE });
  }

  const secret = process.env.SESSION_SECRET;
  if (!secret) {
    return Response.json(
      { error: 'Server misconfiguration' },
      { status: 500, headers: NO_STORE }
    );
  }

  const session = await verifySession(token, secret);
  if (!session) {
    return Response.json({ authenticated: false }, { headers: NO_STORE });
  }

  return Response.json(
    { authenticated: true, username: session.login },
    { headers: NO_STORE }
  );
};
