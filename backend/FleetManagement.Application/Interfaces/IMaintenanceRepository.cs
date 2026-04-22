using FleetManagement.Domain.Entities;

namespace FleetManagement.Application.Interfaces;

public interface IMaintenanceRepository
{
    Task<IEnumerable<Maintenance>> GetByVehicleIdAsync(Guid vehicleId);
    Task AddAsync(Maintenance maintenance);
}