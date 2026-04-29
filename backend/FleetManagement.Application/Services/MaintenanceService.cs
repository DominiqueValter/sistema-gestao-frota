using FleetManagement.Application.DTOs.Maintenance;
using FleetManagement.Application.Interfaces;
using FleetManagement.Domain.Entities;
using FleetManagement.Domain.Enums;

namespace FleetManagement.Application.Services;

public class MaintenanceService
{
    private readonly IMaintenanceRepository _maintenanceRepository;
    private readonly IVehicleRepository _vehicleRepository;
    private readonly IHistoryRepository _historyRepository;

    public MaintenanceService(
        IMaintenanceRepository maintenanceRepository,
        IVehicleRepository vehicleRepository,
        IHistoryRepository historyRepository)
    {
        _maintenanceRepository = maintenanceRepository;
        _vehicleRepository = vehicleRepository;
        _historyRepository = historyRepository;
    }

    public async Task<IEnumerable<Maintenance>> GetByVehicleIdAsync(Guid vehicleId)
        => await _maintenanceRepository.GetByVehicleIdAsync(vehicleId);

    public async Task<Maintenance> CreateAsync(Guid vehicleId, CreateMaintenanceDto dto)
    {
        var vehicle = await _vehicleRepository.GetByIdAsync(vehicleId);
        if (vehicle is null)
            throw new KeyNotFoundException($"Veículo {vehicleId} não encontrado.");

        // Regra: veículo em manutenção não pode receber nova manutenção
        if (vehicle.Status == VehicleStatus.EM_MANUTENCAO)
            throw new InvalidOperationException("Veículo já está em manutenção.");

        // Regra: quilometragem da manutenção não pode ser menor que a atual
        if (dto.Mileage < vehicle.Mileage)
            throw new InvalidOperationException(
                $"Quilometragem da manutenção ({dto.Mileage}) não pode ser menor que a atual ({vehicle.Mileage}).");

        // Regra: status muda para EM_MANUTENCAO
        if (!Enum.TryParse<MaintenanceType>(dto.Type, out var maintenanceType))
            throw new InvalidOperationException($"Tipo de manutenção inválido: {dto.Type}.");

        vehicle.Status = VehicleStatus.EM_MANUTENCAO;
        vehicle.UpdatedAt = DateTime.UtcNow;
        await _vehicleRepository.UpdateAsync(vehicle);

        var maintenance = new Maintenance
        {
            Id = Guid.NewGuid(),
            VehicleId = vehicleId,
            Type = maintenanceType,
            Description = dto.Description,
            Date = dto.Date,
            Mileage = dto.Mileage,
            Cost = dto.Cost
        };

        await _maintenanceRepository.AddAsync(maintenance);

        // Registra no histórico
        await _historyRepository.AddAsync(new History
        {
            Id = Guid.NewGuid(),
            VehicleId = vehicleId,
            Action = "MANUTENCAO",
            Description = $"Manutenção {dto.Type} registrada. Custo: R$ {dto.Cost:F2}. {dto.Description}",
            Date = DateTime.UtcNow
        });

        return maintenance;
    }
}