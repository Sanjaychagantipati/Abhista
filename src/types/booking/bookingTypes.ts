import type { ProviderProfile } from '../provider/providerTypes';
import type { ServiceCategory } from '../category/categoryTypes';

export type BookingStatus =
  | 'REQUESTED'
  | 'ACCEPTED'
  | 'REJECTED'
  | 'IN_PROGRESS'
  | 'COMPLETED'
  | 'CANCELLED';

export interface CustomerProfileMin {
  id: string;
  userId: string;
  fullName: string;
  phoneNumber: string;
  email: string;
}

export interface Booking {
  id: string;
  customerId: string;
  providerId: string;
  categoryId: number;
  bookingNumber: string;
  bookingStatus: BookingStatus;
  preferredDate: string;
  preferredTime: string;
  customerAddress: string;
  city: string;
  state: string;
  notes: string | null;
  estimatedBudget: number | null;
  createdAt: string;
  updatedAt: string;
  customer?: CustomerProfileMin | null;
  provider?: ProviderProfile | null;
  category?: ServiceCategory | null;
}

export interface CreateBookingRequest {
  providerId: string;
  categoryId: number;
  preferredDate: string;
  preferredTime: string;
  customerAddress: string;
  city: string;
  state: string;
  notes?: string | null;
  estimatedBudget?: number | null;
}
