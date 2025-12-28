using ServiceMarketplace.API.Models;

namespace ServiceMarketplace.API.Repositories.Interfaces
{
    public interface IPostRepository
    {
        Task<Post> GetByIdAsync(string id);
        Task<List<Post>> GetAllAsync(string sortBy, int limit, int offset);
        Task<List<Post>> GetByUserIdAsync(string userId);
        Task<int> GetTotalCountAsync();
        Task CreateAsync(Post post);
        Task UpdateAsync(Post post);
        Task DeleteAsync(string id);
        Task<bool> ToggleLikeAsync(string postId, string userId);
    }
}
