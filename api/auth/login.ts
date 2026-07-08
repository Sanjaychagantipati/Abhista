import { VercelRequest, VercelResponse } from '@vercel/node';
import { loginUser } from '../services/authService.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const method = req.method;

  if (method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: `Method ${method} Not Allowed` });
  }

  try {
    const response = await loginUser(req.body);
    return res.status(200).json(response);
  } catch (err: any) {
    const message = err.message || '';
    if (message.includes('Invalid') || message.includes('required') || message.includes('inactive')) {
      return res.status(400).json({ success: false, message });
    }
    return res.status(500).json({ success: false, message });
  }
}
