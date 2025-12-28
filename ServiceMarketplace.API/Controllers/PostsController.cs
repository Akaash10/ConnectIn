using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ServiceMarketplace.API.DTOs;
using ServiceMarketplace.API.Services.Interfaces;
using System.Security.Claims;

namespace ServiceMarketplace.API.Controllers
{
    [ApiController]
    [Route("api/posts")]
    [Authorize]
    public class PostsController : ControllerBase
    {
        private readonly IPostService _postService;

        public PostsController(IPostService postService)
        {
            _postService = postService;
        }

        private string GetCurrentUserId()
        {
            return User.FindFirst(ClaimTypes.NameIdentifier)?.Value
                ?? throw new UnauthorizedAccessException("User not authenticated");
        }

        /// <summary>
        /// Get all posts (feed) with pagination and sorting
        /// </summary>
        /// <param name="sortBy">Sort by "time" or "likes" (default: time)</param>
        /// <param name="limit">Number of posts per page (default: 20)</param>
        /// <param name="offset">Pagination offset (default: 0)</param>
        [HttpGet]
        public async Task<IActionResult> GetAllPosts(
            [FromQuery] string sortBy = "time",
            [FromQuery] int limit = 20,
            [FromQuery] int offset = 0)
        {
            try
            {
                var userId = GetCurrentUserId();
                var (posts, totalCount, hasMore) = await _postService.GetAllPostsAsync(userId, sortBy, limit, offset);

                return Ok(new
                {
                    success = true,
                    data = new
                    {
                        posts,
                        totalCount,
                        hasMore
                    }
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new { success = false, message = ex.Message });
            }
        }

        /// <summary>
        /// Get posts by specific user ID
        /// </summary>
        /// <param name="userId">The user ID to fetch posts for</param>
        [HttpGet("user/{userId}")]
        public async Task<IActionResult> GetPostsByUserId(string userId)
        {
            try
            {
                var currentUserId = GetCurrentUserId();
                var posts = await _postService.GetPostsByUserIdAsync(userId, currentUserId);

                return Ok(new
                {
                    success = true,
                    data = posts
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new { success = false, message = ex.Message });
            }
        }

        /// <summary>
        /// Create a new post
        /// </summary>
        [HttpPost]
        public async Task<IActionResult> CreatePost([FromForm] CreatePostDto dto)
        {
            try
            {
                var userId = GetCurrentUserId();
                var post = await _postService.CreatePostAsync(dto, userId);

                return Ok(new
                {
                    success = true,
                    message = "Post created successfully",
                    data = post
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new { success = false, message = ex.Message });
            }
        }

        /// <summary>
        /// Update an existing post
        /// </summary>
        /// <param name="postId">The post ID to update</param>
        [HttpPut("{postId}")]
        public async Task<IActionResult> UpdatePost(string postId, [FromBody] UpdatePostDto dto)
        {
            try
            {
                var userId = GetCurrentUserId();
                var post = await _postService.UpdatePostAsync(postId, dto, userId);

                return Ok(new
                {
                    success = true,
                    message = "Post updated successfully",
                    data = post
                });
            }
            catch (UnauthorizedAccessException ex)
            {
                return Forbid(ex.Message);
            }
            catch (Exception ex)
            {
                return BadRequest(new { success = false, message = ex.Message });
            }
        }

        /// <summary>
        /// Delete a post
        /// </summary>
        /// <param name="postId">The post ID to delete</param>
        [HttpDelete("{postId}")]
        public async Task<IActionResult> DeletePost(string postId)
        {
            try
            {
                var userId = GetCurrentUserId();
                await _postService.DeletePostAsync(postId, userId);

                return Ok(new
                {
                    success = true,
                    message = "Post deleted successfully"
                });
            }
            catch (UnauthorizedAccessException ex)
            {
                return Forbid(ex.Message);
            }
            catch (Exception ex)
            {
                return BadRequest(new { success = false, message = ex.Message });
            }
        }

        /// <summary>
        /// Like or unlike a post
        /// </summary>
        /// <param name="postId">The post ID to like/unlike</param>
        [HttpPost("{postId}/like")]
        public async Task<IActionResult> ToggleLike(string postId)
        {
            try
            {
                var userId = GetCurrentUserId();
                var (isLiked, likeCount) = await _postService.ToggleLikeAsync(postId, userId);

                return Ok(new
                {
                    success = true,
                    message = isLiked ? "Post liked successfully" : "Post unliked successfully",
                    data = new
                    {
                        isLiked,
                        likeCount
                    }
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new { success = false, message = ex.Message });
            }
        }
    }
}
