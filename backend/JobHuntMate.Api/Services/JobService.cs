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

        public async Task<bool> DeleteJobAsync(Guid id)
        {
            var job = await _context.Jobs.FindAsync(id);
            if (job == null) return false;

            _context.Jobs.Remove(job);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<Job> GetJobById(Guid id)
        {
            var job = await _context.Jobs.FindAsync(id);
            if(job == null)
            {
                throw new Exception("Job not found");
            }

            return job;
        }

        public async Task<Job> UpdateJobAsync(Guid id, JobDto updatedJobDto)
        {
            var existingJob = await _context.Jobs.FindAsync(id);
            if (existingJob == null) return null;

            existingJob.Title = updatedJobDto.Title;
            existingJob.Company = updatedJobDto.Company;
            existingJob.Location = updatedJobDto.Location;
            existingJob.Description = updatedJobDto.Description;
            existingJob.Salary = updatedJobDto.Salary;
            existingJob.JobType = updatedJobDto.JobType;
            existingJob.Status = updatedJobDto.Status;
            existingJob.ApplicationDate = updatedJobDto.ApplicationDate;
            existingJob.LastUpdateDate = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            return new Job
            {
                Id = existingJob.Id,
                Title = existingJob.Title,
                Company = existingJob.Company,
                Location = existingJob.Location,
                Description = existingJob.Description,
                Salary = existingJob.Salary,
                JobType = existingJob.JobType,
                Status = existingJob.Status,
                ApplicationDate = existingJob.ApplicationDate,
                LastUpdateDate = existingJob.LastUpdateDate
            };
        }

        public List<Interview> GetInterviews()
        {
            // return dummy data
            return new List<Interview>
            {
                new Interview
                {
                    Company = "Company A",
                    Position = "Software Engineer",
                    Date = "2023-10-01",
                    Time = "10:00 AM",
                    Type = "Phone"
                },
                new Interview
                {
                    Company = "Company B",
                    Position = "Data Scientist",
                    Date = "2023-10-05",
                    Time = "2:00 PM",
                    Type = "In-person"
                }
            };
        }

        public Stats GetStats()
        {
            // return dummy data
            var stats = new Stats
            {
                TotalJobs = 10,
                AppliedJobs = 5,
                Interviews = 2,
                Offers = 1,
                Rejections = 2
            };

            return stats;
        }

        public List<ActivityItem> GetActivity()
        {
            // return dummy data
            return new List<ActivityItem>
            {
                new ActivityItem
                {
                    Action = "Applied",
                    Company = "Company A",
                    Position = "Software Engineer",
                    Date = "2023-10-01"
                },
                new ActivityItem
                {
                    Action = "Interview",
                    Company = "Company B",
                    Position = "Data Scientist",
                    Date = "2023-10-05"
                }
            };
        }
    }
}
