namespace JobHuntMate.Api.Models
{
    public class JobReminder
    {
        public Guid Id { get; set; } = Guid.NewGuid();

        public Guid JobApplicationId { get; set; }
        public JobApplication JobApplication { get; set; }

        public string Message { get; set; }
        public DateTime ReminderDate { get; set; }
        public bool IsCompleted { get; set; } = false;
    }

}
