namespace FleetManagement.Domain.Entities;

public class History
{
    public Guid Id { get; set; }
    public Guid VehicleId { get; set; }
    public string Action { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public DateTime Date { get; set; } = DateTime.UtcNow;

    public Vehicle Vehicle { get; set; } = null!;
}