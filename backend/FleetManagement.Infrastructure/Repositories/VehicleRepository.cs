using FleetManagement.Application.Interfaces;
using FleetManagement.Domain.Entities;
using FleetManagement.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace FleetManagement.Infrastructure.Repositories;

public class VehicleRepository : IVehicleRepository
{
    private readonly AppDbContext _context;

    public VehicleRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<Vehicle>> GetAllAsync()
        => await _context.Vehicles.Include(v => v.Maintenances).ToListAsync();

    public async Task<Vehicle?> GetByIdAsync(Guid id)
        => await _context.Vehicles
            .Include(v => v.Maintenances)
            .Include(v => v.Histories)
            .FirstOrDefaultAsync(v => v.Id == id);

    public async Task<bool> LicensePlateExistsAsync(string licensePlate, Guid? excludeId = null)
        => await _context.Vehicles
            .AnyAsync(v => v.LicensePlate == licensePlate && v.Id != excludeId);

    public async Task AddAsync(Vehicle vehicle)
    {
        await _context.Vehicles.AddAsync(vehicle);
        await _context.SaveChangesAsync();
    }

    public async Task UpdateAsync(Vehicle vehicle)
    {
        _context.Vehicles.Update(vehicle);
        await _context.SaveChangesAsync();
    }

    public async Task DeleteAsync(Vehicle vehicle)
    {
        _context.Vehicles.Remove(vehicle);
        await _context.SaveChangesAsync();
    }
}