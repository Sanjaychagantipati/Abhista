import { db } from '../utils/db.js';
import { Role, VerificationStatus } from '@prisma/client';

export interface ProfessionalProfileInput {
  fullName: string;
  businessName?: string | null;
  profileImage?: string | null;
  coverImage?: string | null;
  description?: string | null;
  experienceYears: number;
  city: string;
  state: string;
  serviceAreas?: string | null;
  categoryId: number;
  phoneNumber: string;
  email: string;
}

export interface QueryFilters {
  page?: number;
  limit?: number;
  categoryId?: number;
  city?: string;
  search?: string;
  isFeatured?: boolean;
}

export async function listProfessionals(filters: QueryFilters) {
  const page = Number(filters.page) || 1;
  const limit = Number(filters.limit) || 10;
  const skip = (page - 1) * limit;

  const whereClause: any = {
    verificationStatus: VerificationStatus.VERIFIED, // Public list only shows verified
  };

  if (filters.categoryId) {
    whereClause.categoryId = Number(filters.categoryId);
  }

  if (filters.city) {
    whereClause.city = {
      contains: filters.city,
      mode: 'insensitive',
    };
  }

  if (filters.isFeatured !== undefined) {
    whereClause.isFeatured = filters.isFeatured;
  }

  if (filters.search) {
    whereClause.OR = [
      { fullName: { contains: filters.search, mode: 'insensitive' } },
      { businessName: { contains: filters.search, mode: 'insensitive' } },
      { description: { contains: filters.search, mode: 'insensitive' } },
    ];
  }

  const [total, data] = await Promise.all([
    db.professionalProfile.count({ where: whereClause }),
    db.professionalProfile.findMany({
      where: whereClause,
      include: {
        category: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
      skip,
      take: limit,
    }),
  ]);

  return {
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
    data,
  };
}

export async function getProfessionalById(id: string) {
  const profile = await db.professionalProfile.findUnique({
    where: { id },
    include: {
      category: true,
      portfolios: true,
      reviews: {
        include: {
          customer: true,
        },
      },
    },
  });

  if (!profile) {
    throw new Error('Professional profile not found');
  }

  return profile;
}

export async function getProfessionalByUserId(userId: string) {
  const profile = await db.professionalProfile.findUnique({
    where: { userId },
    include: {
      category: true,
      portfolios: true,
    },
  });

  return profile;
}

export async function createProfessionalProfile(userId: string, input: ProfessionalProfileInput) {
  // 1. Verify user exists and has PROFESSIONAL role
  const user = await db.user.findUnique({ where: { id: userId } });
  if (!user) {
    throw new Error('User not found');
  }
  if (user.role !== Role.PROFESSIONAL) {
    throw new Error('Forbidden: Only users with PROFESSIONAL role can create professional profiles');
  }

  // 2. Verify unique user profile (one profile per user)
  const existingProfile = await db.professionalProfile.findUnique({ where: { userId } });
  if (existingProfile) {
    throw new Error('Professional profile already exists for this user');
  }

  // 3. Validation
  await validateProfileInput(input);

  // 4. Create profile
  return await db.professionalProfile.create({
    data: {
      userId,
      fullName: input.fullName,
      businessName: input.businessName,
      profileImage: input.profileImage,
      coverImage: input.coverImage,
      description: input.description,
      experienceYears: Number(input.experienceYears),
      city: input.city,
      state: input.state,
      serviceAreas: input.serviceAreas,
      categoryId: Number(input.categoryId),
      phoneNumber: input.phoneNumber,
      email: input.email,
      verificationStatus: VerificationStatus.PENDING,
      isFeatured: false,
      isAvailable: true,
    },
  });
}

export async function updateProfessionalProfile(userId: string, input: Partial<ProfessionalProfileInput>) {
  // 1. Verify profile exists
  const existingProfile = await db.professionalProfile.findUnique({ where: { userId } });
  if (!existingProfile) {
    throw new Error('Professional profile not found');
  }

  // 2. Validate inputs
  if (input.experienceYears !== undefined && Number(input.experienceYears) < 0) {
    throw new Error('Experience years cannot be negative');
  }
  if (input.phoneNumber && !/^\+?[0-9]{10,15}$/.test(input.phoneNumber)) {
    throw new Error('Invalid phone number format. Must be 10-15 digits');
  }
  if (input.categoryId) {
    const categoryExists = await db.serviceCategory.findUnique({
      where: { id: Number(input.categoryId) },
    });
    if (!categoryExists) {
      throw new Error('Selected service category does not exist');
    }
  }

  // 3. Update
  return await db.professionalProfile.update({
    where: { userId },
    data: {
      fullName: input.fullName,
      businessName: input.businessName,
      profileImage: input.profileImage,
      coverImage: input.coverImage,
      description: input.description,
      experienceYears: input.experienceYears !== undefined ? Number(input.experienceYears) : undefined,
      city: input.city,
      state: input.state,
      serviceAreas: input.serviceAreas,
      categoryId: input.categoryId ? Number(input.categoryId) : undefined,
      phoneNumber: input.phoneNumber,
      email: input.email,
    },
  });
}

// Admin Operations
export async function adminVerifyProfessional(id: string, status: string) {
  if (status !== 'VERIFIED' && status !== 'PENDING' && status !== 'REJECTED') {
    throw new Error('Invalid verification status');
  }

  const profile = await db.professionalProfile.findUnique({ where: { id } });
  if (!profile) {
    throw new Error('Professional profile not found');
  }

  return await db.professionalProfile.update({
    where: { id },
    data: {
      verificationStatus: status as VerificationStatus,
    },
  });
}

export async function adminFeatureProfessional(id: string, isFeatured: boolean) {
  const profile = await db.professionalProfile.findUnique({ where: { id } });
  if (!profile) {
    throw new Error('Professional profile not found');
  }

  return await db.professionalProfile.update({
    where: { id },
    data: {
      isFeatured,
    },
  });
}

export async function adminUpdateProfessionalAvailability(id: string, isAvailable: boolean) {
  const profile = await db.professionalProfile.findUnique({ where: { id } });
  if (!profile) {
    throw new Error('Professional profile not found');
  }

  return await db.professionalProfile.update({
    where: { id },
    data: {
      isAvailable,
    },
  });
}

// Helpers
async function validateProfileInput(input: ProfessionalProfileInput) {
  if (!input.fullName || input.fullName.trim() === '') {
    throw new Error('Full name is required');
  }
  if (input.experienceYears === undefined || Number(input.experienceYears) < 0) {
    throw new Error('Valid experience years (>= 0) is required');
  }
  if (!input.city || input.city.trim() === '') {
    throw new Error('City is required');
  }
  if (!input.state || input.state.trim() === '') {
    throw new Error('State is required');
  }
  if (!input.categoryId) {
    throw new Error('Service category is required');
  }
  if (!input.phoneNumber || !/^\+?[0-9]{10,15}$/.test(input.phoneNumber)) {
    throw new Error('Invalid phone number format. Must be 10-15 digits');
  }
  if (!input.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.email)) {
    throw new Error('Valid email address is required');
  }

  // Check category exists
  const categoryExists = await db.serviceCategory.findUnique({
    where: { id: Number(input.categoryId) },
  });
  if (!categoryExists) {
    throw new Error('Selected service category does not exist');
  }
}
