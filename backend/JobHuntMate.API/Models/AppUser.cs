namespace JobHuntMate.Api.Models
{
    public class AppUser
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        public string Username { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty; // Add Email property

        public byte[] PasswordHash { get; set; }
        public byte[] PasswordSalt { get; set; }

    }
}
