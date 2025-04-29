using Microsoft.AspNetCore.Mvc;

namespace JobHuntMate.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class HealthController : ControllerBase
{
    [HttpGet]
    public IActionResult Get() => Ok("JobHuntMate API is running!");
}
