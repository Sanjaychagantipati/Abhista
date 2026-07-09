import { VercelRequest, VercelResponse } from '@vercel/node';
import { requireActiveSubscription } from '../utils/subscriptionMiddleware.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Apply subscription guard
  const hasAccess = await requireActiveSubscription(req, res);
  if (!hasAccess) {
    return; // Response is already structured and dispatched by the guard
  }

  const method = req.method;
  if (method === 'POST') {
    return res.status(201).json({
      success: true,
      message: 'Premium consultation booking processed successfully.',
    });
  }

  res.setHeader('Allow', ['POST']);
  return res.status(405).json({ success: false, message: `Method ${method} Not Allowed` });
}
