using JobHuntMate.Api.DTOs;
using JobHuntMate.Api.Services;
using Microsoft.AspNetCore.Mvc;

namespace JobHuntMate.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class JobsController : ControllerBase
    {
        private readonly IJobService _jobService;

        public JobsController(IJobService jobService)
        {
            _jobService = jobService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllJobs()
        {
            var jobs = await _jobService.GetAllJobsAsync();
            return Ok(jobs);
        }

        [HttpPost]
        public async Task<IActionResult> CreateJob([FromBody] JobDto dto)
        {
            var job = await _jobService.CreateJobAsync(dto);
            return CreatedAtAction(nameof(GetAllJobs), new { id = job.Id }, job);
        }
    }
}
