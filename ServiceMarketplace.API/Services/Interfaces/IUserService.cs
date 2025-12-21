using ServiceMarketplace.API.DTOs;
using ServiceMarketplace.API.Models;

namespace ServiceMarketplace.API.Services.Interfaces
{
    public interface IUserService
    {
        Task<User> RegisterAsync(RegisterDto dto);
        Task<User> LoginAsync(LoginDto dto);
    }
}