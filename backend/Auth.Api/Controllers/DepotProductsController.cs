using Auth.Application.DTOs.DepotProducts;
using Auth.Infrastructure.Logistics.Context;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace Auth.Api.Controllers;

[ApiController]
[Route("api/depot-products")]
[Authorize(Roles = "Depot")]
public class DepotProductsController : ControllerBase
{
    private readonly LogisticsDbContext _context;

    public DepotProductsController(LogisticsDbContext context)
    {
        _context = context;
    }

    private Guid GetDepotId()
    {
        var depotIdStr =
            User.FindFirstValue("depotId") ??
            User.FindFirstValue("DepotId");

        if (string.IsNullOrEmpty(depotIdStr))
            throw new UnauthorizedAccessException("DepotId claim bulunamadı.");

        return Guid.Parse(depotIdStr);
    }

    // GET: api/depot-products/my
    [HttpGet("my")]
    public async Task<IActionResult> GetMyDepotProducts()
    {
        var depotId = GetDepotId();

        var products = await _context.DepotProducts
            .Where(dp => dp.DepotId == depotId)
            .Include(dp => dp.Product)
            .Select(dp => new DepotProductResponse
            {
                Id = dp.Id,
                ProductId = dp.ProductId,
                Name = dp.Product.Name,
                Code = dp.Product.Code,
                Quantity = dp.Quantity
            })
            .OrderBy(p => p.Code)
            .ToListAsync();

        return Ok(products);
    }
}
