using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PocketShop.Api.Models;
using PocketShop.Api.Data;

namespace PocketShop.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ReviewController : ControllerBase
{
    private readonly AppDbContext _context;
    
    public ReviewController(AppDbContext context)
    {
        _context = context;
    }

   
    [HttpGet("product/{productId}")]
    public async Task<IActionResult> GetReviewsByProduct(int productId)
    {
        var reviews = await _context.Reviews
            .Where(r => r.ProductId == productId)
            .ToListAsync();

        if (reviews == null || !reviews.Any())
        {
            return NotFound(new { message = "No reviews found for this product" });
        }

        return Ok(reviews);
    }

    [HttpPost]
    public async Task<IActionResult> CreateReview([FromBody] Review review)
    {
        _context.Reviews.Add(review);
        await _context.SaveChangesAsync();
        
        return Ok(review);
    }
}