using Auth.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Auth.Infrastructure.Logistics.Configurations;

public class DriverConfiguration : IEntityTypeConfiguration<Driver>
{
    public void Configure(EntityTypeBuilder<Driver> builder)
    {
        builder.ToTable("Drivers");

        builder.HasKey(x => x.Id);

        builder.Property(x => x.FullName)
            .IsRequired();

        builder.Property(x => x.Phone)
            .IsRequired();

        builder.Property(x => x.License)
            .IsRequired();

        builder.Property(x => x.Status)
            .IsRequired();

        // 🔥 DÜZELTİLEN SATIR
        builder.Property(x => x.AssignedTruckId)
            .HasColumnType("uuid")
            .IsRequired(false);
    }
}
