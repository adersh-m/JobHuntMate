using JobHuntMate.Api.Data;
using JobHuntMate.Api.DTOs;
using JobHuntMate.Api.Models;
using JobHuntMate.Api.Services;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Xunit;

namespace JobHuntMate.Api.Tests
{
    public class JobServiceTests
    {
        private readonly ApplicationDbContext _context;
        private readonly JobService _jobService;
        private readonly Guid userId = new Guid("FAD236E4-C9B8-44A0-B42A-A6BEBAB0EA31");

        public JobServiceTests()
        {
            var options = new DbContextOptionsBuilder<ApplicationDbContext>()
                .UseInMemoryDatabase(Guid.NewGuid().ToString())
                .Options;

            _context = new ApplicationDbContext(options);
            _jobService = new JobService(_context);
        }

        [Fact]
        public async Task GetAllJobsAsync_ShouldReturnAllJobs()
        {
            // Arrange
            var jobs = new List<JobApplication>
            {
                new JobApplication
                {
                    Id = Guid.NewGuid(),
                    Title = "Job1",
                    Company = "Company1",
                    Location = "NYC",
                    JobType = "FULL_TIME",
                    Status = "APPLIED",
                    DateApplied = DateTime.UtcNow,
                    LastUpdateDate = DateTime.UtcNow
                },
                new JobApplication
                {
                    Id = Guid.NewGuid(),
                    Title = "Job2",
                    Company = "Company2",
                    Location = "Remote",
                    JobType = "PART_TIME",
                    Status = "WISHLIST",
                    DateApplied = DateTime.UtcNow,
                    LastUpdateDate = DateTime.UtcNow
                }
            };


            _context.JobApplications.AddRange(jobs);
            await _context.SaveChangesAsync();

            // Act
            var result = await _jobService.GetAllJobsAsync(userId);

            // Assert
            Assert.Equal(2, result.Count);
        }

        [Fact]
        public async Task CreateJobAsync_ShouldAddJobToDatabase()
        {
            // Arrange
            var jobDto = new JobApplicationDto
            {
                JobTitle = "New Job",
                Company = "New Company",
                Location = "Location",
                Description = "Some description",
                Salary = "1000",
                JobType = "FULL_TIME",
                Status = "APPLIED",
                DateApplied = DateTime.UtcNow,
                LastUpdated = DateTime.UtcNow
            };

            // Act
            var result = await _jobService.CreateJobAsync(jobDto);

            // Assert
            Assert.NotNull(result);
            Assert.Equal(jobDto.JobTitle, result.JobTitle);
            Assert.Equal(1, await _context.JobApplications.CountAsync());
        }

        [Fact]
        public async Task DeleteJobAsync_ShouldRemoveJobFromDatabase()
        {
            // Arrange
            var job = new JobApplication
            {
                Id = Guid.NewGuid(),
                Title = "To Delete",
                Company = "Company1",
                Location = "NYC",
                JobType = "FULL_TIME",
                Status = "APPLIED",
                DateApplied = DateTime.UtcNow,
                LastUpdateDate = DateTime.UtcNow
            };

            _context.JobApplications.Add(job);
            await _context.SaveChangesAsync();

            // Act
            var result = await _jobService.DeleteJobAsync(job.Id);

            // Assert
            Assert.True(result);
            Assert.Null(await _context.JobApplications.FindAsync(job.Id));
        }

        [Fact]
        public async Task GetJobById_ShouldReturnCorrectJob()
        {
            // Arrange
            var job = new JobApplication { Id = Guid.NewGuid(), Title = "Find Me", Company = "Company1", Location = "NYC", JobType = "FULL_TIME", Status = "APPLIED", DateApplied = DateTime.UtcNow, LastUpdateDate = DateTime.UtcNow };
            _context.JobApplications.Add(job);
            await _context.SaveChangesAsync();

            // Act
            var result = await _jobService.GetJobById(userId,job.Id);

            // Assert
            Assert.NotNull(result);
            Assert.Equal(job.Id, result.Id);
        }

        [Fact]
        public async Task UpdateJobAsync_ShouldModifyJob()
        {
            // Arrange
            var job = new JobApplication { Id = Guid.NewGuid(), Title = "Old Title", Company = "Old Company", Location = "NYC", JobType = "WISHLIST", Status = "APPLIED", DateApplied = DateTime.UtcNow, LastUpdateDate = DateTime.UtcNow };

            _context.JobApplications.Add(job);
            await _context.SaveChangesAsync();

            var updatedDto = new JobApplicationDto
            {
                JobTitle = "Updated Title",
                Company = "New Company",
                Description = "New Description",
                Location = "Remote",
                Salary = "2000",
                JobType = "PART_TIME",
                Status = "INTERVIEWING",
                DateApplied = DateTime.UtcNow,
                LastUpdated = DateTime.UtcNow
            };

            // Act
            var result = await _jobService.UpdateJobAsync(job.Id, updatedDto);

            // Assert
            Assert.NotNull(result);
            Assert.Equal("Updated Title", result.JobTitle);
            Assert.Equal("New Company", result.Company);
        }
    }
}
