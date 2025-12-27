import { useState, useEffect } from "react";
import "./ViewPost.css";

interface Comment {
  id: number;
  postId: number;
  author: string;
  authorAvatar?: string | null;
  text: string;
  timestamp: string;
}

interface PostProps {
  post?: {
    id: number;
    authorId?: number;
    author: string;
    authorAvatar?: string | null;
    headline?: string;
    timeAgo?: string;
    description: string;
    image?: string | null;
    tradeCategory?: string;
    likes?: number;
    comments?: number;
  };
  isEnd?: boolean;
  showBookButton?: boolean;
}

const ViewPost = ({ post, isEnd, showBookButton = false }: PostProps) => {
  const [expanded, setExpanded] = useState(false);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [commentCount, setCommentCount] = useState(0);
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentError, setCommentError] = useState("");
  const [showMenu, setShowMenu] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState("");
  const [editingCommentId, setEditingCommentId] = useState<number | null>(null);
  const [editCommentText, setEditCommentText] = useState("");

  const MAX_COMMENT_LENGTH = 500;

  // Get current user data from localStorage
  const currentUser = JSON.parse(localStorage.getItem("currentUser") || JSON.stringify({
    id: Date.now(),
    name: "Sanjay A Kanakaraj",
    headline: "Software Development Engineer",
    location: "Tiruppur, Tamil Nadu",
    avatarUrl: null,
    bio: "",
    profileViews: 16,
    connections: 284,
  }));

  const handleBookService = () => {
    if (!post) return;

    // Dispatch event to open booking modal
    const event = new CustomEvent("openBookingModal", {
      detail: {
        serviceProvider: {
          id: post.authorId,
          name: post.author,
          headline: post.headline,
          avatarUrl: post.authorAvatar,
          tradeCategory: post.tradeCategory
        }
      }
    });
    window.dispatchEvent(event);
  };

  // Initialize counts and load comments when post changes
  useEffect(() => {
    if (post) {
      setLikeCount(post.likes || 0);
      setLiked(false);

      // Load comments from localStorage
      const allComments = JSON.parse(localStorage.getItem("postComments") || "{}");
      const postComments = allComments[post.id] || [];
      setComments(postComments);
      setCommentCount(postComments.length);
    }
  }, [post]);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (showMenu) {
        const target = e.target as HTMLElement;
        if (!target.closest('.post-menu-container')) {
          setShowMenu(false);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showMenu]);

  if (isEnd) {
    return (
      <div className="post end-post">
        You've reached the end of your connections' posts
      </div>
    );
  }

  if (!post) return null;

  // All data coming from post object (will be replaced by API calls)
  const {
    author,
    authorAvatar,
    headline = "Professional",
    timeAgo = "1h",
    description,
    image,
  } = post;

  const handleLike = () => {
    if (liked) {
      setLiked(false);
      setLikeCount(likeCount - 1);
    } else {
      setLiked(true);
      setLikeCount(likeCount + 1);
    }
  };

  const handleToggleComments = () => {
    setShowComments(!showComments);
  };

  const handleCommentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value.length <= MAX_COMMENT_LENGTH) {
      setCommentText(value);
      setCommentError("");
    } else {
      setCommentError(`Comment cannot exceed ${MAX_COMMENT_LENGTH} characters`);
    }
  };

  const handleAddComment = () => {
    if (!commentText.trim()) return;

    if (commentText.length > MAX_COMMENT_LENGTH) {
      setCommentError(`Comment cannot exceed ${MAX_COMMENT_LENGTH} characters`);
      return;
    }

    const newComment: Comment = {
      id: Date.now(),
      postId: post.id,
      author: currentUser.name,
      authorAvatar: currentUser.avatarUrl,
      text: commentText,
      timestamp: "Just now",
    };

    const updatedComments = [newComment, ...comments];
    setComments(updatedComments);
    setCommentCount(updatedComments.length);

    // Save to localStorage
    const allComments = JSON.parse(localStorage.getItem("postComments") || "{}");
    allComments[post.id] = updatedComments;
    localStorage.setItem("postComments", JSON.stringify(allComments));

    setCommentText("");
    setCommentError("");
  };

  const handleDeleteComment = (commentId: number) => {
    const updatedComments = comments.filter((c) => c.id !== commentId);
    setComments(updatedComments);
    setCommentCount(updatedComments.length);

    // Update localStorage
    const allComments = JSON.parse(localStorage.getItem("postComments") || "{}");
    allComments[post.id] = updatedComments;
    localStorage.setItem("postComments", JSON.stringify(allComments));
  };

  const handleEditComment = (commentId: number, currentText: string) => {
    setEditingCommentId(commentId);
    setEditCommentText(currentText);
  };

  const handleSaveCommentEdit = () => {
    if (!editCommentText.trim()) return;

    if (editCommentText.length > MAX_COMMENT_LENGTH) {
      setCommentError(`Comment cannot exceed ${MAX_COMMENT_LENGTH} characters`);
      return;
    }

    const updatedComments = comments.map((c) =>
      c.id === editingCommentId ? { ...c, text: editCommentText } : c
    );
    setComments(updatedComments);

    // Update localStorage
    const allComments = JSON.parse(localStorage.getItem("postComments") || "{}");
    allComments[post.id] = updatedComments;
    localStorage.setItem("postComments", JSON.stringify(allComments));

    setEditingCommentId(null);
    setEditCommentText("");
    setCommentError("");
  };

  const handleCancelCommentEdit = () => {
    setEditingCommentId(null);
    setEditCommentText("");
    setCommentError("");
  };

  const handleEditPost = () => {
    setIsEditing(true);
    setEditText(post.description);
    setShowMenu(false);
  };

  const handleSaveEdit = () => {
    if (!editText.trim()) return;

    const posts = JSON.parse(localStorage.getItem("myPosts") || "[]");
    const updatedPosts = posts.map((p: any) =>
      p.id === post.id ? { ...p, description: editText } : p
    );
    localStorage.setItem("myPosts", JSON.stringify(updatedPosts));

    const event = new CustomEvent("postsUpdated");
    window.dispatchEvent(event);

    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditText("");
  };

  const handleDeletePost = () => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      const posts = JSON.parse(localStorage.getItem("myPosts") || "[]");
      const updatedPosts = posts.filter((p: any) => p.id !== post.id);
      localStorage.setItem("myPosts", JSON.stringify(updatedPosts));

      const event = new CustomEvent("postsUpdated");
      window.dispatchEvent(event);
    }
  };

  const handleAuthorClick = () => {
    if (post.authorId) {
      const event = new CustomEvent("viewProfile", { detail: post.authorId });
      window.dispatchEvent(event);
    }
  };

  return (
    <div className="post">
      <div className="post-header">
        <div className="post-avatar">
          {authorAvatar ? (
            <img src={authorAvatar} alt={author} />
          ) : (
            author.charAt(0)
          )}
        </div>
        <div className="post-info">
          <h4 className="post-author" onClick={handleAuthorClick}>{author}</h4>
          <p className="post-headline">{headline}</p>
          <div className="post-time">
            <span>{timeAgo}</span>
            <span>•</span>
            <svg
              width="12"
              height="12"
              viewBox="0 0 16 16"
              fill="currentColor"
            >
              <path d="M8 1a7 7 0 1 0 0 14A7 7 0 0 0 8 1zM3 8a5 5 0 0 1 5-5v5h5a5 5 0 1 1-10 0z" />
            </svg>
          </div>
        </div>
        {post.authorId === currentUser.id && (
          <div className="post-menu-container">
            <button
              type="button"
              className="post-menu-btn"
              onClick={() => setShowMenu(!showMenu)}
            >
              ⋯
            </button>
            {showMenu && (
              <div className="post-menu-dropdown">
                <button
                  type="button"
                  className="post-menu-item"
                  onClick={handleEditPost}
                >
                  Edit Post
                </button>
                <button
                  type="button"
                  className="post-menu-item post-menu-delete"
                  onClick={handleDeletePost}
                >
                  Delete Post
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="post-description">
        {isEditing ? (
          <div className="post-edit-container">
            <textarea
              className="post-edit-textarea"
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              rows={5}
              placeholder="Edit your post..."
              aria-label="Edit post content"
            />
            <div className="post-edit-actions">
              <button
                type="button"
                className="post-edit-cancel"
                onClick={handleCancelEdit}
              >
                Cancel
              </button>
              <button
                type="button"
                className="post-edit-save"
                onClick={handleSaveEdit}
              >
                Save
              </button>
            </div>
          </div>
        ) : (
          <>
            {expanded ? description : description.slice(0, 200)}
            {description.length > 200 && (
              <span onClick={() => setExpanded(!expanded)} className="more">
                {expanded ? " ...less" : " ...more"}
              </span>
            )}
          </>
        )}
      </div>

      {image && <img className="post-image" src={image} alt="" />}

      <div className="post-stats">
        <div className="post-stats-left">
          {likeCount > 0 && (
            <>
              <span>👍</span>
              <span>{likeCount}</span>
            </>
          )}
        </div>
        <div className="post-stats-right">
          {commentCount > 0 && (
            <span className="post-stat-item">{commentCount} comments</span>
          )}
        </div>
      </div>

      <div className="post-footer">
        <button type="button" onClick={handleLike} className={liked ? "liked" : ""}>
          <svg
            className="like-icon"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M19.46 11l-3.91-3.91a7 7 0 0 1-1.69-2.74l-.49-1.47A2.76 2.76 0 0 0 10.76 1 2.75 2.75 0 0 0 8 3.74v1.12a9.19 9.19 0 0 0 .46 2.85L8.89 9H4.12A2.12 2.12 0 0 0 2 11.12a2.16 2.16 0 0 0 .92 1.76A2.11 2.11 0 0 0 2 14.62a2.14 2.14 0 0 0 1.28 2 2 2 0 0 0 .59 2.41l.08.07A2.1 2.1 0 0 0 5.37 20H20a2 2 0 0 0 2-2v-6.46a2 2 0 0 0-.54-1.54z" />
          </svg>
          Like
        </button>

        <button type="button" onClick={handleToggleComments}>
          <svg
            className="comment-icon"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M7 9h10v1H7zm0 4h7v-1H7z" />
            <path d="M20 2H4c-1.103 0-2 .897-2 2v18l5.333-4H20c1.103 0 2-.897 2-2V4c0-1.103-.897-2-2-2z" />
          </svg>
          Comment
        </button>

        {showBookButton && (
          <button type="button" onClick={handleBookService} className="book-btn">
            <svg
              className="book-icon"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V10h14v10zM9 14H7v-2h2v2zm4 0h-2v-2h2v2zm4 0h-2v-2h2v2zm-8 4H7v-2h2v2zm4 0h-2v-2h2v2zm4 0h-2v-2h2v2z" />
            </svg>
            Book Service
          </button>
        )}
      </div>

      {showComments && (
        <div className="comments-section">
          <div className="comment-input-container">
            <div className="comment-avatar">
              {currentUser.avatarUrl ? (
                <img src={currentUser.avatarUrl} alt={currentUser.name} />
              ) : (
                currentUser.name.charAt(0)
              )}
            </div>
            <div className="comment-input-wrapper">
              <input
                type="text"
                className="comment-input"
                placeholder="Add a comment..."
                value={commentText}
                onChange={handleCommentChange}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && commentText.trim()) {
                    handleAddComment();
                  }
                }}
              />
              {commentText && (
                <button
                  type="button"
                  className="comment-post-btn"
                  onClick={handleAddComment}
                >
                  Post
                </button>
              )}
            </div>
          </div>

          {commentError && <div className="comment-error">{commentError}</div>}

          <div className="comment-char-count">
            {commentText.length}/{MAX_COMMENT_LENGTH}
          </div>

          <div className="comments-list">
            {comments.length === 0 ? (
              <div className="no-comments">No comments yet. Be the first to comment!</div>
            ) : (
              comments.map((comment) => (
                <div key={comment.id} className="comment-item">
                  <div className="comment-avatar">
                    {comment.authorAvatar ? (
                      <img src={comment.authorAvatar} alt={comment.author} />
                    ) : (
                      comment.author.charAt(0)
                    )}
                  </div>
                  <div className="comment-content">
                    <div className="comment-header">
                      <div className="comment-author-info">
                        <span className="comment-author">{comment.author}</span>
                        <span className="comment-timestamp">{comment.timestamp}</span>
                      </div>
                      {comment.author === currentUser.name && (
                        <div className="comment-actions">
                          <button
                            type="button"
                            className="comment-edit"
                            onClick={() => handleEditComment(comment.id, comment.text)}
                            title="Edit comment"
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            className="comment-delete"
                            onClick={() => handleDeleteComment(comment.id)}
                            title="Delete comment"
                          >
                            Delete
                          </button>
                        </div>
                      )}
                    </div>
                    {editingCommentId === comment.id ? (
                      <div className="comment-edit-container">
                        <input
                          type="text"
                          className="comment-edit-input"
                          value={editCommentText}
                          onChange={(e) => setEditCommentText(e.target.value.slice(0, MAX_COMMENT_LENGTH))}
                          placeholder="Edit your comment..."
                          autoFocus
                        />
                        <div className="comment-edit-char-count">
                          {editCommentText.length}/{MAX_COMMENT_LENGTH}
                        </div>
                        <div className="comment-edit-actions">
                          <button
                            type="button"
                            className="comment-edit-cancel"
                            onClick={handleCancelCommentEdit}
                          >
                            Cancel
                          </button>
                          <button
                            type="button"
                            className="comment-edit-save"
                            onClick={handleSaveCommentEdit}
                            disabled={!editCommentText.trim()}
                          >
                            Save
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="comment-text">{comment.text}</div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewPost;
