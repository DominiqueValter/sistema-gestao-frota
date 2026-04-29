using FleetManagement.Domain.Enums;

namespace FleetManagement.Domain.Entities;

public class Maintenance
{
    public Guid Id { get; set; }
    public Guid VehicleId { get; set; }
    public MaintenanceType Type { get; set; }
    public string Description { get; set; } = string.Empty;
    public DateTime Date { get; set; }
    public int Mileage { get; set; }
    public decimal Cost { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public Vehicle Vehicle { get; set; } = null!;
}