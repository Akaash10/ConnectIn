using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ServiceMarketplace.API.DTOs;
using ServiceMarketplace.API.Services.Interfaces;
using System.Security.Claims;

namespace ServiceMarketplace.API.Controllers
{
    [ApiController]
    [Route("api/services")]
    [Authorize]
    public class ServicesController : ControllerBase
    {
        private readonly IServiceService _serviceService;

        public ServicesController(IServiceService serviceService)
        {
            _serviceService = serviceService;
        }
        [HttpPost]
        public async Task<IActionResult> Create(ServiceCreateDto dto)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier)
                        ?? User.FindFirstValue("sub");

            await _serviceService.CreateAsync(userId!, dto);
            return Ok("Service created successfully");
        }

        [HttpGet("my")]
        public async Task<IActionResult> MyServices()
        {
            var userId = User.FindFirstValue("sub");
            var services = await _serviceService.GetMyServicesAsync(userId!);
            return Ok(services);
        }

        [AllowAnonymous]
        [HttpGet("category/{category}")]
        public async Task<IActionResult> GetByCategory(string category)
        {
            var services = await _serviceService.GetByCategoryAsync(category);
            return Ok(services);
        }
    }
}