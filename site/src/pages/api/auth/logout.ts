import type { APIRoute } from 'astro';

export const prerender = false;

export const GET: APIRoute = ({ url }) => {
  const { origin } = url;
  return new Response(null, {
    status: 302,
    headers: {
      Location: `${origin}/`,
      'Set-Cookie':
        'session=; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=0',
    },
  });
};
