using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PocketShop.Api.Data;
using PocketShop.Api.Models;

namespace PocketShop.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ProductsController : ControllerBase
{
  
    private readonly AppDbContext _context;

    public ProductsController(AppDbContext context)
    {
        _context = context;
    }

    
    [HttpGet]
    public async Task<IActionResult> GetProducts()
    {
        var products = await _context.Products
            .Include(p => p.Category)
            .ToListAsync();

        return Ok(products);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetProduct(int id)
    {
        var product = await _context.Products
            .Include(p => p.Category)
            .FirstOrDefaultAsync(p => p.Id == id);

        if (product == null)
        {
            return NotFound(new { message = "Product not found" });
        }

        return Ok(product);
    }


    [HttpPost]
    public async Task<IActionResult> CreateProduct([FromBody] Product product)
    {
     
        _context.Products.Add(product);
        
      
        await _context.SaveChangesAsync();

       
        return CreatedAtAction(nameof(GetProduct), new { id = product.Id }, product);
    }
}