using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using ServiceMarketplace.API.DTOs;
using ServiceMarketplace.API.Helpers;
using ServiceMarketplace.API.Services.Interfaces;

namespace ServiceMarketplace.API.Controllers
{
    [ApiController]
    [Route("api/auth")]
    public class AuthController : ControllerBase
    {
        private readonly IUserService _userService;
        private readonly JwtHelper _jwtHelper;

        public AuthController(IUserService userService, JwtHelper jwtHelper)
        {
            _userService = userService;
            _jwtHelper = jwtHelper;
        }

        [HttpPost("register")]
        [AllowAnonymous]
        public async Task<IActionResult> Register(RegisterDto dto)
        {
            var user = await _userService.RegisterAsync(dto);
            var token = _jwtHelper.GenerateToken(user);

            return Ok(new { token });
        }

        [HttpPost("login")]
        [AllowAnonymous]
        public async Task<IActionResult> Login(LoginDto dto)
        {
            var user = await _userService.LoginAsync(dto);
            var token = _jwtHelper.GenerateToken(user);

            return Ok(new { token });
        }
    }
}