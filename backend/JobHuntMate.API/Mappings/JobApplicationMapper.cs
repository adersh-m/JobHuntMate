using JobHuntMate.Api.DTOs;
using JobHuntMate.Api.Models;

namespace JobHuntMate.Api.Mappings
{
    public static class JobApplicationMapper
    {
        // Map JobApplication to JobApplicationDto
        public static JobApplicationDto ToDto(JobApplication job)
        {
            if (job == null) return null;

            return new JobApplicationDto
            {
                Id = job.Id,
                UserId = job.UserId,
                JobTitle = job.Title,
                Company = job.Company,
                Location = job.Location,
                JobType = job.JobType,
                Status = job.Status,
                Salary = job.Salary,
                Description = job.Description,
                DateApplied = job.DateApplied,
                InterviewDate = job.InterviewDate,
                InterviewMode = job.InterviewMode,
                Notes = job.Notes,
                ResumeLink = job.ResumeLink,
                LastUpdated = job.LastUpdated
            };
        }

        // Map JobApplicationDto to JobApplication
        public static JobApplication ToEntity(JobApplicationDto dto)
        {
            if (dto == null) return null;

            return new JobApplication
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
                InterviewMode = dto.InterviewMode,
                Notes = dto.Notes,
                ResumeLink = dto.ResumeLink,
                LastUpdated = dto.LastUpdated
            };
        }

        // Map a list of JobApplication to a list of JobApplicationDto
        public static List<JobApplicationDto> ToDtoList(IEnumerable<JobApplication> jobs)
        {
            return jobs?.Select(ToDto).ToList();
        }

        // Map a list of JobApplicationDto to a list of JobApplication
        public static List<JobApplication> ToEntityList(IEnumerable<JobApplicationDto> dtos)
        {
            return dtos?.Select(ToEntity).ToList();
        }
    }
}

