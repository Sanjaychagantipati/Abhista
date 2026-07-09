import { VercelRequest, VercelResponse } from '@vercel/node';
import { getProviderById } from '../../services/providerService.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { id } = req.query;
  const paramId = Array.isArray(id) ? id[0] : id;

  if (!paramId) {
    return res.status(400).json({ success: false, message: 'Missing provider ID parameter' });
  }

  const method = req.method;

  if (method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).json({ success: false, message: `Method ${method} Not Allowed` });
  }

  try {
    const profile = await getProviderById(paramId);
    return res.status(200).json({ success: true, data: profile });
  } catch (err: any) {
    const message = err.message || '';
    if (message.includes('not found')) {
      return res.status(404).json({ success: false, message });
    }
    return res.status(500).json({ success: false, message });
  }
}
