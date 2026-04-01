export const config = { runtime: 'edge' };

export default function handler(): Response {
  const clientId = process.env.GITHUB_CLIENT_ID!;
  const params = new URLSearchParams({
    client_id: clientId,
    scope: 'read:user public_repo',
  });
  return Response.redirect(
    `https://github.com/login/oauth/authorize?${params}`,
    302
  );
}
