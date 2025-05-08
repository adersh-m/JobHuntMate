namespace JobHuntMate.Api.Services
{
    public interface IEmailService
    {
        public Task<bool> SendEmailAsync(string email, string subject, string body);
    }
}
