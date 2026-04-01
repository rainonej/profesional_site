export const config = { runtime: 'edge' };

export default function handler(request: Request): Response {
  const { origin } = new URL(request.url);
  return new Response(null, {
    status: 302,
    headers: {
      Location: `${origin}/`,
      'Set-Cookie':
        'session=; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=0',
    },
  });
}
