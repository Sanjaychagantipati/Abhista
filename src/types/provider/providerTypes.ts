export interface ProviderProfile {
  id: string;
  userId: string;
  fullName: string;
  businessName: string | null;
  profileImage: string | null;
  coverImage: string | null;
  description: string | null;
  experienceYears: number;
  city: string;
  state: string;
  serviceAreas: string | null;
  categoryId: number;
  phoneNumber: string;
  email: string;
  verificationStatus: 'PENDING' | 'VERIFIED' | 'REJECTED';
  averageRating: number;
  totalReviews: number;
  totalBookings: number;
  isAvailable: boolean;
  availabilityStatus?: AvailabilityStatus;
  isFeatured: boolean;
  canProvideServices: boolean;
  canProvideConsultation: boolean;
  consultationFee: number;
  totalConsultations: number;
  createdAt: string;
  updatedAt: string;
  category?: {
    id: number;
    name: string;
    slug: string;
  } | null;
  portfolios?: any[];
  reviews?: any[];
}

export interface CreateProviderRequest {
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
  canProvideServices?: boolean;
  canProvideConsultation?: boolean;
  consultationFee?: number;
}

export interface UpdateProviderRequest {
  fullName?: string;
  businessName?: string | null;
  profileImage?: string | null;
  coverImage?: string | null;
  description?: string | null;
  experienceYears?: number;
  city?: string;
  state?: string;
  serviceAreas?: string | null;
  categoryId?: number;
  phoneNumber?: string;
  email?: string;
  canProvideServices?: boolean;
  canProvideConsultation?: boolean;
  consultationFee?: number;
}

export interface ProvidersQueryFilters {
  page?: number;
  limit?: number;
  categoryId?: number;
  city?: string;
  search?: string;
  isFeatured?: boolean;
  canProvideServices?: boolean;
  canProvideConsultation?: boolean;
}

export interface PagedResponse<T> {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  data: T[];
}

export type AvailabilityStatus = 'AVAILABLE' | 'BUSY' | 'ON_LEAVE';

export interface ProviderDashboardSummary {
  profile: {
    fullName: string;
    businessName: string | null;
    isVerified: boolean;
    experienceYears: number;
    availabilityStatus: AvailabilityStatus;
    categoryName: string;
  };
  profileCompletion: number;
  verificationStatus: 'PENDING' | 'VERIFIED' | 'REJECTED';
  availabilityStatus: AvailabilityStatus;
  subscription: {
    planName: string;
    endDate: string;
    isActive: boolean;
  } | null;
  stats: {
    pending: number;
    accepted: number;
    completed: number;
    cancelled: number;
    averageRating: number;
    totalReviews: number;
    portfolioCount: number;
  };
  recentBookings: any[];
  recentRequirements: any[];
  recentReviews: any[];
  notifications: any[];
}
