namespace JobHuntMate.Api.Services
{
    public interface IPasswordService
    {
        (byte[] passwordHash, byte[] passwordSalt) HashPassword(string password);
        bool VerifyPassword(string password, byte[] storedHash, byte[] storedSalt);
    }
}
