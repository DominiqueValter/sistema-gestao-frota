using FleetManagement.Application.Services;
using Microsoft.AspNetCore.Mvc;

namespace FleetManagement.API.Controllers;

[ApiController]
[Route("api/vehicles/{vehicleId}/[controller]")]
public class HistoryController : ControllerBase
{
    private readonly HistoryService _historyService;

    public HistoryController(HistoryService historyService)
    {
        _historyService = historyService;
    }

    [HttpGet]
    public async Task<IActionResult> GetByVehicle(Guid vehicleId)
    {
        var history = await _historyService.GetByVehicleIdAsync(vehicleId);
        return Ok(history);
    }
}