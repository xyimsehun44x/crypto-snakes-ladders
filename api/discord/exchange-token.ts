import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // CORS headers for frontend requests
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  const { code } = req.body;

  if (!code) {
    return res.status(400).json({ error: 'Authorization code is required' });
  }

  try {
    const response = await fetch('https://discord.com/api/oauth2/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: '1414845018161676339',
        client_secret: 'TtOWzTBYF6_2_dJ3hrkqVx1jFqyJ6Ib_',
        grant_type: 'authorization_code',
        code,
        redirect_uri: getRedirectUri(req),
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Discord API error:', errorData);
      return res.status(400).json({ error: 'Failed to exchange code for token' });
    }

    const data = await response.json();
    return res.json({ access_token: data.access_token });

  } catch (error) {
    console.error('Token exchange error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

function getRedirectUri(req: VercelRequest): string {
  const host = req.headers.host;
  
  // For local development
  if (host?.includes('localhost')) {
    return `http://${host}/auth/discord/callback`;
  }
  
  // For production
  return `https://${host}/auth/discord/callback`;
}