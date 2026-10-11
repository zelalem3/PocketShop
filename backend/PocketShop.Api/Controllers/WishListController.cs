using System.Security.Claims;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PocketShop.Api.Data;
using PocketShop.Api.Models;

namespace PocketShop.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class WishListController : ControllerBase
{
    private readonly AppDbContext _context;

    public WishListController(AppDbContext context)
    {
        _context = context;
    }

    private string? GetFirebaseUid() =>
        User.FindFirstValue("firebase_uid") ?? User.FindFirstValue(ClaimTypes.NameIdentifier);

    /// <summary>Get the authenticated user's wishlist</summary>
    [HttpGet("me")]
    public async Task<ActionResult<IEnumerable<Wishlist>>> GetMyWishlist()
    {
        var uid = GetFirebaseUid();
        if (string.IsNullOrEmpty(uid))
            return Unauthorized(new { message = "Valid Firebase token required" });

        var items = await _context.Wishlists
            .Include(w => w.Product)
            .ThenInclude(p => p!.Category)
            .Where(w => w.UserId == uid)
            .OrderByDescending(w => w.CreatedAt)
            .ToListAsync();

        return Ok(items);
    }

    /// <summary>Add a product to the authenticated user's wishlist</summary>
    [HttpPost]
    public async Task<ActionResult<Wishlist>> AddToWishlist([FromBody] Wishlist item)
    {
        var uid = GetFirebaseUid();
        if (string.IsNullOrEmpty(uid))
            return Unauthorized(new { message = "Valid Firebase token required" });

        // Force the authenticated user
        item.UserId = uid;

        var productExists = await _context.Products.AnyAsync(p => p.Id == item.ProductId);
        if (!productExists)
            return BadRequest(new { message = "Product not found" });

        var alreadyExists = await _context.Wishlists
            .AnyAsync(w => w.UserId == uid && w.ProductId == item.ProductId);

        if (alreadyExists)
            return Conflict(new { message = "Product already in wishlist" });

        item.CreatedAt = DateTime.UtcNow;
        _context.Wishlists.Add(item);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetMyWishlist), item);
    }

    /// <summary>Remove an item from the authenticated user's wishlist</summary>
    [HttpDelete("{id}")]
    public async Task<IActionResult> RemoveFromWishlist(int id)
    {
        var uid = GetFirebaseUid();
        if (string.IsNullOrEmpty(uid))
            return Unauthorized(new { message = "Valid Firebase token required" });

        var item = await _context.Wishlists.FindAsync(id);
        if (item == null)
            return NotFound(new { message = "Wishlist item not found" });

        // Only the owner can delete
        if (item.UserId != uid)
            return Forbid();

        _context.Wishlists.Remove(item);
        await _context.SaveChangesAsync();
        return NoContent();
    }

    /// <summary>Remove by product id (convenient for mobile)</summary>
    [HttpDelete("product/{productId}")]
    public async Task<IActionResult> RemoveByProduct(int productId)
    {
        var uid = GetFirebaseUid();
        if (string.IsNullOrEmpty(uid))
            return Unauthorized(new { message = "Valid Firebase token required" });

        var item = await _context.Wishlists
            .FirstOrDefaultAsync(w => w.UserId == uid && w.ProductId == productId);

        if (item == null)
            return NotFound(new { message = "Wishlist item not found" });

        _context.Wishlists.Remove(item);
        await _context.SaveChangesAsync();
        return NoContent();
    }
}