using JobHuntMate.Api.Data;
using JobHuntMate.Api.DTOs;
using JobHuntMate.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace JobHuntMate.Api.Services
{
    public class JobService : IJobService
    {
        private readonly ApplicationDbContext _context;

        public JobService(ApplicationDbContext context)
        {
            _context = context;
        }       

        public async Task<List<Job>> GetAllJobsAsync()
        {
            return await _context.Jobs.ToListAsync();
        }

        public async Task<Job> CreateJobAsync(JobDto dto)
        {
            var job = new Job
            {
                Id = Guid.NewGuid(),
                Title = dto.Title,
                Company = dto.Company,
                Location = dto.Location,
                Description = dto.Description,
                Salary = dto.Salary,
                JobType = dto.JobType,
                Status = dto.Status,
                ApplicationDate = dto.ApplicationDate,
                LastUpdateDate = dto.LastUpdateDate
            };

            _context.Jobs.Add(job);
            await _context.SaveChangesAsync();
            return job;
        }
    }
}
