using Auth.Application.Services;
using Microsoft.AspNetCore.Mvc;
using Auth.Infrastructure.Logistics.Context;
using Auth.Domain.Entities;

namespace Auth.Api.Controllers;


[ApiController]
[Route("api/[controller]")]
public class TrucksController : ControllerBase
{
    private readonly ITruckService _truckService;

    public TrucksController(ITruckService truckService)
    {
        _truckService = truckService;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var trucks = await _truckService.GetAllTrucksAsync();
        return Ok(trucks);
    }
}
