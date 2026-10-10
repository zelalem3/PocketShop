namespace PocketShop.Api.Models;

public categories {
    public int Id {get; set;}

    public string type{ get; set;}
    public ICollection<Product> Products { get; set; } = new List<Product>();
}