using Auth.Application.DTOs;
using Auth.Infrastructure.Logistics.Context;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using Auth.Domain.Entities;

namespace Auth.Api.Controllers;

[ApiController]
[Route("api/store-requests")]
[Authorize(Roles = "Store")]
public class StoreRequestsController : ControllerBase
{
    private readonly LogisticsDbContext _context;

    public StoreRequestsController(LogisticsDbContext context)
    {
        _context = context;
    }

    [HttpPost]
    public async Task<IActionResult> CreateRequest([FromBody] CreateStoreRequestDto dto)
    {
        var storeIdStr = User.FindFirstValue("StoreId");
        if (string.IsNullOrWhiteSpace(storeIdStr))
            return Unauthorized("storeId claim yok");

        var storeId = Guid.Parse(storeIdStr);

        var store = await _context.Stores.FirstOrDefaultAsync(s => s.Id == storeId);
        if (store == null)
            return BadRequest("Store bulunamadı.");

        if (store.DepotId == Guid.Empty)
            return BadRequest("Store bir depoya bağlı değil.");

        var productExists = await _context.Products.AnyAsync(p => p.Id == dto.ProductId);
        if (!productExists)
            return BadRequest("Ürün bulunamadı.");

        var request = new StoreRequest
        {
            Id = Guid.NewGuid(),
            StoreId = storeId,
            DepotId = store.DepotId,
            ProductId = dto.ProductId,
            RequestedQuantity = dto.RequestedQuantity,
            Status = "Pending",
            CreatedAt = DateTime.UtcNow
        };

        _context.StoreRequests.Add(request);
        await _context.SaveChangesAsync();

        return Ok(new { message = "Talep oluşturuldu." });
    }


    // [HttpPost]
    // public async Task<IActionResult> CreateRequest([FromBody] CreateStoreRequestDto dto)
    // {
    //     var claims = User.Claims.Select(c => new { c.Type, c.Value }).ToList();
    //     return Ok(claims);
    // }


}
