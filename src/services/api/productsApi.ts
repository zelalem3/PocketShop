
import {apiClient} from './apiClient';

export interface Product {
  id: number;
  name: string;
  description?: string;
  price: number;
  imageUrl?: string;
  categoryId?: number;
  isActive?: boolean;
}

export interface GetProductsParams {
  search?: string;
  categoryId?: number;
  page?: number;
  pageSize?: number;
}

export const productsApi = {
  async getAll(params?: GetProductsParams): Promise<Product[]> {
    const response = await apiClient.get<Product[]>('/api/Products', {
      params,
    });

    return response.data;
  },

  async getById(id: number): Promise<Product> {
    const response = await apiClient.get<Product>(`/api/Products/${id}`);

    return response.data;
  },
};
