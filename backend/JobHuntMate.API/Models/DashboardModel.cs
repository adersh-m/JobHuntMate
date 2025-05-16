namespace JobHuntMate.Api.Models
{
    public class Interview
    {
        public string Company { get; set; }
        public string Position { get; set; }
        public string Date { get; set; }
        public string Time { get; set; }
        public string Type { get; set; }
    }

    public class Stats
    {
        public int TotalJobs { get; set; }
        public int AppliedJobs { get; set; }
        public int Interviews { get; set; }
        public int Offers { get; set; }
        public int Rejections { get; set; }
    }

    public class ActivityItem
    {
        public string Action { get; set; }
        public string Company { get; set; }
        public string Position { get; set; }
        public string Date { get; set; }
    }
}
