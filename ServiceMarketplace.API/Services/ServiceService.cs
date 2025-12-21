using ServiceMarketplace.API.DTOs;
using ServiceMarketplace.API.Models;
using ServiceMarketplace.API.Repositories.Interfaces;
using ServiceMarketplace.API.Services.Interfaces;

namespace ServiceMarketplace.API.Services
{
    public class ServiceService : IServiceService
    {
        private readonly IServiceRepository _repository;

        public ServiceService(IServiceRepository repository)
        {
            _repository = repository;
        }

        public async Task CreateAsync(string userId, ServiceCreateDto dto)
        {
            var service = new Service
            {
                UserId = userId,
                Category = dto.Category,
                Title = dto.Title,
                Description = dto.Description,
                PriceType = dto.PriceType,
                Price = dto.Price,
                ExperienceYears = dto.ExperienceYears
            };

            await _repository.CreateAsync(service);
        }

        public async Task<List<Service>> GetMyServicesAsync(string userId)
        {
            return await _repository.GetByUserIdAsync(userId);
        }

        public async Task<List<Service>> GetByCategoryAsync(string category)
        {
            return await _repository.GetByCategoryAsync(category);
        }
    }
}