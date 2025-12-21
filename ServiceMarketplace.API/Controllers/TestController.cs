using Microsoft.AspNetCore.Mvc;
using ServiceMarketplace.API.Data;

namespace ServiceMarketplace.API.Controllers
{
    [ApiController]
    [Route("api/test")]
    public class TestController : ControllerBase
    {
        private readonly MongoDbContext _context;

        public TestController(MongoDbContext context)
        {
            _context = context;
        }

        [HttpGet("db")]
        public IActionResult TestDb()
        {
            return Ok("MongoDB Connected Successfully!");
        }
    }
}