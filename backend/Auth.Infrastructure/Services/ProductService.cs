using Auth.Domain.Entities;
using Auth.Infrastructure.Logistics.Context;
using Microsoft.EntityFrameworkCore;

namespace Auth.Infrastructure.Services;

public class ProductService
{
    private readonly LogisticsDbContext _db;

    public ProductService(LogisticsDbContext db)
    {
        _db = db;
    }

    public async Task<IReadOnlyList<Product>> GetAllProductsAsync(string? depotId, string? role)
    {
        var query = _db.Products.AsQueryable();

        if (role == "Depot" && !string.IsNullOrEmpty(depotId))
            query = query.Where(p => p.DepotId == depotId);

        return await query.AsNoTracking().ToListAsync();
    }
}
