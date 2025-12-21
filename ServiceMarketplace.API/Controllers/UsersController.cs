using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ServiceMarketplace.API.Controllers
{
    [ApiController]
    [Route("api/users")]
    [Authorize] 
    public class UsersController : ControllerBase
    {
        [HttpGet("profile")]
        public IActionResult GetProfile()
        {
            return Ok("This is a protected user profile");
        }
    }
}
