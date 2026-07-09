import { axiosClient } from '../auth/axiosClient';
import type { Booking, CreateBookingRequest, BookingStatus } from '../../types/booking/bookingTypes';

export const bookingApi = {
  // Customer APIs
  async createBooking(request: CreateBookingRequest): Promise<Booking> {
    const response = await axiosClient.post<{ success: boolean; data: Booking }>(
      '/api/bookings',
      request
    );
    return response.data.data;
  },

  async getMyBookings(): Promise<Booking[]> {
    const response = await axiosClient.get<{ success: boolean; data: Booking[] }>(
      '/api/bookings/my'
    );
    return response.data.data;
  },

  async getBookingDetails(id: string): Promise<Booking> {
    const response = await axiosClient.get<{ success: boolean; data: Booking }>(
      `/api/bookings/${id}`
    );
    return response.data.data;
  },

  async cancelBooking(id: string): Promise<Booking> {
    const response = await axiosClient.patch<{ success: boolean; data: Booking }>(
      `/api/bookings/${id}/cancel`
    );
    return response.data.data;
  },

  // Provider APIs
  async getProviderBookings(): Promise<Booking[]> {
    const response = await axiosClient.get<{ success: boolean; data: Booking[] }>(
      '/api/provider/bookings'
    );
    return response.data.data;
  },

  async acceptBooking(id: string): Promise<Booking> {
    const response = await axiosClient.patch<{ success: boolean; data: Booking }>(
      `/api/provider/bookings/${id}/accept`
    );
    return response.data.data;
  },

  async rejectBooking(id: string): Promise<Booking> {
    const response = await axiosClient.patch<{ success: boolean; data: Booking }>(
      `/api/provider/bookings/${id}/reject`
    );
    return response.data.data;
  },

  async startBooking(id: string): Promise<Booking> {
    const response = await axiosClient.patch<{ success: boolean; data: Booking }>(
      `/api/provider/bookings/${id}/start`
    );
    return response.data.data;
  },

  async completeBooking(id: string): Promise<Booking> {
    const response = await axiosClient.patch<{ success: boolean; data: Booking }>(
      `/api/provider/bookings/${id}/complete`
    );
    return response.data.data;
  },

  // Admin APIs
  async adminGetBookings(): Promise<Booking[]> {
    const response = await axiosClient.get<{ success: boolean; data: Booking[] }>(
      '/api/admin/bookings'
    );
    return response.data.data;
  },

  async adminUpdateBookingStatus(id: string, status: BookingStatus): Promise<Booking> {
    const response = await axiosClient.patch<{ success: boolean; data: Booking }>(
      `/api/admin/bookings/${id}`,
      { status }
    );
    return response.data.data;
  },
};
