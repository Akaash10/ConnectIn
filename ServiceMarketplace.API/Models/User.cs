using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace ServiceMarketplace.API.Models
{
    public class User
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; }

        public string Name { get; set; }
        public string Email { get; set; }
        public string PasswordHash { get; set; }

        public string? Headline { get; set; }
        public string? Location { get; set; }
        public string? Bio { get; set; }
        public List<string> Roles { get; set; } = new List<string>();
        public string? AvatarUrl { get; set; }
        public int ProfileViews { get; set; } = 0;
        public int Connections { get; set; } = 0;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
