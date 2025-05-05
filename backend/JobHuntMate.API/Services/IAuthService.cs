using JobHuntMate.Api.DTOs;

namespace JobHuntMate.Api.Services
{
    public interface IAuthService
    {
        Task<AuthResponse> LoginAsync(LoginDto loginDto);
        Task<AuthResponse> RegisterAsync(RegisterDto registerDto);
        Task<bool> UserExistsAsync(string username);
    }
}
