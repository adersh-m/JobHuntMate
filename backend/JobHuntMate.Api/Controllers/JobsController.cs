using JobHuntMate.Api.DTOs;
using JobHuntMate.Api.Models;
using JobHuntMate.Api.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace JobHuntMate.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class JobsController : BaseController
    {
        private readonly IJobService _jobService;

        public JobsController(IJobService jobService)
        {
            _jobService = jobService;
        }

        [HttpGet()]
        public async Task<IActionResult> GetAllJobs()
        {
            var userId = GetUserIdFromToken(); // Use the common method
            var jobs = await _jobService.GetAllJobsAsync(userId);
            return Ok(jobs);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetJobyId(Guid id)
        {
            var userId = GetUserIdFromToken(); // Use the common method
            var jobs = await _jobService.GetJobById(userId,id);
            return Ok(jobs);
        }

        [HttpPost]
        public async Task<IActionResult> CreateJob([FromBody] JobApplicationDto dto)
        {
            var userId = GetUserIdFromToken();
            dto.UserId = userId; // Set the user ID in the DTO
            var job = await _jobService.CreateJobAsync(dto);
            return CreatedAtAction(nameof(GetAllJobs), new { id = job.Id }, job);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateJob(Guid id, [FromBody] JobApplicationDto updatedJob)
        {
            var userId = GetUserIdFromToken();
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
        public async Task<IActionResult> GetInterviews()
        {
            var userId = GetUserIdFromToken();
            return Ok(await _jobService.GetInterviews(userId));
        }

        [HttpGet("stats")]
        public async Task<IActionResult> GetStats()
        {
            var userId = GetUserIdFromToken();
            var stats = await _jobService.GetStats(userId);
            return Ok(stats);
        }

        [HttpGet("activity")]
        public async Task<IActionResult> GetActivities()
        {
            var userId = GetUserIdFromToken();
            var activities = await _jobService.GetActivity(userId);
            return Ok(activities);
        }
    }
}
