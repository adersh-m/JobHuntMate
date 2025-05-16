using JobHuntMate.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace JobHuntMate.Api.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options) { }

        public DbSet<AppUser> Users { get; set; }
        public DbSet<JobApplication> JobApplications { get; set; }
        public DbSet<JobReminder> JobReminders { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Relationships
            modelBuilder.Entity<JobApplication>()
                .HasOne(j => j.User)
                .WithMany()
                .HasForeignKey(j => j.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<JobReminder>()
                .HasOne(r => r.JobApplication)
                .WithMany()
                .HasForeignKey(r => r.JobApplicationId);
        }
    }
}
