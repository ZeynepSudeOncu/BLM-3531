using Auth.Infrastructure.Logistics.Context;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace Auth.Api.Controllers;

[ApiController]
[Route("api/driver")]
[Authorize(Roles = "Driver")]
public class DriverProfileController : ControllerBase
{
    private readonly LogisticsDbContext _context;

    public DriverProfileController(LogisticsDbContext context)
    {
        _context = context;
    }

    private Guid GetDriverId()
    {
        var driverIdStr =
            User.FindFirstValue("DriverId") ??
            User.FindFirstValue("driverId");

        if (string.IsNullOrWhiteSpace(driverIdStr))
            throw new UnauthorizedAccessException("DriverId claim bulunamadı.");

        return Guid.Parse(driverIdStr);
    }

    // =====================================================
    // GET: api/driver/me   (Driver Dashboard için)
    // =====================================================
    [HttpGet("me")]
    public async Task<IActionResult> GetMe()
    {
        var driverId = GetDriverId();

        var driver = await _context.Drivers
            .Include(d => d.Truck)
            .AsNoTracking()
            .FirstOrDefaultAsync(d => d.Id == driverId);

        if (driver == null)
            return NotFound();

        return Ok(new
        {
            driverName = driver.FullName,
            truckPlate = driver.Truck?.Plate,
            truckStatus = driver.Status
        });
    }
}
