using Microsoft.Extensions.Options;
using MongoDB.Driver;
using ServiceMarketplace.API.Models;

namespace ServiceMarketplace.API.Data
{
    public class MongoDbContext
    {
        private readonly IMongoDatabase _database;

        public MongoDbContext(
            IMongoClient client,
            IOptions<MongoDbSettings> settings)
        {
            _database = client.GetDatabase(settings.Value.DatabaseName);
        }

        public IMongoCollection<User> Users =>
            _database.GetCollection<User>("Users");

        public IMongoCollection<Service> Services =>
            _database.GetCollection<Service>("Services");

        public IMongoCollection<Booking> Bookings =>
            _database.GetCollection<Booking>("Bookings");

        public IMongoCollection<Post> Posts =>
            _database.GetCollection<Post>("Posts");
    }
}
