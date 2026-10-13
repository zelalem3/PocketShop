import { apiClient } from "./apiClient";


export interface WishList{
    Id: number,
    UserId: string,
    ProductId: number,
    CreatedAt: Date
}

export interface CreateWishList{
    ProductId: number,

}




export const wishlist = {
    async getWishListByUserId (){
        const response = await apiClient.get<WishList[]>(`/api/WishList/me`);
        return response.data;
    },

    async addToWishList (data: CreateWishList) {
        const response = await apiClient.post(`/api/WishList`,data)
        return response.data
    },

    async removeWishListByProductId (productId : number) {
        const response = await apiClient.delete(`/api/WishList/${productId}`);
        return response.data;
    }
}