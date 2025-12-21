using ServiceMarketplace.API.Models;

namespace ServiceMarketplace.API.Repositories.Interfaces
{
    public interface IServiceRepository
    {
        Task CreateAsync(Service service);
        Task<List<Service>> GetByUserIdAsync(string userId);
        Task<List<Service>> GetByCategoryAsync(string category);
    }
}