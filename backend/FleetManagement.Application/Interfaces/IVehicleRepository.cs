using FleetManagement.Domain.Entities;

namespace FleetManagement.Application.Interfaces;

public interface IVehicleRepository
{
    Task<IEnumerable<Vehicle>> GetAllAsync();
    Task<Vehicle?> GetByIdAsync(Guid id);
    Task<bool> LicensePlateExistsAsync(string licensePlate, Guid? excludeId = null);
    Task AddAsync(Vehicle vehicle);
    Task UpdateAsync(Vehicle vehicle);
    Task DeleteAsync(Vehicle vehicle);
}