export const config = { runtime: 'edge' };

const SESSION_MAX_AGE_MS = 24 * 60 * 60 * 1000; // 24 hours

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

async function verifyToken(
  token: string,
  secret: string
): Promise<string | null> {
  // Token format: "{login}.{issuedAt}.{hmac(login.issuedAt)}"
  const lastDot = token.lastIndexOf('.');
  if (lastDot === -1) return null;
  const payload = token.slice(0, lastDot); // "login.issuedAt"
  const sig = token.slice(lastDot + 1);

  // Verify HMAC signature
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  const expected = await crypto.subtle.sign(
    'HMAC',
    key,
    new TextEncoder().encode(payload)
  );
  const expectedHex = Array.from(new Uint8Array(expected))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
  if (sig !== expectedHex) return null;

  // Extract login and issuedAt from payload
  const firstDot = payload.indexOf('.');
  if (firstDot === -1) return null;
  const login = payload.slice(0, firstDot);
  const issuedAt = parseInt(payload.slice(firstDot + 1), 10);

  // Reject expired tokens (server-side check independent of cookie Max-Age)
  if (Number.isNaN(issuedAt) || Date.now() - issuedAt > SESSION_MAX_AGE_MS) {
    return null;
  }

  return login;
}

export default async function handler(request: Request): Promise<Response> {
  const cookies = parseCookies(request.headers.get('cookie'));
  const token = cookies['session'];

  if (!token) {
    return Response.json({ authenticated: false });
  }

  const username = await verifyToken(token, process.env.SESSION_SECRET!);
  if (!username) {
    return Response.json({ authenticated: false });
  }

  return Response.json({ authenticated: true, username });
}
