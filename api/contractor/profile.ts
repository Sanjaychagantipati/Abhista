import { VercelRequest, VercelResponse } from '@vercel/node';
import { verifyToken } from '../utils/auth.js';
import { db } from '../utils/db.js';
import { VerificationStatus } from '@prisma/client';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const user = verifyToken(req);
  if (!user) {
    return res.status(401).json({ success: false, message: 'Unauthorized: Missing or invalid token' });
  }

  const method = req.method;

  switch (method) {
    case 'GET':
      try {
        const profile = await db.professionalProfile.findUnique({
          where: { userId: user.id },
        });
        if (!profile) {
          return res.status(404).json({ success: false, message: 'Contractor profile not found' });
        }
        return res.status(200).json({ success: true, data: profile });
      } catch (err: any) {
        return res.status(500).json({ success: false, message: err.message });
      }

    case 'POST':
    case 'PUT':
      try {
        const {
          companyName,
          ownerName,
          phoneNumber,
          experienceYears,
          specialization,
          serviceAreas,
          description,
        } = req.body;

        if (!companyName || !ownerName || !phoneNumber || experienceYears === undefined || !specialization) {
          return res.status(400).json({ success: false, message: 'Missing required profile fields' });
        }

        const profile = await db.professionalProfile.upsert({
          where: { userId: user.id },
          update: {
            companyName,
            ownerName,
            phoneNumber,
            experienceYears: Number(experienceYears),
            specialization,
            serviceAreas,
            description,
          },
          create: {
            userId: user.id,
            companyName,
            ownerName,
            phoneNumber,
            experienceYears: Number(experienceYears),
            specialization,
            serviceAreas,
            description,
            verificationStatus: VerificationStatus.PENDING,
            isFeatured: false,
          },
        });

        return res.status(200).json({ success: true, data: profile });
      } catch (err: any) {
        return res.status(500).json({ success: false, message: err.message });
      }

    default:
      res.setHeader('Allow', ['GET', 'POST', 'PUT']);
      return res.status(405).json({ success: false, message: `Method ${method} Not Allowed` });
  }
}
