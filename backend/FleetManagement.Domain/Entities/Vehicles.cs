using FleetManagement.Domain.Enums;

namespace FleetManagement.Domain.Entities
{
    public class Vehicles
    {
        public Guid Id { get; set; }
        public string LicensePlate { get; set; } = string.Empty;
        public string Model { get; set; } = string.Empty;
        public string Brand { get; set; } = string.Empty;
        public int Year { get; set; }
        public int Mileage { get; set; }
        public VehicleStatus Status { get; set; } = VehicleStatus.ATIVO;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

        public ICollection<Maintenance> Maintenances { get; set; } = new List<Maintenance>();
        public ICollection<History> Histories { get; set; } = new List<History>();
    }
}