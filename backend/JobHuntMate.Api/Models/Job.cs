namespace JobHuntMate.Api.Models
{
    public class Job
    {
        public Guid Id { get; set; }
        public string Title { get; set; }
        public string Company { get; set; }
        public string Location { get; set; }
        public string? Description { get; set; }
        public string? Salary { get; set; }
        public string JobType { get; set; }
        public string Status { get; set; }
        public DateTime ApplicationDate { get; set; }
        public DateTime LastUpdateDate { get; set; }
    }
}
