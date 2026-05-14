using FleetManagement.Application.DTOs.Maintenance;
using FleetManagement.Application.Services;
using Microsoft.AspNetCore.Mvc;

namespace FleetManagement.API.Controllers;

[ApiController]
[Route("api/vehicles/{vehicleId}/[controller]")]
public class MaintenanceController : ControllerBase
{
    private readonly MaintenanceService _maintenanceService;

    public MaintenanceController(MaintenanceService maintenanceService)
    {
        _maintenanceService = maintenanceService;
    }

    [HttpGet]
    public async Task<IActionResult> GetByVehicle(Guid vehicleId)
    {
        var maintenances = await _maintenanceService.GetByVehicleIdAsync(vehicleId);

        return Ok(maintenances);
    }
    

    [HttpPost]
    public async Task<IActionResult> Create(Guid vehicleId, [FromBody] CreateMaintenanceDto dto)
    {
        try
        {
            var maintenance = await _maintenanceService.CreateAsync(vehicleId, dto);
            return Created(string.Empty, maintenance);
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }
}