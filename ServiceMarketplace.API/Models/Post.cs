using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace ServiceMarketplace.API.Models
{
    public class Post
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; }

        [BsonRepresentation(BsonType.ObjectId)]
        public string AuthorId { get; set; }

        public string Description { get; set; }

        public string? Image { get; set; }

        public string TradeCategory { get; set; } = "General";

        public int Likes { get; set; } = 0;

        public int Comments { get; set; } = 0;

        public List<string> LikedBy { get; set; } = new List<string>();

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public DateTime? UpdatedAt { get; set; }
    }
}
