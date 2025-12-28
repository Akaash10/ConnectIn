using MongoDB.Driver;
using ServiceMarketplace.API.Data;
using ServiceMarketplace.API.Models;
using ServiceMarketplace.API.Repositories.Interfaces;

namespace ServiceMarketplace.API.Repositories
{
    public class PostRepository : IPostRepository
    {
        private readonly IMongoCollection<Post> _posts;

        public PostRepository(MongoDbContext context)
        {
            _posts = context.Posts;
        }

        public async Task<Post> GetByIdAsync(string id)
        {
            return await _posts.Find(p => p.Id == id).FirstOrDefaultAsync();
        }

        public async Task<List<Post>> GetAllAsync(string sortBy, int limit, int offset)
        {
            var sortDefinition = sortBy.ToLower() == "likes"
                ? Builders<Post>.Sort.Descending(p => p.Likes).Descending(p => p.CreatedAt)
                : Builders<Post>.Sort.Descending(p => p.CreatedAt);

            return await _posts.Find(_ => true)
                .Sort(sortDefinition)
                .Skip(offset)
                .Limit(limit)
                .ToListAsync();
        }

        public async Task<List<Post>> GetByUserIdAsync(string userId)
        {
            return await _posts.Find(p => p.AuthorId == userId)
                .SortByDescending(p => p.CreatedAt)
                .ToListAsync();
        }

        public async Task<int> GetTotalCountAsync()
        {
            return (int)await _posts.CountDocumentsAsync(_ => true);
        }

        public async Task CreateAsync(Post post)
        {
            await _posts.InsertOneAsync(post);
        }

        public async Task UpdateAsync(Post post)
        {
            await _posts.ReplaceOneAsync(p => p.Id == post.Id, post);
        }

        public async Task DeleteAsync(string id)
        {
            await _posts.DeleteOneAsync(p => p.Id == id);
        }

        public async Task<bool> ToggleLikeAsync(string postId, string userId)
        {
            var post = await GetByIdAsync(postId);
            if (post == null) return false;

            var isLiked = post.LikedBy.Contains(userId);

            if (isLiked)
            {
                // Unlike
                post.LikedBy.Remove(userId);
                post.Likes = Math.Max(0, post.Likes - 1);
            }
            else
            {
                // Like
                post.LikedBy.Add(userId);
                post.Likes++;
            }

            await UpdateAsync(post);
            return !isLiked; // Return the new state
        }
    }
}
