import { axiosClient } from '../auth/axiosClient';
import type {
  ProviderProfile,
  CreateProviderRequest,
  UpdateProviderRequest,
  ProvidersQueryFilters,
  PagedResponse,
} from '../../types/provider/providerTypes';

export const providerApi = {
  // Public APIs
  async listProviders(filters: ProvidersQueryFilters): Promise<PagedResponse<ProviderProfile>> {
    const response = await axiosClient.get<PagedResponse<ProviderProfile>>('/api/providers', {
      params: filters,
    });
    return response.data;
  },

  async getProvider(id: string): Promise<ProviderProfile> {
    const response = await axiosClient.get<{ success: boolean; data: ProviderProfile }>(
      `/api/providers/${id}`
    );
    return response.data.data;
  },

  // Protected Provider APIs
  async getOwnProfile(): Promise<ProviderProfile> {
    const response = await axiosClient.get<{ success: boolean; data: ProviderProfile }>(
      '/api/providers/profile'
    );
    return response.data.data;
  },

  async createProfile(request: CreateProviderRequest): Promise<ProviderProfile> {
    const response = await axiosClient.post<{ success: boolean; message: string; data: ProviderProfile }>(
      '/api/providers/profile',
      request
    );
    return response.data.data;
  },

  async updateProfile(request: UpdateProviderRequest): Promise<ProviderProfile> {
    const response = await axiosClient.put<{ success: boolean; message: string; data: ProviderProfile }>(
      '/api/providers/profile',
      request
    );
    return response.data.data;
  },

  // Admin APIs
  async adminVerify(id: string, status: 'VERIFIED' | 'PENDING' | 'REJECTED'): Promise<ProviderProfile> {
    const response = await axiosClient.patch<{ success: boolean; message: string; data: ProviderProfile }>(
      `/api/providers/${id}/verify`,
      { status }
    );
    return response.data.data;
  },

  async adminFeature(id: string, isFeatured: boolean): Promise<ProviderProfile> {
    const response = await axiosClient.patch<{ success: boolean; message: string; data: ProviderProfile }>(
      `/api/providers/${id}/feature`,
      { isFeatured }
    );
    return response.data.data;
  },

  async adminUpdateStatus(id: string, isAvailable: boolean): Promise<ProviderProfile> {
    const response = await axiosClient.patch<{ success: boolean; message: string; data: ProviderProfile }>(
      `/api/providers/${id}/status`,
      { isAvailable }
    );
    return response.data.data;
  },
};
