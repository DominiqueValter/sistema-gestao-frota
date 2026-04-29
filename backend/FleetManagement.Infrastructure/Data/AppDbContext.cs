using FleetManagement.Domain.Entities;
using FleetManagement.Domain.Enums;
using Microsoft.EntityFrameworkCore;

namespace FleetManagement.Infrastructure.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<Vehicle> Vehicles { get; set; }
        public DbSet<Maintenance> Maintenances { get; set; }
        public DbSet<History> Histories { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {

        // Vehicle
        modelBuilder.Entity<Vehicle>(entity =>
        {
            entity.HasKey(v => v.Id);
            entity.Property(v => v.LicensePlate).IsRequired().HasMaxLength(10);
            entity.HasIndex(v => v.LicensePlate).IsUnique(); // placa única
            entity.Property(v => v.Model).IsRequired().HasMaxLength(100);
            entity.Property(v => v.Brand).IsRequired().HasMaxLength(100);
            entity.Property(v => v.Status)
                  .HasConversion<string>(); // salva como texto no banco
        });

        // Maintenance
        modelBuilder.Entity<Maintenance>(entity =>
        {
            entity.HasKey(m => m.Id);
            entity.Property(m => m.Description).IsRequired().HasMaxLength(500);
            entity.Property(m => m.Cost).HasPrecision(10, 2);
            entity.Property(m => m.Type)
                  .HasConversion<string>();
            entity.HasOne(m => m.Vehicle)
                  .WithMany(v => v.Maintenances)
                  .HasForeignKey(m => m.VehicleId)
                  .OnDelete(DeleteBehavior.Cascade);
        });

        // History
        modelBuilder.Entity<History>(entity =>
        {
            entity.HasKey(h => h.Id);
            entity.Property(h => h.Action).IsRequired().HasMaxLength(100);
            entity.Property(h => h.Description).IsRequired().HasMaxLength(500);
            entity.HasOne(h => h.Vehicle)
                  .WithMany(v => v.Histories)
                  .HasForeignKey(h => h.VehicleId)
                  .OnDelete(DeleteBehavior.Cascade);
        });
    }
}