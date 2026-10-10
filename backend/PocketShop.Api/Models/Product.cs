namespace PocketShop.Api.Models;

public class product {
    public int Id { get; set;}
    public string Name { get; set;} = string empty;
    public string Description { get; set;} = string empty;
    public decimal Price { get; set;} 
    public int StockQuantity { get; set;}
    public string ImageUrl { get; set;} = string empty;
    public DateTime CreatedAt { get; set;} = DateTime.UtcNow;
}