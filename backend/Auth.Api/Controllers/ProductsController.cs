using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
using Auth.Infrastructure.Logistics.Context;
using Microsoft.EntityFrameworkCore;

namespace Auth.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ProductsController : ControllerBase
{
    private readonly LogisticsDbContext _db;

    public ProductsController(LogisticsDbContext db)
    {
        _db = db;
    }

    [Authorize]
    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var role = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Role)?.Value;
        var depotId = User.Claims.FirstOrDefault(c => c.Type == "DepotId")?.Value;

        var query = _db.Products.AsQueryable();

        if (role == "Depot" && !string.IsNullOrEmpty(depotId))
            query = query.Where(p => p.DepotId == depotId);

        var products = await query.AsNoTracking().ToListAsync();
        return Ok(products);
    }
}
