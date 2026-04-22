namespace FleetManagement.Application.DTOs.Vehicle;

public class UpdateVehicleDto
{
    public string Model { get; set; } = string.Empty;
    public string Brand { get; set; } = string.Empty;
    public int Year { get; set; }
    public int Mileage { get; set; }
    public string Status { get; set; } = string.Empty;
}