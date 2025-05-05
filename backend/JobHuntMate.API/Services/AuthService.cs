using JobHuntMate.Api.Data;
using JobHuntMate.Api.DTOs;
using JobHuntMate.Api.Exceptions;
using JobHuntMate.Api.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace JobHuntMate.Api.Services
{
    public class AuthService : IAuthService
    {
        private readonly ApplicationDbContext _context;
        private readonly IConfiguration _config;

        public AuthService(ApplicationDbContext context, IConfiguration config)
        {
            _config = config;
            _context = context;
        }

        public async Task<AuthResponse> LoginAsync(LoginDto loginDto)
        {
            var user = await _context.Users
                .FirstOrDefaultAsync(u => u.Username == loginDto.UsernameOrEmail.ToLower() || u.Email.ToLower() == loginDto.UsernameOrEmail.ToLower());

            if (user == null)
            {
                throw new NotFoundException("User not found");
            }

            using var hmac = new System.Security.Cryptography.HMACSHA512(user.PasswordSalt);
            var computedHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(loginDto.Password));

            if (!computedHash.SequenceEqual(user.PasswordHash))
            {
                throw new UnauthorizedException("Invalid credentials");
            }

            // If credentials are valid, generate the JWT token
            var token = CreateToken(user);

            var authResponse = new AuthResponse
            {
                Token = token,
                User = new UserDto
                {
                    Id = user.Id.ToString(),
                    Name = user.Username,
                    Email = user.Email
                }
            };

            return authResponse;
        }

        public async Task<AuthResponse> RegisterAsync(RegisterDto registerDto)
        {
            // 1. Check if the user already exists  
            if (await _context.Users.AnyAsync(u => u.Username == registerDto.Username || u.Email == registerDto.Email))
            {
                throw new ValidationException("Username or email already exists");
            }

            // 2. Create a new user and hash the password
            using var hmac = new System.Security.Cryptography.HMACSHA512();
            var user = new AppUser
            {
                Username = registerDto.Username.ToLower(),
                Email = registerDto.Email.ToLower(),
                PasswordHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(registerDto.Password)),
                PasswordSalt = hmac.Key
            };

            // 3. Save the user to the database
            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            // 4. Generate a JWT token (implementation not shown here)
            var token = CreateToken(user); // Replace with actual token generation logic

            // 5. Return the token
            var authResponse = new AuthResponse
            {
                Token = token,
                User = new UserDto
                {
                    Id = user.Id.ToString(),
                    Name = user.Username,
                    Email = user.Email
                }
            };

            // 6. Return the auth response with the token and user data
            return authResponse;
        }

        private string CreateToken(AppUser user)
        {
            var claims = new[]
            {
                new Claim(ClaimTypes.Name, user.Username),
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new Claim(ClaimTypes.Email, user.Email)
            };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:Key"]));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha512Signature);

            var token = new JwtSecurityToken(
                //issuer: _config["Token:Issuer"],
                // audience: _config["Token:Audience"],
                claims: claims,
                expires: DateTime.Now.AddDays(7),
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        public Task<bool> UserExistsAsync(string username)
        {
            // Check if the user already exists
            return _context.Users.AnyAsync(u => u.Username == username.ToLower());
        }
    }
}
