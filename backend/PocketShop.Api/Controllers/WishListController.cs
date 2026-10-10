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

    [HttpGet]
    public async Task<IActionResult> GetWishList()
    {
        var wishlist = await _context.Wishlists
            .Include(w => w.Product)
            .ToListAsync();

        return Ok(wishlist);
    }

    [HttpPost]
    public async Task<IActionResult> CreateWishList([FromBody] Wishlist wishlist)
    {
        _context.Wishlists.Add(wishlist);
        await _context.SaveChangesAsync();

        return Ok(wishlist);
    }
}