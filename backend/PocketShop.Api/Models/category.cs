namespace PocketShop.Api.Models;

public class Category
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;

    // Navigation property: One category can have many products
    public ICollection<Product> Products { get; set; } = new List<Product>();
}