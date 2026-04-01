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

async function verifyToken(
  token: string,
  secret: string
): Promise<string | null> {
  const dot = token.lastIndexOf('.');
  if (dot === -1) return null;
  const username = token.slice(0, dot);
  const sig = token.slice(dot + 1);

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
    new TextEncoder().encode(username)
  );
  const expectedHex = Array.from(new Uint8Array(expected))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');

  return sig === expectedHex ? username : null;
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
