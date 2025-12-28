namespace ServiceMarketplace.API.DTOs
{
    public class PostResponseDto
    {
        public string Id { get; set; }
        public string AuthorId { get; set; }
        public string Author { get; set; }
        public string? AuthorAvatar { get; set; }
        public string Headline { get; set; }
        public string Description { get; set; }
        public string? Image { get; set; }
        public string TradeCategory { get; set; }
        public int Likes { get; set; }
        public int Comments { get; set; }
        public bool IsLiked { get; set; }
        public DateTime CreatedAt { get; set; }
        public string TimeAgo { get; set; }
    }
}
