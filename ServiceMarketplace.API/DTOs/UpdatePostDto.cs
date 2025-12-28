using System.ComponentModel.DataAnnotations;

namespace ServiceMarketplace.API.DTOs
{
    public class UpdatePostDto
    {
        [Required]
        [MaxLength(3000)]
        public string Description { get; set; }
    }
}
