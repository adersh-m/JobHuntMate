using JobHuntMate.Api.DTOs;
using JobHuntMate.Api.Models;
using JobHuntMate.Api.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

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

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateJob(Guid id, [FromBody] JobDto updatedJob)
        {
            var result = await _jobService.UpdateJobAsync(id, updatedJob);
            if (result == null)
                return NotFound();

            return Ok(result);
        }


        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteJob(Guid id)
        {
            var success = await _jobService.DeleteJobAsync(id);
            if (!success)
                return NotFound(new { message = "Job not found" });

            return NoContent();
        }

        [HttpGet("interviews")]
        public IActionResult GetInterviews()
        {
            return Ok(_jobService.GetInterviews());
        }

        [HttpGet("stats")]
        public IActionResult GetStats()
        {
            var stats = _jobService.GetStats();
            return Ok(stats);
        }

        [HttpGet("activity")]
        public IActionResult GetActivities()
        {
            var activities = _jobService.GetActivity();
            return Ok(activities);
        }
    }
}
