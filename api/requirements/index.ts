import { VercelRequest, VercelResponse } from '@vercel/node';
import { verifyToken } from '../utils/auth.js';
import { db } from '../utils/db.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const method = req.method;

  if (method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ success: false, message: `Method ${method} Not Allowed` });
  }

  const user = verifyToken(req);
  if (!user) {
    return res.status(401).json({ success: false, message: 'Unauthorized: Missing or invalid token' });
  }

  try {
    // Get customer profile matching authenticated user id
    const customerProfile = await db.customerProfile.findUnique({
      where: { userId: user.id },
    });

    if (!customerProfile) {
      return res.status(400).json({
        success: false,
        message: 'Customer profile required before submitting a requirement.',
      });
    }

    const {
      title,
      description,
      serviceCategory,
      location,
      budgetMin,
      budgetMax,
      preferredStartDate,
    } = req.body;

    if (!title || !description || !serviceCategory || !location || budgetMin === undefined || budgetMax === undefined) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }

    if (Number(budgetMin) < 0 || Number(budgetMax) < Number(budgetMin)) {
      return res.status(400).json({ success: false, message: 'Invalid budget range' });
    }

    const requirement = await db.requirement.create({
      data: {
        customerId: customerProfile.id,
        title,
        description,
        serviceCategory,
        location,
        budgetMin: Number(budgetMin),
        budgetMax: Number(budgetMax),
        preferredStartDate: preferredStartDate ? new Date(preferredStartDate) : null,
        status: 'OPEN',
      },
    });

    // Return RequirementCreateResponse directly at root (as expected by frontend client)
    return res.status(201).json({
      id: requirement.id,
      status: 'OPEN',
      message: 'Requirement created successfully',
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
}
