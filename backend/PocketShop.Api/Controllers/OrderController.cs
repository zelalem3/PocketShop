using System.Security.Claims;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PocketShop.Api.Data;
using PocketShop.Api.Models;

namespace PocketShop.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class OrdersController : ControllerBase
{
    private readonly AppDbContext _context;

    public OrdersController(AppDbContext context)
    {
        _context = context;
    }

    // Helper – gets the Firebase UID from the verified token
    private string? GetFirebaseUid() =>
        User.FindFirstValue("firebase_uid") ?? User.FindFirstValue(ClaimTypes.NameIdentifier);

    [HttpGet("me")]
    public async Task<ActionResult<IEnumerable<Order>>> GetMyOrders()
    {
        var uid = GetFirebaseUid();
        if (string.IsNullOrEmpty(uid))
            return Unauthorized(new { message = "Valid Firebase token required" });

        var orders = await _context.Orders
            .Include(o => o.Product)
            .Where(o => o.UserId == uid)
            .OrderByDescending(o => o.CreatedAt)
            .ToListAsync();

        return Ok(orders);
    }

    [HttpPost]
    public async Task<ActionResult<Order>> CreateOrder(Order order)
    {
        var uid = GetFirebaseUid();
        if (string.IsNullOrEmpty(uid))
            return Unauthorized(new { message = "Valid Firebase token required" });

        // Force the order to belong to the authenticated user
        order.UserId = uid;

        if (order.Quantity < 1)
            return BadRequest(new { message = "Quantity must be at least 1" });

        var product = await _context.Products.FindAsync(order.ProductId);
        if (product == null)
            return BadRequest(new { message = "Product not found" });

        if (product.StockQuantity < order.Quantity)
            return BadRequest(new { message = "Insufficient stock" });

        order.TotalPrice = product.Price * order.Quantity;
        order.CreatedAt = DateTime.UtcNow;
        product.StockQuantity -= order.Quantity;

        _context.Orders.Add(order);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetMyOrders), order);
    }
}