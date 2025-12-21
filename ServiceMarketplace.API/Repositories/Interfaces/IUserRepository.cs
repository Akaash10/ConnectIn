using ServiceMarketplace.API.Models;

namespace ServiceMarketplace.API.Repositories.Interfaces
{
    public interface IUserRepository
    {
        Task<User> GetByEmailAsync(string email);
        Task<User> GetByIdAsync(string id);
        Task CreateAsync(User user);
    }
}
