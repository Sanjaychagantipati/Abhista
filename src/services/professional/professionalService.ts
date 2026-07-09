import { axiosClient } from '../auth/axiosClient';
import {
  ProfessionalProfile,
  CreateProfessionalRequest,
  UpdateProfessionalRequest,
  ProfessionalsQueryFilters,
  PagedResponse,
} from '../../types/professional/professionalTypes';

export const professionalApi = {
  // Public APIs
  async listProfessionals(filters: ProfessionalsQueryFilters): Promise<PagedResponse<ProfessionalProfile>> {
    const response = await axiosClient.get<PagedResponse<ProfessionalProfile>>('/api/professionals', {
      params: filters,
    });
    return response.data;
  },

  async getProfessional(id: string): Promise<ProfessionalProfile> {
    const response = await axiosClient.get<{ success: boolean; data: ProfessionalProfile }>(
      `/api/professionals/${id}`
    );
    return response.data.data;
  },

  // Protected Professional APIs
  async getOwnProfile(): Promise<ProfessionalProfile> {
    const response = await axiosClient.get<{ success: boolean; data: ProfessionalProfile }>(
      '/api/professionals/profile'
    );
    return response.data.data;
  },

  async createProfile(request: CreateProfessionalRequest): Promise<ProfessionalProfile> {
    const response = await axiosClient.post<{ success: boolean; message: string; data: ProfessionalProfile }>(
      '/api/professionals/profile',
      request
    );
    return response.data.data;
  },

  async updateProfile(request: UpdateProfessionalRequest): Promise<ProfessionalProfile> {
    const response = await axiosClient.put<{ success: boolean; message: string; data: ProfessionalProfile }>(
      '/api/professionals/profile',
      request
    );
    return response.data.data;
  },

  // Admin APIs
  async adminVerify(id: string, status: 'VERIFIED' | 'PENDING' | 'REJECTED'): Promise<ProfessionalProfile> {
    const response = await axiosClient.patch<{ success: boolean; message: string; data: ProfessionalProfile }>(
      `/api/professionals/${id}/verify`,
      { status }
    );
    return response.data.data;
  },

  async adminFeature(id: string, isFeatured: boolean): Promise<ProfessionalProfile> {
    const response = await axiosClient.patch<{ success: boolean; message: string; data: ProfessionalProfile }>(
      `/api/professionals/${id}/feature`,
      { isFeatured }
    );
    return response.data.data;
  },

  async adminUpdateStatus(id: string, isAvailable: boolean): Promise<ProfessionalProfile> {
    const response = await axiosClient.patch<{ success: boolean; message: string; data: ProfessionalProfile }>(
      `/api/professionals/${id}/status`,
      { isAvailable }
    );
    return response.data.data;
  },
};
