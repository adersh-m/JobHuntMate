using JobHuntMate.Api.Data;
using JobHuntMate.Api.DTOs;
using JobHuntMate.Api.Mappings;
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

        public async Task<List<JobApplicationDto>> GetAllJobsAsync(Guid userId)
        {
            //return dto instead of model
            var jobs = await _context.JobApplications.Where(u => u.UserId == userId).ToListAsync();
            return JobApplicationMapper.ToDtoList(jobs);
        }

        public async Task<JobApplicationDto> CreateJobAsync(JobApplicationDto dto)
        {
            // wrap in try-catch block
            var job = new JobApplication()
            {
                Id = dto.Id ?? Guid.NewGuid(),
                UserId = dto.UserId,
                Title = dto.JobTitle,
                Company = dto.Company,
                Location = dto.Location,
                JobType = dto.JobType,
                Status = dto.Status,
                Salary = dto.Salary,
                Description = dto.Description,
                DateApplied = dto.DateApplied,
                InterviewDate = dto.InterviewDate,
                LastUpdateDate = dto.LastUpdated,
                InterviewMode = dto.InterviewMode,
                Notes = dto.Notes,
                ResumeLink = dto.ResumeLink,
                LastUpdated = DateTime.UtcNow
            };

            try
            {
                _context.JobApplications.Add(job);
                await _context.SaveChangesAsync();
            }
            catch(Exception ex)
            {
                throw;
            }
            return JobApplicationMapper.ToDto(job);
        }

        public async Task<bool> DeleteJobAsync(Guid id)
        {
            var job = await _context.JobApplications.FindAsync(id);
            if (job == null) return false;

            _context.JobApplications.Remove(job);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<JobApplicationDto> GetJobById(Guid userId,Guid id)
        {
            var job = await _context.JobApplications.Where(s => s.UserId == userId && s.Id == id).FirstOrDefaultAsync(); 
            if (job == null)
            {
                throw new Exception("Job not found");
            }

            return JobApplicationMapper.ToDto(job);
        }

        public async Task<JobApplicationDto> UpdateJobAsync(Guid id, JobApplicationDto updatedJobDto)
        {
            var existingJob = await _context.JobApplications.FindAsync(id);
            if (existingJob == null) return null;

            existingJob.Title = updatedJobDto.JobTitle;
            existingJob.Description = updatedJobDto.Description;
            existingJob.ResumeLink = updatedJobDto.ResumeLink;
            existingJob.Notes = updatedJobDto.Notes;
            existingJob.InterviewDate = updatedJobDto.InterviewDate;
            existingJob.InterviewMode = updatedJobDto.InterviewMode;
            existingJob.Salary = updatedJobDto.Salary;
            existingJob.Company = updatedJobDto.Company;
            existingJob.Location = updatedJobDto.Location;
            existingJob.Description = updatedJobDto.Description;
            existingJob.Salary = updatedJobDto.Salary;
            existingJob.JobType = updatedJobDto.JobType;
            existingJob.Status = updatedJobDto.Status;
            existingJob.DateApplied = updatedJobDto.DateApplied;
            existingJob.LastUpdateDate = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            return JobApplicationMapper.ToDto(existingJob);
        }

        public async Task<List<Interview>> GetInterviews(Guid userId)
        {
            var upcomingInterviews = await _context.JobApplications
                .Where(j => j.UserId == userId && j.InterviewDate >= DateTime.UtcNow)
                .OrderBy(j => j.InterviewDate)
                .ToListAsync();

            // return dummy data
            return upcomingInterviews.Select(u => new Interview()
            {
                Company = u.Company,
                Position = u.Title,
                Date = u.InterviewDate.HasValue ? u.InterviewDate.Value.ToString("yyyy-MM-dd") : "", // Fix for CS0029
                Time = u.InterviewDate.HasValue ? u.InterviewDate.Value.ToString("hh:mm tt") : "",
                Type = u.InterviewMode
            }).ToList();
        }

        public async Task<Stats> GetStats(Guid userId)
        {
            var jobs = await _context.JobApplications.Where(j => j.UserId == userId).ToListAsync();

            // return dummy data
            var stats = new Stats
            {
                TotalJobs = jobs.Count,
                AppliedJobs = jobs.Count(j => (j.Status == "APPLIED" || j.Status == "INTERVIEWING")),
                Interviews = jobs.Count(j =>  j.Status == "INTERVIEWING"),
                Offers = jobs.Count(j => j.Status == "APPLIED"),
                Rejections = jobs.Count(j => j.Status == "REJECTED")
            };

            return stats;
        }

        public async Task<List<ActivityItem>> GetActivity(Guid userId)
        {
            var recentActivity = await _context.JobApplications
                .Where(j => j.UserId == userId)
                .OrderByDescending(j => j.LastUpdated)
                .Take(5)
                .ToListAsync();

            // return dummy data
            return recentActivity.Select(r => new ActivityItem()
            {
                Action =r.Status,
                Company = r.Company,
                Position = r.Title,
                Date = r.InterviewDate.HasValue ? r.InterviewDate.Value.ToString("yyyy-MM-dd") : "",
            }).ToList();
        }
    }
}
