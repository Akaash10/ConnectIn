using System.ComponentModel.DataAnnotations;

namespace ServiceMarketplace.API.DTOs
{
    public class CreatePostDto
    {
        [Required]
        [MaxLength(3000)]
        public string Description { get; set; }

        public string? TradeCategory { get; set; }

        public IFormFile? Image { get; set; }
    }
}
