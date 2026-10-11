using System.Security.Claims;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PocketShop.Api.Data;
using PocketShop.Api.Models;

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

    private string? GetFirebaseUid() =>
        User.FindFirstValue("firebase_uid") ?? User.FindFirstValue(ClaimTypes.NameIdentifier);

    /// <summary>Public – get reviews for a product</summary>
    [HttpGet("product/{productId}")]
    public async Task<ActionResult<IEnumerable<Review>>> GetReviewsByProduct(int productId)
    {
        var reviews = await _context.Reviews
            .Where(r => r.ProductId == productId)
            .OrderByDescending(r => r.CreatedAt)
            .ToListAsync();

        return Ok(reviews);
    }

    /// <summary>Public – average rating</summary>
    [HttpGet("product/{productId}/average")]
    public async Task<ActionResult<object>> GetAverageRating(int productId)
    {
        var query = _context.Reviews.Where(r => r.ProductId == productId);
        var count = await query.CountAsync();

        if (count == 0)
            return Ok(new { average = 0.0, count = 0 });

        var average = await query.AverageAsync(r => r.Rating);
        return Ok(new { average = Math.Round(average, 1), count });
    }

    /// <summary>Create a review – forces the authenticated user</summary>
    [HttpPost]
    public async Task<ActionResult<Review>> CreateReview([FromBody] Review review)
    {
        var uid = GetFirebaseUid();
        if (string.IsNullOrEmpty(uid))
            return Unauthorized(new { message = "Valid Firebase token required" });

        // Force the authenticated user
        review.UserId = uid;

        if (review.Rating < 1 || review.Rating > 5)
            return BadRequest(new { message = "Rating must be between 1 and 5" });

        var productExists = await _context.Products.AnyAsync(p => p.Id == review.ProductId);
        if (!productExists)
            return BadRequest(new { message = "Product not found" });

        var alreadyReviewed = await _context.Reviews
            .AnyAsync(r => r.UserId == uid && r.ProductId == review.ProductId);

        if (alreadyReviewed)
            return Conflict(new { message = "You have already reviewed this product" });

        review.CreatedAt = DateTime.UtcNow;
        _context.Reviews.Add(review);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetReviewsByProduct), new { productId = review.ProductId }, review);
    }

    /// <summary>Delete own review only</summary>
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteReview(int id)
    {
        var uid = GetFirebaseUid();
        if (string.IsNullOrEmpty(uid))
            return Unauthorized(new { message = "Valid Firebase token required" });

        var review = await _context.Reviews.FindAsync(id);
        if (review == null)
            return NotFound(new { message = "Review not found" });

        if (review.UserId != uid)
            return Forbid();

        _context.Reviews.Remove(review);
        await _context.SaveChangesAsync();
        return NoContent();
    }
}