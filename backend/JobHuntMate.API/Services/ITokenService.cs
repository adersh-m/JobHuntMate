using JobHuntMate.Api.Models;
using System.Security.Claims;

namespace JobHuntMate.Api.Services
{
    public interface ITokenService
    {
        string GenerateToken(AppUser user);
        ClaimsPrincipal ValidateToken(string token);
    }
}
