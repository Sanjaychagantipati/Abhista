import { VercelRequest, VercelResponse } from '@vercel/node';
import { verifyToken } from '../utils/auth.js';
import { activateSubscription } from '../services/subscriptionService.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const user = verifyToken(req);
  if (!user) {
    return res.status(401).json({ success: false, message: 'Unauthorized: Missing or invalid token' });
  }

  const method = req.method;
  if (method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ success: false, message: `Method ${method} Not Allowed` });
  }

  try {
    const { planId } = req.body;
    if (!planId) {
      return res.status(400).json({ success: false, message: 'planId is required' });
    }

    const subscription = await activateSubscription(user.id, Number(planId));
    return res.status(200).json({
      success: true,
      message: 'Subscription activated successfully',
      data: subscription,
    });
  } catch (err: any) {
    return res.status(400).json({ success: false, message: err.message });
  }
}
