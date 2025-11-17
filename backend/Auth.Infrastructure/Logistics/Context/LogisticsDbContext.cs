using Auth.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Auth.Infrastructure.Logistics.Context;


namespace Auth.Infrastructure.Logistics.Context;

public class LogisticsDbContext : DbContext
{
    public LogisticsDbContext(DbContextOptions<LogisticsDbContext> options)
        : base(options)
    {
    }

    public DbSet<Depot> Depots { get; set; }
    public DbSet<Store> Stores { get; set; }
    public DbSet<Truck> Trucks { get; set; }
    public DbSet<Driver> Drivers => Set<Driver>();
    public DbSet<Order> Orders => Set<Order>();


 public DbSet<Product> Products { get; set; }
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.ApplyConfigurationsFromAssembly(typeof(LogisticsDbContext).Assembly);
    }
}
