namespace JobHuntMate.Api.DTOs
{
    public class JobApplicationDto
    {
        public Guid? Id { get; set; }
        public Guid UserId { get; set; }
        public string JobTitle { get; set; }
        public string Company { get; set; }
        public string Location { get; set; }
        public string JobType { get; set; }
        public string Status { get; set; }
        public string? Salary { get; set; }
        public string? Description { get; set; }
        public DateTime DateApplied { get; set; }
        public string? ResumeLink { get; set; }
        public string? Notes { get; set; }
        public DateTime? InterviewDate { get; set; }
        public string? InterviewMode { get; set; }
        public DateTime LastUpdated { get; set; }
    }

}
