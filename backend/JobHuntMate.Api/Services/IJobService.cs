using JobHuntMate.Api.DTOs;
using JobHuntMate.Api.Models;

namespace JobHuntMate.Api.Services
{
    public interface IJobService
    {
        Task<List<JobApplicationDto>> GetAllJobsAsync(Guid userId);
        Task<JobApplicationDto> GetJobById(Guid userId,Guid id);
        Task<JobApplicationDto> CreateJobAsync(JobApplicationDto dto);
        Task<JobApplicationDto> UpdateJobAsync(Guid id, JobApplicationDto updatedJobDt);
        Task<bool> DeleteJobAsync(Guid id);


        Task<List<Interview>> GetInterviews(Guid id);
        Task<Stats> GetStats(Guid id);
        Task<List<ActivityItem>> GetActivity(Guid id);
    }
}