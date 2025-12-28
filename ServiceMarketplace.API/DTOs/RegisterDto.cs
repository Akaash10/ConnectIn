namespace ServiceMarketplace.API.DTOs
{
    public class RegisterDto
    {
        // Step 1: Basic registration fields
        public string Name { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }

        // Step 2: Complete profile fields
        public string? Headline { get; set; }
        public string? Location { get; set; }
        public string? Bio { get; set; }
        public List<string>? Roles { get; set; }
    }
}