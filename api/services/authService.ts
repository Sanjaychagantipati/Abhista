import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { db } from '../utils/db.js';
import { Role } from '@prisma/client';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthUser {
  id: string;
  firstName?: string;
  lastName?: string;
  email: string;
  phone?: string | null;
  role: string;
  status?: string;
}

export interface LoginResponse {
  accessToken: string;
  user: AuthUser;
}

export async function loginUser(input: LoginRequest): Promise<LoginResponse> {
  const { email, password } = input;

  if (!email || !password) {
    throw new Error('Email and password are required');
  }

  // 1. Fetch user with profiles
  const user = await db.user.findUnique({
    where: { email },
    include: {
      customerProfile: true,
      professionalProfile: true,
      consultantProfile: true,
    },
  });

  if (!user) {
    throw new Error('Invalid email or password');
  }

  if (user.status !== 'ACTIVE') {
    throw new Error('Your account is currently inactive or suspended');
  }

  // 2. Compare password
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error('Invalid email or password');
  }

  // 3. Generate JWT
  const jwtSecret = process.env.JWT_SECRET;
  if (!jwtSecret) {
    throw new Error('Server misconfiguration: JWT_SECRET environment variable is missing');
  }

  const token = jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role,
    },
    jwtSecret,
    { expiresIn: '7d' }
  );

  // 4. Map backend roles to frontend values
  let frontendRole = 'ROLE_CUSTOMER';
  let firstName = '';
  let lastName = '';
  let phone: string | null = null;

  switch (user.role) {
    case Role.ADMIN:
      frontendRole = 'ROLE_ADMIN';
      firstName = 'Admin';
      lastName = 'User';
      break;

    case Role.CUSTOMER:
      frontendRole = 'ROLE_CUSTOMER';
      if (user.customerProfile) {
        const parts = user.customerProfile.fullName.split(' ');
        firstName = parts[0] || '';
        lastName = parts.slice(1).join(' ') || '';
        phone = user.customerProfile.phoneNumber;
      }
      break;

    case Role.PROFESSIONAL:
      frontendRole = 'ROLE_CONTRACTOR'; // Map PROFESSIONAL to CONTRACTOR for dashboard routing
      if (user.professionalProfile) {
        const parts = user.professionalProfile.fullName.split(' ');
        firstName = parts[0] || '';
        lastName = parts.slice(1).join(' ') || '';
        phone = user.professionalProfile.phoneNumber;
      }
      break;

    case Role.CONSULTANT:
      frontendRole = 'ROLE_ARCHITECT'; // Map CONSULTANT to ARCHITECT for dashboard routing
      if (user.consultantProfile) {
        firstName = 'Consultant';
        lastName = 'Expert';
      }
      break;
  }

  return {
    accessToken: token,
    user: {
      id: user.id,
      email: user.email,
      role: frontendRole,
      firstName,
      lastName,
      phone,
      status: user.status,
    },
  };
}
