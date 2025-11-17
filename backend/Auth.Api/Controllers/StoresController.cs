
using Microsoft.AspNetCore.Mvc;
using Auth.Infrastructure.Logistics.Context;
using Auth.Domain.Entities;

namespace Auth.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class StoresController : ControllerBase
{
    private readonly LogisticsDbContext _context;

    public StoresController(LogisticsDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public IActionResult GetStores()
    {
        var stores = _context.Stores.ToList();
        return Ok(stores);
    }
}
