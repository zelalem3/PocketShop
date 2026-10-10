namespace PocketShop.Api.Models;

public class Review
{
    public int Id { get; set; }

    // Firebase User ID (stored as a string)
    public string UserId { get; set; } = string.Empty;

    // Foreign Key linking to the Product
    public int ProductId { get; set; }
    public Product? Product { get; set; }

    public string Comment { get; set; } = string.Empty;
    public int Rating { get; set; } // e.g., 1 to 5 stars

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}