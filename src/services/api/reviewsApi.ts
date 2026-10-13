import { apiClient } from "./apiClient";

export interface Review {
    id: number;
    userId: string;      // Firebase UID is a string in C#
    productId: number;
    comment: string;
    rating: number;
    createdAt: string;   // Date strings are safest from JSON APIs
}

export interface CreateReviewDto {
    productId: number;
    comment: string;
    rating: number;
}

export const ReviewApi = {
    // Get reviews for a specific product
    async getReviewsByProduct(productId: number): Promise<Review[]> {
        const response = await apiClient.get<Review[]>(`/api/Review/product/${productId}`);
        return response.data;
    },

    // Create a new review
    async createReview(data: CreateReviewDto): Promise<Review> {
        const response = await apiClient.post<Review>('/api/Review', data);
        return response.data;
    },

    // Delete a review by its Review ID (matches [HttpDelete("{id}")] in C#)
    async deleteReview(reviewId: number): Promise<void> {
        await apiClient.delete(`/api/Review/${reviewId}`);
    }
};