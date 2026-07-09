import { VercelRequest, VercelResponse } from '@vercel/node';
import { verifyToken, hasRole } from '../../utils/auth.js';
import { updateProviderAvailability } from '../../services/providerDashboardService.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const user = verifyToken(req);
  if (!user) {
    return res.status(401).json({ success: false, message: 'Unauthorized: Missing or invalid token' });
  }

  if (!hasRole(user, ['PROVIDER'])) {
    return res.status(403).json({ success: false, message: 'Forbidden: Provider access required' });
  }

  const method = req.method;
  if (method === 'PATCH') {
    try {
      const { status } = req.body;
      const updated = await updateProviderAvailability(user.id, status);
      return res.status(200).json({
        success: true,
        message: 'Availability status updated successfully',
        data: updated,
      });
    } catch (err: any) {
      return res.status(400).json({ success: false, message: err.message });
    }
  }

  res.setHeader('Allow', ['PATCH']);
  return res.status(405).json({ success: false, message: `Method ${method} Not Allowed` });
}
