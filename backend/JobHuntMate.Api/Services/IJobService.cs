using JobHuntMate.Api.DTOs;
using JobHuntMate.Api.Models;

namespace JobHuntMate.Api.Services
{
    public interface IJobService
    {
        Task<List<Job>> GetAllJobsAsync();
        Task<Job> CreateJobAsync(JobDto dto);
    }
}