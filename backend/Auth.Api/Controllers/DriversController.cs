using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

using Auth.Infrastructure.Logistics.Context;
using Auth.Domain.Entities;

namespace Auth.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class DriversController : ControllerBase
{
    private readonly LogisticsDbContext _context;

    public DriversController(LogisticsDbContext context)
    {
        _context = context;
    }

    // GET: api/drivers
    [HttpGet]
    public async Task<IActionResult> GetDrivers()
    {
        var drivers = await _context.Drivers.ToListAsync();
        return Ok(drivers);
    }

    // GET: api/drivers/{id}
    [HttpGet("{id}")]
    public async Task<IActionResult> GetDriverById(string id)
    {
        var driver = await _context.Drivers.FindAsync(id);

        if (driver == null)
            return NotFound();

        return Ok(driver);
    }

    // PUT: api/drivers/{id}/assign-truck
    [HttpPut("{id}/assign-truck")]
    public async Task<IActionResult> AssignTruck(
        string id,
        [FromBody] AssignTruckRequest request
    )
    {
        var driver = await _context.Drivers.FindAsync(id);

        if (driver == null)
            return NotFound("Sürücü bulunamadı");

        driver.AssignedTruckId = request.TruckId;

        await _context.SaveChangesAsync();

        return Ok();
    }
}
