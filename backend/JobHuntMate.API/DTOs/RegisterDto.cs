namespace JobHuntMate.Api.DTOs
{
    public class RegisterDto
    {
        public string Username { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
    }

    public class AuthResponse
    {
        public string Token { get; set; }
        public UserDto User { get; set; }
    }

    public class UserDto
    {
        public string Id { get; set; }
        public string Name { get; set; }
        public string Email { get; set; }
    }
}
