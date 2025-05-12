using JobHuntMate.Api.Data;
using JobHuntMate.Api.DTOs;
using JobHuntMate.Api.Exceptions;
using JobHuntMate.Api.Helpers;
using JobHuntMate.Api.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;

namespace JobHuntMate.Api.Services
{
    public class AuthService : IAuthService
    {
        private readonly ApplicationDbContext _context;
        private readonly IConfiguration _config;
        private readonly IEmailService _emailService;
        private readonly ITokenService _tokenService;
        private readonly IPasswordService _passwordService;

        public AuthService(ApplicationDbContext context, IConfiguration config, IEmailService emailService,
            ITokenService tokenService, IPasswordService passwordService)
        {
            _config = config;
            _context = context;
            _emailService = emailService;
            _tokenService = tokenService;
            _passwordService = passwordService;
        }

        public async Task<AuthResponse> LoginAsync(LoginDto loginDto)
        {
            var user = await _context.Users
                .FirstOrDefaultAsync(u => u.Username == loginDto.UsernameOrEmail.ToLower() || u.Email.ToLower() == loginDto.UsernameOrEmail.ToLower());

            if (user == null)
            {
                throw new NotFoundException("User not found");
            }

            if (user.LockoutEnd.HasValue && user.LockoutEnd > DateTime.UtcNow)
            {
                throw new UnauthorizedException("Account locked. Try again later.");
            }



            if (!_passwordService.VerifyPassword(loginDto.Password, user.PasswordHash, user.PasswordSalt))
            {
                user.FailedLoginAttempts++;

                if (user.FailedLoginAttempts >= 5)
                {
                    user.LockoutEnd = DateTime.UtcNow.AddMinutes(5); // lock for 15 mins
                    await _context.SaveChangesAsync();
                    throw new UnauthorizedException("Too many failed attempts. Account locked for 15 minutes.");
                }

                await _context.SaveChangesAsync();
                throw new UnauthorizedException("Invalid credentials");
            }

            // If credentials are valid, generate the JWT token
            var token = _tokenService.GenerateToken(user);

            user.FailedLoginAttempts = 0;
            user.LockoutEnd = null;
            await _context.SaveChangesAsync();

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

            // Hash the password using PasswordService
            var (passwordHash, passwordSalt) = _passwordService.HashPassword(registerDto.Password);

            var user = new AppUser
            {
                Username = registerDto.Username.ToLower(),
                Email = registerDto.Email.ToLower(),
                PasswordHash = passwordHash,
                PasswordSalt = passwordSalt
            };

            // 3. Save the user to the database
            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            // 4. Generate a JWT token 
            var token = _tokenService.GenerateToken(user);

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


        public Task<bool> UserExistsAsync(string usernameOrEmail)
        {
            // Check if the user already exists
            var normalized = usernameOrEmail.ToLower();
            return _context.Users.AnyAsync(u =>
                u.Username == normalized || u.Email == normalized);
        }

        public async Task<bool> ForgotPasswordAsync(ForgotPasswordDto forgotPasswordDto)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == forgotPasswordDto.Email);
            if (user == null) return false;

            // Generate a reset token (for simplicity, using a GUID here)
            var token = GenerateSecureToken();
            var tokenHash = Convert.ToBase64String(SHA256.HashData(Encoding.UTF8.GetBytes(token)));


            // Save the token in the database (or use a secure token store)
            user.PasswordResetToken = tokenHash;
            user.PasswordResetTokenExpiry = DateTime.UtcNow.AddHours(1); // Token valid for 1 hour
            await _context.SaveChangesAsync();

            // Send the reset token via email
            var frontendBaseUrl = _config["FrontendBaseUrl"];
            var resetLink = $"{frontendBaseUrl}/reset-password?token={Uri.EscapeDataString(token)}&email={user.Email}";

            var placeholders = new Dictionary<string, string>
            {
                { "ResetLink", resetLink },
                { "ExpiryTime", "1 hour" }
            };

            var templatePath = Path.Combine(Directory.GetCurrentDirectory(), "Templates", "ResetPasswordTemplate.html");
            var body = EmailTemplateHelper.GetEmailBody(templatePath, placeholders);
            await _emailService.SendEmailAsync(user.Email, "Password Reset", body);

            return true;
        }

        public async Task<bool> ResetPasswordAsync(ResetPasswordDto resetPasswordDto)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u =>
                u.Email == resetPasswordDto.Email &&
                u.PasswordResetToken == Convert.ToBase64String(SHA256.HashData(Encoding.UTF8.GetBytes(resetPasswordDto.Token))) &&
                u.PasswordResetTokenExpiry > DateTime.UtcNow);
            if (user == null)
            {
                return false; // Invalid token or token expired
            }

            // Hash the new password
            using var hmac = new HMACSHA512();
            user.PasswordSalt = hmac.Key;
            user.PasswordHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(resetPasswordDto.NewPassword));

            // Clear the failed login attempts and lockout
            user.FailedLoginAttempts = 0;
            user.LockoutEnd = null;

            // Clear the reset token
            user.PasswordResetToken = null;
            user.PasswordResetTokenExpiry = null;

            await _context.SaveChangesAsync();
            return true;
        }

        private static string GenerateSecureToken(int size = 32)
        {
            var tokenBytes = RandomNumberGenerator.GetBytes(size);
            return Convert.ToBase64String(tokenBytes);
        }
    }
}
