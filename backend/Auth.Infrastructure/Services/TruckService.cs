using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Auth.Application.Services;
using Auth.Domain.Entities;
using Auth.Infrastructure.Logistics.Context;

namespace Auth.Infrastructure.Services;

public class TruckService : ITruckService
{
    private readonly LogisticsDbContext _db;

    public TruckService(LogisticsDbContext db)
    {
        _db = db;
    }

    public async Task<IReadOnlyList<Truck>> GetAllTrucksAsync()
    {
        return await _db.Trucks.AsNoTracking().ToListAsync();
        // IReadOnlyList<Truck> demo = new List<Truck>
        // {
        //     new Truck { Id = "K001", Plate = "06 ABC 123", Model = "Actros", Status = "Müsait", Capacity = 20 },
        //     new Truck { Id = "K002", Plate = "06 XYZ 456", Model = "FH", Status = "Yolda", Capacity = 18 }
        // };

        // return await Task.FromResult(demo);
    }
}
