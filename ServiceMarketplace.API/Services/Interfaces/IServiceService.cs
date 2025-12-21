using ServiceMarketplace.API.DTOs;
using ServiceMarketplace.API.Models;

namespace ServiceMarketplace.API.Services.Interfaces
{
    public interface IServiceService
    {
        Task CreateAsync(string userId, ServiceCreateDto dto);
        Task<List<Service>> GetMyServicesAsync(string userId);
        Task<List<Service>> GetByCategoryAsync(string category);
    }
}