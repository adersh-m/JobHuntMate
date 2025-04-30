using JobHuntMate.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace JobHuntMate.Api.Data
{
    public class ApplicationDbContext: DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options) { }

        public DbSet<Job> Jobs { get; set; }
    }
}
