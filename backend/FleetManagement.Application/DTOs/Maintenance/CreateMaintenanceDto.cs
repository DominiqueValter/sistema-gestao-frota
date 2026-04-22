namespace FleetManagement.Application.DTOs.Maintenance;

public class CreateMaintenanceDto
{
    public string Type { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public DateTime Date { get; set; }
    public int Mileage { get; set; }
    public decimal Cost { get; set; }
}