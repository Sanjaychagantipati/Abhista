import { VercelRequest, VercelResponse } from '@vercel/node';
import { verifyToken, hasRole } from '../utils/auth';
import { getCategoryBySlug, updateCategory, deleteCategory } from '../services/categoryService';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { slugOrId } = req.query;
  const param = Array.isArray(slugOrId) ? slugOrId[0] : slugOrId;

  if (!param) {
    return res.status(400).json({ error: 'Missing category parameter' });
  }

  const method = req.method;

  switch (method) {
    case 'GET':
      try {
        const category = await getCategoryBySlug(param);
        if (!category) {
          return res.status(404).json({ error: 'Category not found' });
        }
        return res.status(200).json({ data: category });
      } catch (err: any) {
        return res.status(500).json({ error: err.message });
      }

    case 'PUT': {
      // 1. Authenticate user
      const user = verifyToken(req);
      if (!user) {
        return res.status(401).json({ error: 'Unauthorized: Missing or invalid token' });
      }

      // 2. Authorize admin
      if (!hasRole(user, ['ADMIN'])) {
        return res.status(403).json({ error: 'Forbidden: Admin access required' });
      }

      // 3. Verify parameter is an ID
      const id = Number(param);
      if (isNaN(id)) {
        return res.status(400).json({ error: 'Invalid category ID parameter for updates' });
      }

      // 4. Update category
      try {
        const updated = await updateCategory(id, req.body);
        return res.status(200).json({
          message: 'Category updated successfully',
          data: updated,
        });
      } catch (err: any) {
        const message = err.message || '';
        if (message.includes('not found')) {
          return res.status(404).json({ error: message });
        }
        if (message.includes('already exists') || message.includes('cannot be blank') || message.includes('Invalid')) {
          return res.status(400).json({ error: message });
        }
        return res.status(500).json({ error: message });
      }
    }

    case 'DELETE': {
      // 1. Authenticate user
      const user = verifyToken(req);
      if (!user) {
        return res.status(401).json({ error: 'Unauthorized: Missing or invalid token' });
      }

      // 2. Authorize admin
      if (!hasRole(user, ['ADMIN'])) {
        return res.status(403).json({ error: 'Forbidden: Admin access required' });
      }

      // 3. Verify parameter is an ID
      const id = Number(param);
      if (isNaN(id)) {
        return res.status(400).json({ error: 'Invalid category ID parameter for deletion' });
      }

      // 4. Delete category
      try {
        await deleteCategory(id);
        return res.status(200).json({
          message: 'Category deleted successfully',
        });
      } catch (err: any) {
        const message = err.message || '';
        if (message.includes('not found')) {
          return res.status(404).json({ error: message });
        }
        return res.status(500).json({ error: message });
      }
    }

    default:
      res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
      return res.status(405).json({ error: `Method ${method} Not Allowed` });
  }
}
