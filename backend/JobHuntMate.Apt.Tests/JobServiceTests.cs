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
            var jobs = new List<Job>
            {
                new Job
                {
                    Id = Guid.NewGuid(),
                    Title = "Job1",
                    Company = "Company1",
                    Location = "NYC",
                    JobType = "FULL_TIME",
                    Status = "APPLIED",
                    ApplicationDate = DateTime.UtcNow,
                    LastUpdateDate = DateTime.UtcNow
                },
                new Job
                {
                    Id = Guid.NewGuid(),
                    Title = "Job2",
                    Company = "Company2",
                    Location = "Remote",
                    JobType = "PART_TIME",
                    Status = "WISHLIST",
                    ApplicationDate = DateTime.UtcNow,
                    LastUpdateDate = DateTime.UtcNow
                }
            };


            _context.Jobs.AddRange(jobs);
            await _context.SaveChangesAsync();

            // Act
            var result = await _jobService.GetAllJobsAsync();

            // Assert
            Assert.Equal(2, result.Count);
        }

        [Fact]
        public async Task CreateJobAsync_ShouldAddJobToDatabase()
        {
            // Arrange
            var jobDto = new JobDto
            {
                Title = "New Job",
                Company = "New Company",
                Location = "Location",
                Description = "Some description",
                Salary = "1000",
                JobType = "FULL_TIME",
                Status = "APPLIED",
                ApplicationDate = DateTime.UtcNow,
                LastUpdateDate = DateTime.UtcNow
            };

            // Act
            var result = await _jobService.CreateJobAsync(jobDto);

            // Assert
            Assert.NotNull(result);
            Assert.Equal(jobDto.Title, result.Title);
            Assert.Equal(1, await _context.Jobs.CountAsync());
        }

        [Fact]
        public async Task DeleteJobAsync_ShouldRemoveJobFromDatabase()
        {
            // Arrange
            var job = new Job
            {
                Id = Guid.NewGuid(),
                Title = "To Delete",
                Company = "Company1",
                Location = "NYC",
                JobType = "FULL_TIME",
                Status = "APPLIED",
                ApplicationDate = DateTime.UtcNow,
                LastUpdateDate = DateTime.UtcNow
            };

            _context.Jobs.Add(job);
            await _context.SaveChangesAsync();

            // Act
            var result = await _jobService.DeleteJobAsync(job.Id);

            // Assert
            Assert.True(result);
            Assert.Null(await _context.Jobs.FindAsync(job.Id));
        }

        [Fact]
        public async Task GetJobById_ShouldReturnCorrectJob()
        {
            // Arrange
            var job = new Job
            {
                Id = Guid.NewGuid(),
                Title = "Find Me",
                Company = "Company1",
                Location = "NYC",
                JobType = "FULL_TIME",
                Status = "APPLIED",
                ApplicationDate = DateTime.UtcNow,
                LastUpdateDate = DateTime.UtcNow
            };
            _context.Jobs.Add(job);
            await _context.SaveChangesAsync();

            // Act
            var result = await _jobService.GetJobById(job.Id);

            // Assert
            Assert.NotNull(result);
            Assert.Equal(job.Id, result.Id);
        }

        [Fact]
        public async Task UpdateJobAsync_ShouldModifyJob()
        {
            // Arrange
            var job = new Job
            {
                Id = Guid.NewGuid(),
                Title = "Old Title",
                Company = "Old Company",
                Location = "NYC",
                JobType = "WISHLIST",
                Status = "APPLIED",
                ApplicationDate = DateTime.UtcNow,
                LastUpdateDate = DateTime.UtcNow
            };

            _context.Jobs.Add(job);
            await _context.SaveChangesAsync();

            var updatedDto = new JobDto
            {
                Title = "Updated Title",
                Company = "New Company",
                Description = "New Description",
                Location = "Remote",
                Salary = "2000",
                JobType = "PART_TIME",
                Status = "INTERVIEWING",
                ApplicationDate = DateTime.UtcNow,
                LastUpdateDate = DateTime.UtcNow
            };

            // Act
            var result = await _jobService.UpdateJobAsync(job.Id, updatedDto);

            // Assert
            Assert.NotNull(result);
            Assert.Equal("Updated Title", result.Title);
            Assert.Equal("New Company", result.Company);
        }
    }
}
