using FleetManagement.Application.Interfaces;
using FleetManagement.Domain.Entities;
using FleetManagement.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace FleetManagement.Infrastructure.Repositories;

public class HistoryRepository : IHistoryRepository
{
    private readonly AppDbContext _context;

    public HistoryRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<History>> GetByVehicleIdAsync(Guid vehicleId)
        => await _context.Histories
            .Where(h => h.VehicleId == vehicleId)
            .OrderByDescending(h => h.Date)
            .ToListAsync();

    public async Task AddAsync(History history)
    {
        await _context.Histories.AddAsync(history);
        await _context.SaveChangesAsync();
    }
}