using ServiceMarketplace.API.DTOs;
using ServiceMarketplace.API.Models;

namespace ServiceMarketplace.API.Services.Interfaces
{
    public interface IPostService
    {
        Task<(List<PostResponseDto> posts, int totalCount, bool hasMore)> GetAllPostsAsync(string currentUserId, string sortBy, int limit, int offset);
        Task<List<PostResponseDto>> GetPostsByUserIdAsync(string userId, string currentUserId);
        Task<PostResponseDto> CreatePostAsync(CreatePostDto dto, string authorId);
        Task<PostResponseDto> UpdatePostAsync(string postId, UpdatePostDto dto, string userId);
        Task DeletePostAsync(string postId, string userId);
        Task<(bool isLiked, int likeCount)> ToggleLikeAsync(string postId, string userId);
    }
}
