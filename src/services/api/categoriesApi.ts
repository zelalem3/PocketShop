import { apiClient } from "./apiClient";

export interface Category{
    Id : number,
    Name: string,

}

export const category = {
    async getCategories(){
        const response = await apiClient.get<Category[]>('/api/categories');
        return response.data;
    },

}