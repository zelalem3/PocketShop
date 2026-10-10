using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PocketShop.Api.Models;
using PocketShop.Api.Data;

namespace PocketShop.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class OrderController : ControllerBase
{
    private readonly AppDbContext _context;

    public OrderController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<IActionResult> GetOrders()
    {
        var orders = await _context.Orders
            .Include(o => o.Product)
            .ToListAsync();

        return Ok(orders); 
    }

    [HttpPost]
    public async Task<IActionResult> CreateOrder([FromBody] Order order)
    {
        _context.Orders.Add(order);
        await _context.SaveChangesAsync();

        return Ok(order);
    }
}