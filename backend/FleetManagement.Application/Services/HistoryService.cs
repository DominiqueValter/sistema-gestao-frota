using FleetManagement.Application.Interfaces;
using FleetManagement.Domain.Entities;

namespace FleetManagement.Application.Services;

public class HistoryService
{
    private readonly IHistoryRepository _historyRepository;

    public HistoryService(IHistoryRepository historyRepository)
    {
        _historyRepository = historyRepository;
    }

    public async Task<IEnumerable<History>> GetByVehicleIdAsync(Guid vehicleId)
        => await _historyRepository.GetByVehicleIdAsync(vehicleId);
}