import { axiosClient } from '../auth/axiosClient';
import {
  ServiceCategory,
  CreateCategoryRequest,
  UpdateCategoryRequest,
} from '../../types/category/categoryTypes';
import { ApiResponse } from '../../types/auth/authTypes'; // Wait, let's check if ApiResponse is defined in authTypes or if we should define a generic interface.

// Let's create a generic response structure or map the return data directly.
// The Vercel handlers return:
// - { data: ServiceCategory[] } for GET list
// - { data: ServiceCategory } for GET single
// - { message: string, data: ServiceCategory } for POST/PUT

export const categoryApi = {
  async getCategories(): Promise<ServiceCategory[]> {
    const response = await axiosClient.get<{ data: ServiceCategory[] }>('/api/categories');
    return response.data.data;
  },

  async getCategory(slug: string): Promise<ServiceCategory> {
    const response = await axiosClient.get<{ data: ServiceCategory }>(`/api/categories/${slug}`);
    return response.data.data;
  },

  async createCategory(request: CreateCategoryRequest): Promise<ServiceCategory> {
    const response = await axiosClient.post<{ message: string; data: ServiceCategory }>(
      '/api/categories',
      request
    );
    return response.data.data;
  },

  async updateCategory(id: number, request: UpdateCategoryRequest): Promise<ServiceCategory> {
    const response = await axiosClient.put<{ message: string; data: ServiceCategory }>(
      `/api/categories/${id}`,
      request
    );
    return response.data.data;
  },

  async deleteCategory(id: number): Promise<void> {
    await axiosClient.delete(`/api/categories/${id}`);
  },
};
