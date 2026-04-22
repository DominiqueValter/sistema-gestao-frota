namespace FleetManagement.Application.DTOs.Vehicle;

public class CreateVehicleDto
{
    public string LicensePlate { get; set; } = string.Empty;
    public string Model { get; set; } = string.Empty;
    public string Brand { get; set; } = string.Empty;
    public int Year { get; set; }
    public int Mileage { get; set; }
}