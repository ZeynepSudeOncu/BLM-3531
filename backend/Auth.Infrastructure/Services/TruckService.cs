using Auth.Application.Services;
using Auth.Application.DTOs;
using Auth.Domain.Entities;
using Auth.Infrastructure.Logistics.Context;
using Microsoft.EntityFrameworkCore;

namespace Auth.Infrastructure.Services;

public class TruckService : ITruckService
{
    private readonly LogisticsDbContext _context;

    public TruckService(LogisticsDbContext context)
    {
        _context = context;
    }

    public async Task<List<Truck>> GetAllTrucksAsync()
    {
        return await _context.Trucks
            .Where(t => t.IsActive)
            .ToListAsync();
    }


    public async Task<Truck> CreateTruckAsync(CreateTruckDto dto)
    {
        var truck = new Truck
        {
            Plate = dto.Plate,
            Model = dto.Model,
            Capacity = dto.Capacity,
            IsActive = true
        };

        _context.Trucks.Add(truck);
        await _context.SaveChangesAsync();

        return truck;
    }

    public async Task<bool> DeactivateTruckAsync(Guid id)
    {
        var truck = await _context.Trucks.FirstOrDefaultAsync(t => t.Id == id);

        if (truck == null)
            return false;

        truck.IsActive = false;
        await _context.SaveChangesAsync();

        return true;
    }


    public async Task<bool> UpdateTruckAsync(Guid id, UpdateTruckDto dto)
{
    var truck = await _context.Trucks.FirstOrDefaultAsync(t => t.Id == id);

    if (truck == null)
        return false;

    truck.Plate = dto.Plate;
    truck.Model = dto.Model;
    truck.Capacity = dto.Capacity;

    await _context.SaveChangesAsync();
    return true;
}


}
