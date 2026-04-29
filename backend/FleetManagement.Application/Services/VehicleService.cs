using FleetManagement.Application.DTOs.Vehicle;
using FleetManagement.Application.Interfaces;
using FleetManagement.Domain.Entities;
using FleetManagement.Domain.Enums;

namespace FleetManagement.Application.Services;

public class VehicleService
{
    private readonly IVehicleRepository _vehicleRepository;
    private readonly IHistoryRepository _historyRepository;

    public VehicleService(IVehicleRepository vehicleRepository, IHistoryRepository historyRepository)
    {
        _vehicleRepository = vehicleRepository;
        _historyRepository = historyRepository;
    }

    public async Task<IEnumerable<Vehicle>> GetAllAsync()
        => await _vehicleRepository.GetAllAsync();

    public async Task<Vehicle> GetByIdAsync(Guid id)
    {
        var vehicle = await _vehicleRepository.GetByIdAsync(id);
        if (vehicle is null)
            throw new KeyNotFoundException($"Veículo {id} não encontrado.");
        return vehicle;
    }

    public async Task<Vehicle> CreateAsync(CreateVehicleDto dto)
    {
        // Regra: placa única
        if (await _vehicleRepository.LicensePlateExistsAsync(dto.LicensePlate))
            throw new InvalidOperationException($"Já existe um veículo com a placa {dto.LicensePlate}.");

        var vehicle = new Vehicle
        {
            Id = Guid.NewGuid(),
            LicensePlate = dto.LicensePlate.ToUpper().Trim(),
            Model = dto.Model,
            Brand = dto.Brand,
            Year = dto.Year,
            Mileage = dto.Mileage,
            Status = VehicleStatus.ATIVO
        };

        await _vehicleRepository.AddAsync(vehicle);

        // Registra no histórico
        await _historyRepository.AddAsync(new History
        {
            Id = Guid.NewGuid(),
            VehicleId = vehicle.Id,
            Action = "CADASTRO",
            Description = $"Veículo {vehicle.Brand} {vehicle.Model} ({vehicle.LicensePlate}) cadastrado.",
            Date = DateTime.UtcNow
        });

        return vehicle;
    }

    public async Task<Vehicle> UpdateAsync(Guid id, UpdateVehicleDto dto)
    {
        var vehicle = await GetByIdAsync(id);

        // Regra: quilometragem não pode diminuir
        if (dto.Mileage < vehicle.Mileage)
            throw new InvalidOperationException(
                $"Quilometragem não pode diminuir. Atual: {vehicle.Mileage}, Informada: {dto.Mileage}.");

        // Regra: status válido
        if (!Enum.TryParse<VehicleStatus>(dto.Status, out var newStatus))
            throw new InvalidOperationException($"Status inválido: {dto.Status}.");

        var oldStatus = vehicle.Status;
        var oldMileage = vehicle.Mileage;

        vehicle.Model = dto.Model;
        vehicle.Brand = dto.Brand;
        vehicle.Year = dto.Year;
        vehicle.Mileage = dto.Mileage;
        vehicle.Status = newStatus;
        vehicle.UpdatedAt = DateTime.UtcNow;

        await _vehicleRepository.UpdateAsync(vehicle);

        // Registra mudança de status no histórico
        if (oldStatus != newStatus)
            await _historyRepository.AddAsync(new History
            {
                Id = Guid.NewGuid(),
                VehicleId = vehicle.Id,
                Action = "MUDANCA_STATUS",
                Description = $"Status alterado de {oldStatus} para {newStatus}.",
                Date = DateTime.UtcNow
            });

        // Registra atualização de quilometragem no histórico
        if (oldMileage != dto.Mileage)
            await _historyRepository.AddAsync(new History
            {
                Id = Guid.NewGuid(),
                VehicleId = vehicle.Id,
                Action = "ATUALIZACAO_KM",
                Description = $"Quilometragem atualizada de {oldMileage} para {dto.Mileage} km.",
                Date = DateTime.UtcNow
            });

        return vehicle;
    }

    public async Task DeleteAsync(Guid id)
    {
        var vehicle = await GetByIdAsync(id);
        await _vehicleRepository.DeleteAsync(vehicle);
    }
}