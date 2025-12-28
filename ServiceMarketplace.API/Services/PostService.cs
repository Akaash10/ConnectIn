using ServiceMarketplace.API.DTOs;
using ServiceMarketplace.API.Models;
using ServiceMarketplace.API.Repositories.Interfaces;
using ServiceMarketplace.API.Services.Interfaces;

namespace ServiceMarketplace.API.Services
{
    public class PostService : IPostService
    {
        private readonly IPostRepository _postRepository;
        private readonly IUserRepository _userRepository;

        public PostService(IPostRepository postRepository, IUserRepository userRepository)
        {
            _postRepository = postRepository;
            _userRepository = userRepository;
        }

        public async Task<(List<PostResponseDto> posts, int totalCount, bool hasMore)> GetAllPostsAsync(
            string currentUserId, string sortBy, int limit, int offset)
        {
            var posts = await _postRepository.GetAllAsync(sortBy, limit, offset);
            var totalCount = await _postRepository.GetTotalCountAsync();
            var hasMore = (offset + limit) < totalCount;

            var postDtos = new List<PostResponseDto>();

            foreach (var post in posts)
            {
                var author = await _userRepository.GetByIdAsync(post.AuthorId);
                if (author != null)
                {
                    postDtos.Add(MapToPostResponseDto(post, author, currentUserId));
                }
            }

            return (postDtos, totalCount, hasMore);
        }

        public async Task<List<PostResponseDto>> GetPostsByUserIdAsync(string userId, string currentUserId)
        {
            var posts = await _postRepository.GetByUserIdAsync(userId);
            var author = await _userRepository.GetByIdAsync(userId);

            if (author == null)
                throw new Exception("User not found");

            return posts.Select(p => MapToPostResponseDto(p, author, currentUserId)).ToList();
        }

        public async Task<PostResponseDto> CreatePostAsync(CreatePostDto dto, string authorId)
        {
            var author = await _userRepository.GetByIdAsync(authorId);
            if (author == null)
                throw new Exception("User not found");

            string? imageUrl = null;

            // Handle image upload if provided
            if (dto.Image != null)
            {
                // TODO: Implement actual file upload to cloud storage (AWS S3, Azure Blob, etc.)
                // For now, we'll store it as a placeholder or base64
                // imageUrl = await UploadImageAsync(dto.Image);

                // Temporary: Accept it as uploaded and return a placeholder
                imageUrl = $"/uploads/posts/{Guid.NewGuid()}{Path.GetExtension(dto.Image.FileName)}";
            }

            var post = new Post
            {
                AuthorId = authorId,
                Description = dto.Description,
                Image = imageUrl,
                TradeCategory = dto.TradeCategory ?? "General",
                CreatedAt = DateTime.UtcNow
            };

            await _postRepository.CreateAsync(post);

            return MapToPostResponseDto(post, author, authorId);
        }

        public async Task<PostResponseDto> UpdatePostAsync(string postId, UpdatePostDto dto, string userId)
        {
            var post = await _postRepository.GetByIdAsync(postId);
            if (post == null)
                throw new Exception("Post not found");

            if (post.AuthorId != userId)
                throw new UnauthorizedAccessException("You can only edit your own posts");

            post.Description = dto.Description;
            post.UpdatedAt = DateTime.UtcNow;

            await _postRepository.UpdateAsync(post);

            var author = await _userRepository.GetByIdAsync(post.AuthorId);
            return MapToPostResponseDto(post, author, userId);
        }

        public async Task DeletePostAsync(string postId, string userId)
        {
            var post = await _postRepository.GetByIdAsync(postId);
            if (post == null)
                throw new Exception("Post not found");

            if (post.AuthorId != userId)
                throw new UnauthorizedAccessException("You can only delete your own posts");

            await _postRepository.DeleteAsync(postId);
        }

        public async Task<(bool isLiked, int likeCount)> ToggleLikeAsync(string postId, string userId)
        {
            var isLiked = await _postRepository.ToggleLikeAsync(postId, userId);
            var post = await _postRepository.GetByIdAsync(postId);

            if (post == null)
                throw new Exception("Post not found");

            return (isLiked, post.Likes);
        }

        private PostResponseDto MapToPostResponseDto(Post post, User author, string currentUserId)
        {
            return new PostResponseDto
            {
                Id = post.Id,
                AuthorId = post.AuthorId,
                Author = author.Name,
                AuthorAvatar = author.AvatarUrl,
                Headline = author.Headline ?? "",
                Description = post.Description,
                Image = post.Image,
                TradeCategory = post.TradeCategory,
                Likes = post.Likes,
                Comments = post.Comments,
                IsLiked = post.LikedBy.Contains(currentUserId),
                CreatedAt = post.CreatedAt,
                TimeAgo = CalculateTimeAgo(post.CreatedAt)
            };
        }

        private string CalculateTimeAgo(DateTime createdAt)
        {
            var timeSpan = DateTime.UtcNow - createdAt;

            if (timeSpan.TotalMinutes < 1)
                return "Just now";
            if (timeSpan.TotalMinutes < 60)
                return $"{(int)timeSpan.TotalMinutes}m";
            if (timeSpan.TotalHours < 24)
                return $"{(int)timeSpan.TotalHours}h";
            if (timeSpan.TotalDays < 7)
                return $"{(int)timeSpan.TotalDays}d";
            if (timeSpan.TotalDays < 30)
                return $"{(int)(timeSpan.TotalDays / 7)}w";
            if (timeSpan.TotalDays < 365)
                return $"{(int)(timeSpan.TotalDays / 30)}mo";

            return $"{(int)(timeSpan.TotalDays / 365)}y";
        }
    }
}
