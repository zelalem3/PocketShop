namespace PocketShop.Api.Models;

public class Wishlist
{
    public int Id { get; set; }
    
 
    public int ProductId { get; set; }
    public Product? Product { get; set; }

  
    public string UserId { get; set; } = string.Empty;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}