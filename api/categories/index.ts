import { VercelRequest, VercelResponse } from '@vercel/node';
import { verifyToken, hasRole } from '../utils/auth';
import { getActiveCategories, createCategory } from '../services/categoryService';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const method = req.method;

  switch (method) {
    case 'GET':
      try {
        const categories = await getActiveCategories();
        return res.status(200).json({ data: categories });
      } catch (err: any) {
        return res.status(500).json({ error: err.message });
      }

    case 'POST': {
      // 1. Authenticate user
      const user = verifyToken(req);
      if (!user) {
        return res.status(401).json({ error: 'Unauthorized: Missing or invalid token' });
      }

      // 2. Authorize admin
      if (!hasRole(user, ['ADMIN'])) {
        return res.status(403).json({ error: 'Forbidden: Admin access required' });
      }

      // 3. Create category
      try {
        const newCategory = await createCategory(req.body);
        return res.status(201).json({
          message: 'Category created successfully',
          data: newCategory,
        });
      } catch (err: any) {
        const message = err.message || '';
        if (message.includes('already exists') || message.includes('is required') || message.includes('Invalid')) {
          return res.status(400).json({ error: message });
        }
        return res.status(500).json({ error: message });
      }
    }

    default:
      res.setHeader('Allow', ['GET', 'POST']);
      return res.status(405).json({ error: `Method ${method} Not Allowed` });
  }
}
