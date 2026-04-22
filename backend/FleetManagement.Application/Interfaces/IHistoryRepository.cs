using FleetManagement.Domain.Entities;

namespace FleetManagement.Application.Interfaces;

public interface IHistoryRepository
{
    Task<IEnumerable<History>> GetByVehicleIdAsync(Guid vehicleId);
    Task AddAsync(History history);
}