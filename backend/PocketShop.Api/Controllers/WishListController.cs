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

    // 1. Accept AppDbContext in the constructor so Dependency Injection can pass it
    public WishListController(AppDbContext context)
    {
        _context = context;
    }

    // 2. Add [HttpGet] attribute and await the async call
    [HttpGet]
    public async Task<IActionResult> GetWishList()
    {
        var wishlist = await _context.WishLists
            .Include(w => w.Product)
            .ToListAsync();

        return Ok(wishlist);
    }

    // 3. Add [HttpPost] attribute and proper formatting
    [HttpPost]
    public async Task<IActionResult> CreateWishList([FromBody] WishList wishlist)
    {
        _context.WishLists.Add(wishlist);
        await _context.SaveChangesAsync();
        
        return Ok(wishlist);
    }
}