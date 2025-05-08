using JobHuntMate.Api.Data;
using JobHuntMate.Api.DTOs;
using JobHuntMate.Api.Exceptions;
using JobHuntMate.Api.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Moq;
using Moq.EntityFrameworkCore;
using System.Security.Cryptography;
using Xunit;

namespace JobHuntMate.Api.Services.Tests
{
    public class AuthServiceTests
    {
        private readonly Mock<ApplicationDbContext> _mockContext;
        private readonly Mock<IConfiguration> _mockConfig;
        private readonly Mock<IEmailService> _mockEmailService;
        private readonly Mock<ITokenService> _mockTokenService;
        private readonly Mock<IPasswordService> _mockPasswordService;
        private readonly AuthService _authService;
        private readonly List<AppUser> _users;

        public AuthServiceTests()
        {
            _mockContext = new Mock<ApplicationDbContext>();
            _mockConfig = new Mock<IConfiguration>();
            _mockEmailService = new Mock<IEmailService>();
            _mockTokenService = new Mock<ITokenService>();
            _mockPasswordService = new Mock<IPasswordService>();

            _users = new List<AppUser>
            {
                new AppUser
                {
                    Id = 1,
                    Username = "testuser",
                    Email = "test@example.com",
                    PasswordHash = new byte[] { 1, 2, 3 },
                    PasswordSalt = new byte[] { 4, 5, 6 }
                }
            };

            _authService = new AuthService(
                _mockContext.Object,
                _mockConfig.Object,
                _mockEmailService.Object,
                _mockTokenService.Object,
                _mockPasswordService.Object
            );
        }

        [Fact]
        public async Task LoginAsync_ValidCredentials_ReturnsAuthResponse()
        {
            // Arrange
            var loginDto = new LoginDto { UsernameOrEmail = "testuser", Password = "password" };
            var mockUser = _users.First();

            _mockContext.Setup(c => c.Users)
                .ReturnsDbSet(_users);

            _mockPasswordService.Setup(p => p.VerifyPassword(
                It.IsAny<string>(),
                It.IsAny<byte[]>(),
                It.IsAny<byte[]>()))
                .Returns(true);

            _mockTokenService.Setup(t => t.GenerateToken(It.IsAny<AppUser>()))
                .Returns("test-jwt-token");

            // Act
            var result = await _authService.LoginAsync(loginDto);

            // Assert
            Assert.NotNull(result);
            Assert.Equal("test-jwt-token", result.Token);
            Assert.Equal(mockUser.Username, result.User.Name);
        }

        [Fact]
        public async Task LoginAsync_InvalidCredentials_ThrowsUnauthorizedException()
        {
            // Arrange
            var loginDto = new LoginDto { UsernameOrEmail = "testuser", Password = "wrongpassword" };

            _mockContext.Setup(c => c.Users)
                .ReturnsDbSet(_users);

            _mockPasswordService.Setup(p => p.VerifyPassword(
                It.IsAny<string>(),
                It.IsAny<byte[]>(),
                It.IsAny<byte[]>()))
                .Returns(false);

            // Act & Assert
            await Assert.ThrowsAsync<UnauthorizedException>(
                () => _authService.LoginAsync(loginDto)
            );
        }

        [Fact]
        public async Task RegisterAsync_NewUser_ReturnsAuthResponse()
        {
            // Arrange
            var registerDto = new RegisterDto
            {
                Username = "newuser",
                Email = "new@example.com",
                Password = "password123"
            };

            _mockContext.Setup(c => c.Users)
                .ReturnsDbSet(new List<AppUser>());

            _mockPasswordService.Setup(p => p.HashPassword(It.IsAny<string>()))
                .Returns((new byte[] { 1, 2, 3 }, new byte[] { 4, 5, 6 }));

            _mockTokenService.Setup(t => t.GenerateToken(It.IsAny<AppUser>()))
                .Returns("test-jwt-token");

            // Act
            var result = await _authService.RegisterAsync(registerDto);

            // Assert
            Assert.NotNull(result);
            Assert.Equal("test-jwt-token", result.Token);
            _mockContext.Verify(c => c.Users.AddAsync(It.IsAny<AppUser>(), It.IsAny<CancellationToken>()), Times.Once);
        }

        [Fact]
        public async Task ForgotPasswordAsync_ValidEmail_ReturnsTrue()
        {
            // Arrange
            var forgotPasswordDto = new ForgotPasswordDto { Email = "test@example.com" };

            _mockContext.Setup(c => c.Users)
                .ReturnsDbSet(_users);

            _mockConfig.Setup(c => c["FrontendBaseUrl"])
                .Returns("http://localhost:3000");

            // Act
            var result = await _authService.ForgotPasswordAsync(forgotPasswordDto);

            // Assert
            Assert.True(result);
            _mockEmailService.Verify(
                e => e.SendEmailAsync(
                    It.IsAny<string>(),
                    It.IsAny<string>(),
                    It.IsAny<string>()
                ),
                Times.Once
            );
        }

        [Fact]
        public async Task ResetPasswordAsync_ValidToken_ReturnsTrue()
        {
            // Arrange
            var resetPasswordDto = new ResetPasswordDto
            {
                Email = "test@example.com",
                Token = "valid-token",
                NewPassword = "newpassword123"
            };

            var user = _users.First();
            user.PasswordResetToken = "valid-token";
            user.PasswordResetTokenExpiry = DateTime.UtcNow.AddHours(1);

            _mockContext.Setup(c => c.Users)
                .ReturnsDbSet(_users);

            // Act
            var result = await _authService.ResetPasswordAsync(resetPasswordDto);

            // Assert
            Assert.True(result);
        }

        [Fact]
        public async Task UserExistsAsync_ExistingUser_ReturnsTrue()
        {
            // Arrange
            _mockContext.Setup(c => c.Users)
                .ReturnsDbSet(_users);

            // Act
            var result = await _authService.UserExistsAsync("testuser");

            // Assert
            Assert.True(result);
        }
    }
}