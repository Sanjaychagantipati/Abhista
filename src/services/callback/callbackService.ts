import { axiosClient } from '../auth/axiosClient';
import type {
  CallbackRequest,
  CreateCallbackRequest,
  CallbackStatus,
  CallbackAnalytics,
} from '../../types/callback/callbackTypes';

export const callbackApi = {
  // Public APIs
  async createCallback(request: CreateCallbackRequest): Promise<CallbackRequest> {
    const response = await axiosClient.post<{ success: boolean; data: CallbackRequest }>(
      '/api/callbacks',
      request
    );
    return response.data.data;
  },

  async trackCallbackStatus(referenceNumber: string): Promise<CallbackRequest> {
    const response = await axiosClient.get<{ success: boolean; data: CallbackRequest }>(
      `/api/callbacks/status?referenceNumber=${referenceNumber}`
    );
    return response.data.data;
  },

  // Admin APIs
  async adminListCallbacks(): Promise<CallbackRequest[]> {
    const response = await axiosClient.get<{ success: boolean; data: CallbackRequest[] }>(
      '/api/admin/callbacks'
    );
    return response.data.data;
  },

  async adminGetCallbackDetail(id: string): Promise<CallbackRequest> {
    const response = await axiosClient.get<{ success: boolean; data: CallbackRequest }>(
      `/api/admin/callbacks/${id}`
    );
    return response.data.data;
  },

  async adminAssignCallback(
    id: string,
    assignedProviderId?: string | null,
    assignedAdminId?: string | null
  ): Promise<CallbackRequest> {
    const response = await axiosClient.patch<{ success: boolean; data: CallbackRequest }>(
      `/api/admin/callbacks/${id}/assign`,
      { assignedProviderId, assignedAdminId }
    );
    return response.data.data;
  },

  async adminUpdateStatus(id: string, status: CallbackStatus): Promise<CallbackRequest> {
    const response = await axiosClient.patch<{ success: boolean; data: CallbackRequest }>(
      `/api/admin/callbacks/${id}/status`,
      { status }
    );
    return response.data.data;
  },

  async adminAddNotes(id: string, notes: string): Promise<CallbackRequest> {
    const response = await axiosClient.patch<{ success: boolean; data: CallbackRequest }>(
      `/api/admin/callbacks/${id}/notes`,
      { notes }
    );
    return response.data.data;
  },

  async adminGetAnalytics(): Promise<CallbackAnalytics> {
    const response = await axiosClient.get<{ success: boolean; data: CallbackAnalytics }>(
      '/api/admin/callbacks/analytics'
    );
    return response.data.data;
  },

  // Provider APIs
  async providerListCallbacks(): Promise<CallbackRequest[]> {
    const response = await axiosClient.get<{ success: boolean; data: CallbackRequest[] }>(
      '/api/provider/callbacks'
    );
    return response.data.data;
  },

  async providerMarkContacted(id: string): Promise<CallbackRequest> {
    const response = await axiosClient.patch<{ success: boolean; data: CallbackRequest }>(
      `/api/provider/callbacks/${id}/contacted`
    );
    return response.data.data;
  },

  async providerConvertConsultation(id: string): Promise<CallbackRequest> {
    const response = await axiosClient.patch<{ success: boolean; data: CallbackRequest }>(
      `/api/provider/callbacks/${id}/consultation-booked`
    );
    return response.data.data;
  },

  async providerConvertService(id: string): Promise<CallbackRequest> {
    const response = await axiosClient.patch<{ success: boolean; data: CallbackRequest }>(
      `/api/provider/callbacks/${id}/service-booked`
    );
    return response.data.data;
  },
};
