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
    public DbSet<Driver> Drivers { get; set; }   // 🔥 DÜZELTİLDİ
    public DbSet<Order> Orders { get; set; }     // 🔥 DÜZELTİLDİ
    public DbSet<Product> Products { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<Driver>(e =>
        {
            e.HasKey(x => x.Id);

            e.Property(x => x.FullName).IsRequired();
            e.Property(x => x.Phone).IsRequired();
            e.Property(x => x.License).IsRequired();
            e.Property(x => x.Status).IsRequired();

            // 1-1: TruckId unique (TruckId null olabilir)
            e.HasIndex(x => x.TruckId)
             .IsUnique();

            e.HasOne(x => x.Truck)
             .WithOne()
             .HasForeignKey<Driver>(x => x.TruckId)
             .OnDelete(DeleteBehavior.SetNull);
        });
    }
}
