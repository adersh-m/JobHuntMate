namespace JobHuntMate.Api.Models
{
    public class JobApplication
    {
        public Guid Id { get; set; }
        public Guid UserId { get; set; } // Foreign key to AppUser

        public string Title { get; set; }
        public string Company { get; set; }
        public string Location { get; set; }
        public string JobType { get; set; } // e.g., Full-Time, Internship
        public string Status { get; set; } // e.g., Applied, Interview, Offer, Rejected

        public string? Salary { get; set; }
        public string? Description { get; set; }

        public DateTime DateApplied { get; set; }
        public DateTime? InterviewDate { get; set; }
        public DateTime? LastUpdateDate { get; set; } 
        public string? InterviewMode { get; set; } // e.g., Phone, Online, In-person

        public string? Notes { get; set; }
        public string? ResumeLink { get; set; }

        public DateTime LastUpdated { get; set; }

        // Navigation property
        public AppUser User { get; set; }
    }

}
