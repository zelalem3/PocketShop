import { apiClient } from "./apiClient";

export interface Order {
    Id: number;
    UserId: string;
    ProductId: number;
    Quantity: number;
    TotalPrice: number;
    CreatedAt: Date;
}

export interface CreateOrder {
    ProductId: number;
    Quantity: number;
    TotalPrice: number;
}

export const OrderApi = { // (Optional: renaming to OrderApi helps avoid naming conflicts with the Order interface)
    async getOrderByUserId(): Promise<Order[]> {
        const response = await apiClient.get<Order[]>(`/api/orders/me`);
        return response.data;
    },
    async createorder(order: CreateOrder): Promise<Order> {
        const response = await apiClient.post<Order>(`/api/Orders`, order); // Added the 's' here!
        return response.data;
    }
}