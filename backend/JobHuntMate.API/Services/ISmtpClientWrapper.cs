using System.Net.Mail;

namespace JobHuntMate.Api.Services
{
    public interface ISmtpClientWrapper
    {
        Task SendMailAsync(MailMessage message);
    }
}
