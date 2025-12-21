using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace ServiceMarketplace.API.Models
{
    public class Service
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string? Id { get; set; }

        public string UserId { get; set; } = null!; // Provider

        public string Category { get; set; } = null!; // Carpenter, Plumber
        public string Title { get; set; } = null!;
        public string Description { get; set; } = null!;

        public string PriceType { get; set; } = null!; // Hourly / Fixed
        public decimal Price { get; set; }

        public int ExperienceYears { get; set; }

        public bool IsActive { get; set; } = true;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}