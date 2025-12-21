using MongoDB.Driver;
using ServiceMarketplace.API.Data;
using ServiceMarketplace.API.Models;
using ServiceMarketplace.API.Repositories.Interfaces;

namespace ServiceMarketplace.API.Repositories
{
    public class ServiceRepository : IServiceRepository
    {
        private readonly IMongoCollection<Service> _services;

        public ServiceRepository(MongoDbContext context)
        {
            _services = context.Services;
        }

        public async Task CreateAsync(Service service)
        {
            await _services.InsertOneAsync(service);
        }

        public async Task<List<Service>> GetByUserIdAsync(string userId)
        {
            return await _services.Find(s => s.UserId == userId).ToListAsync();
        }

        public async Task<List<Service>> GetByCategoryAsync(string category)
        {
            return await _services.Find(s => s.Category == category && s.IsActive).ToListAsync();
        }
    }
}