namespace JobHuntMate.Api.DTOs
{
    public class UpcomingInterviewDto
    {
        public Guid Id { get; set; }
        public string JobTitle { get; set; }
        public string Company { get; set; }
        public DateTime InterviewDate { get; set; }
        public string InterviewMode { get; set; }
    }

    public class RecentJobDto
    {
        public Guid Id { get; set; }
        public string JobTitle { get; set; }
        public string Company { get; set; }
        public string Status { get; set; }
        public DateTime LastUpdated { get; set; }
    }

    public class DashboardSummaryDto
    {
        public int TotalApplications { get; set; }
        public int ActiveApplications { get; set; }
        public int InterviewStageCount { get; set; }
        public int ResponseRateCount { get; set; }

        public List<RecentJobDto> RecentActivity { get; set; }
        public List<UpcomingInterviewDto> UpcomingInterviews { get; set; }
    }
}
