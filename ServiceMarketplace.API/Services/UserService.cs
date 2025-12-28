using ServiceMarketplace.API.DTOs;
using ServiceMarketplace.API.Models;
using ServiceMarketplace.API.Repositories.Interfaces;
using ServiceMarketplace.API.Services.Interfaces;
using ServiceMarketplace.API.Helpers;

namespace ServiceMarketplace.API.Services
{
    public class UserService : IUserService
    {
        private readonly IUserRepository _userRepository;

        public UserService(IUserRepository userRepository)
        {
            _userRepository = userRepository;
        }

        public async Task<User> RegisterAsync(RegisterDto dto)
        {
            var existingUser = await _userRepository.GetByEmailAsync(dto.Email);
            if (existingUser != null)
                throw new Exception("Email already registered");

            var user = new User
            {
                Name = dto.Name,
                Email = dto.Email,
                PasswordHash = PasswordHasher.Hash(dto.Password),
                Headline = dto.Headline,
                Location = dto.Location,
                Bio = dto.Bio,
                Roles = dto.Roles ?? new List<string> { "General" }
            };

            await _userRepository.CreateAsync(user);
            return user;
        }

        public async Task<User> LoginAsync(LoginDto dto)
        {
            var user = await _userRepository.GetByEmailAsync(dto.Email);
            if (user == null)
                throw new Exception("Invalid email or password");

            if (!PasswordHasher.Verify(dto.Password, user.PasswordHash))
                throw new Exception("Invalid email or password");

            return user;
        }
    }
}