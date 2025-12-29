using Auth.Application.DTOs;
using Auth.Domain.Entities;
using Auth.Infrastructure.Logistics.Context;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace Auth.Api.Controllers;

[ApiController]
[Route("api/depot-requests")]
[Authorize(Roles = "Depot")]
public class DepotRequestsController : ControllerBase
{
    private readonly LogisticsDbContext _context;

    public DepotRequestsController(LogisticsDbContext context)
    {
        _context = context;
    }

    private Guid GetDepotId()
    {
        var depotIdStr =
            User.FindFirstValue("DepotId") ??
            User.FindFirstValue("depotId");

        if (string.IsNullOrWhiteSpace(depotIdStr))
            throw new UnauthorizedAccessException("DepotId claim bulunamadı.");

        return Guid.Parse(depotIdStr);
    }

    // GET: api/depot-requests/my?status=Pending
    [HttpGet("my")]
    public async Task<IActionResult> GetMyDepotRequests([FromQuery] string? status = "Pending")
    {
        var depotId = GetDepotId();

        var q =
            from r in _context.StoreRequests.AsNoTracking()
            join s in _context.Stores.AsNoTracking() on r.StoreId equals s.Id
            join p in _context.Products.AsNoTracking() on r.ProductId equals p.Id
            where r.DepotId == depotId
            select new DepotStoreRequestListItem
            {
                Id = r.Id,
                StoreId = r.StoreId,
                StoreName = s.Name,
                ProductId = r.ProductId,
                ProductName = p.Name,
                ProductCode = p.Code,
                RequestedQuantity = r.RequestedQuantity,
                Status = r.Status,
                CreatedAt = r.CreatedAt
            };

        if (!string.IsNullOrWhiteSpace(status))
            q = q.Where(x => x.Status == status);

        var list = await q
            .OrderByDescending(x => x.CreatedAt)
            .ToListAsync();

        return Ok(list);
    }

   [HttpPatch("{id:guid}/approve")]
public async Task<IActionResult> Approve(Guid id, [FromBody] AssignTruckRequest req)
{
    if (req.TruckId == null)
        return BadRequest("TruckId zorunlu.");

    var r = await _context.StoreRequests.FirstOrDefaultAsync(x => x.Id == id);
    if (r == null) return NotFound();

    if (r.Status != "Pending")
        return BadRequest("Sadece Pending istek onaylanır.");

    var depotUserIdStr =
        User.FindFirstValue(ClaimTypes.NameIdentifier) ??
        User.FindFirstValue("sub");

    if (string.IsNullOrEmpty(depotUserIdStr))
        return Unauthorized();

    r.Status = "Approved";
    r.TruckId = req.TruckId;
    r.ApprovedByDepotUserId = Guid.Parse(depotUserIdStr);

    await _context.SaveChangesAsync();
    return Ok(new { message = "Onaylandı, kamyon atandı." });
}



[HttpPatch("{id:guid}/reject")]
public async Task<IActionResult> Reject(Guid id)
{
    var r = await _context.StoreRequests.FirstOrDefaultAsync(x => x.Id == id);
    if (r == null) return NotFound();

    if (r.Status != "Pending") return BadRequest("Sadece Pending istek reddedilir.");

    r.Status = "Rejected";
    await _context.SaveChangesAsync();
    return Ok(new { message = "Reddedildi." });
}

}
