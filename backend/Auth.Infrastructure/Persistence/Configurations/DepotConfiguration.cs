using Auth.Domain.Entities; 
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Auth.Infrastructure.Persistence.Configurations;

public class DepotConfiguration : IEntityTypeConfiguration<Depot>
{
    public void Configure(EntityTypeBuilder<Depot> builder)
    {
        builder.ToTable("Depots");

        builder.HasKey(d => d.Id);

        builder.Property(d => d.Id)
            .HasColumnType("varchar(10)")
            .IsRequired();

        builder.Property(d => d.Name)
            .HasMaxLength(100)
            .IsRequired();

        builder.Property(d => d.Address)
            .HasMaxLength(200)
            .IsRequired();

        builder.Property(d => d.Capacity)
            .IsRequired();

        builder.Property(d => d.IsActive)
            .HasDefaultValue(true);
    }
}
