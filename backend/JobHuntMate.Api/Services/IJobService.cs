using JobHuntMate.Api.DTOs;
using JobHuntMate.Api.Models;

namespace JobHuntMate.Api.Services
{
    public interface IJobService
    {
        Task<List<Job>> GetAllJobsAsync();
        Task<Job> GetJobById(Guid id);
        Task<Job> CreateJobAsync(JobDto dto);
        Task<Job> UpdateJobAsync(Guid id, JobDto updatedJobDt);
        Task<bool> DeleteJobAsync(Guid id);
    }
}