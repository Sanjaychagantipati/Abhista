import type { ServiceCategory } from '../category/categoryTypes';
import type { ProviderProfile } from '../provider/providerTypes';

export type CallbackStatus = 'NEW' | 'ASSIGNED' | 'CONTACTED' | 'CONSULTATION_BOOKED' | 'SERVICE_BOOKED' | 'CLOSED' | 'CANCELLED';

export interface CallbackRequest {
  id: string;
  referenceNumber: string;
  fullName: string;
  phoneNumber: string;
  email?: string | null;
  city: string;
  state: string;
  preferredLanguage: string;
  serviceCategoryId?: number | null;
  projectType: string;
  estimatedBudget?: number | null;
  preferredCallTime: string;
  message: string;
  status: CallbackStatus;
  assignedProviderId?: string | null;
  assignedAdminId?: string | null;
  callbackDate?: string | null;
  callbackTime?: string | null;
  notes?: string | null;
  source: string;
  createdAt: string;
  updatedAt: string;
  category?: ServiceCategory;
  provider?: ProviderProfile;
}

export interface CreateCallbackRequest {
  fullName: string;
  phoneNumber: string;
  email?: string;
  city?: string;
  state?: string;
  preferredLanguage?: string;
  serviceCategoryId?: number;
  projectType?: string;
  estimatedBudget?: number;
  preferredCallTime?: string;
  message?: string;
  source?: string;
}

export interface CallbackAnalytics {
  total: number;
  assigned: number;
  contacted: number;
  consultationBooked: number;
  serviceBooked: number;
  conversionRate: number;
  topCategories: { name: string; count: number }[];
  topCities: { city: string; count: number }[];
}
