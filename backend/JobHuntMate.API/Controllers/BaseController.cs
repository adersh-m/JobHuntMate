using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace JobHuntMate.Api.Controllers
{
    [ApiController]
    public class BaseController : ControllerBase
    {        protected Guid GetUserIdFromToken()
        {
            var userIdClaim = User.Claims.FirstOrDefault(c => c.Type == "sub" || c.Type == "id");
            if (userIdClaim == null)
            {
                throw new UnauthorizedAccessException("User ID not found in token");
            }

            if (!Guid.TryParse(userIdClaim.Value, out var userId))
            {
                throw new InvalidOperationException("Invalid user ID in token");
            }

            return userId;
        }
    }
}
