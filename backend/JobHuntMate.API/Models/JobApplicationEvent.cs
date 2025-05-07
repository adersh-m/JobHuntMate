namespace JobHuntMate.Api.Models
{
    public class JobApplicationEvent
    {
        public Guid Id { get; set; } = Guid.NewGuid();

        public Guid JobApplicationId { get; set; }
        public JobApplication JobApplication { get; set; }

        public string EventType { get; set; }       // Applied, Interview, Offer, etc.
        public string? Description { get; set; }
        public DateTime Timestamp { get; set; } = DateTime.UtcNow;
    }

}
