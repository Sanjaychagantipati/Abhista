import { VercelRequest } from '@vercel/node';
import jwt from 'jsonwebtoken';

export interface AuthenticatedUser {
  id: string;
  email: string;
  role: 'CUSTOMER' | 'PROVIDER' | 'ADMIN';
}

export function verifyToken(req: VercelRequest): AuthenticatedUser | null {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : null;
    
    if (!token) return null;
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as AuthenticatedUser;
    return decoded;
  } catch (error) {
    return null;
  }
}

export function hasRole(user: AuthenticatedUser, allowedRoles: ('CUSTOMER' | 'PROVIDER' | 'ADMIN')[]): boolean {
  return allowedRoles.includes(user.role);
}
