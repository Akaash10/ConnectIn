namespace ServiceMarketplace.API.DTOs
{
    public class ServiceCreateDto
    {
        public string Category { get; set; } = null!;
        public string Title { get; set; } = null!;
        public string Description { get; set; } = null!;
        public string PriceType { get; set; } = null!;
        public decimal Price { get; set; }
        public int ExperienceYears { get; set; }
    }
}