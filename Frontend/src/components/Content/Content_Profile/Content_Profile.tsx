import { useState, useEffect } from "react";
import "./Content_Profile.css";
import ViewPost from "../ViewPost/ViewPost";
import ProfileEditModal from "../ProfileEditModal/ProfileEditModal";

interface ProfileProps {
  userId?: number;
}

const Content_Profile = ({ userId }: ProfileProps) => {
  const [user, setUser] = useState<any>(null);
  const [userPosts, setUserPosts] = useState<any[]>([]);
  const [isOwnProfile, setIsOwnProfile] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const loadUserData = () => {
    // Get current user
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

    // If no userId provided, show current user's profile
    if (!userId || userId === currentUser.id) {
      setUser(currentUser);
      setIsOwnProfile(true);

      // Get user's posts
      const myPosts = JSON.parse(localStorage.getItem("myPosts") || "[]");
      setUserPosts(myPosts);
    } else {
      // Load other user's profile by finding their posts
      const myPosts = JSON.parse(localStorage.getItem("myPosts") || "[]");

      // Find a post by this user to get their info
      const userPost = myPosts.find((p: any) => p.authorId === userId);

      if (userPost) {
        // Create user object from post data
        const otherUser = {
          id: userPost.authorId,
          name: userPost.author,
          headline: userPost.headline || "Professional",
          avatarUrl: userPost.authorAvatar || null,
          location: "",
          bio: "",
          connections: 0,
          profileViews: 0,
        };
        setUser(otherUser);

        // Get all posts by this user
        const usersPosts = myPosts.filter((p: any) => p.authorId === userId);
        setUserPosts(usersPosts);
      } else {
        // User not found, show default
        setUser({
          id: userId,
          name: "User",
          headline: "Professional",
          avatarUrl: null,
          location: "",
          bio: "",
          connections: 0,
          profileViews: 0,
        });
        setUserPosts([]);
      }
      setIsOwnProfile(false);
    }
  };

  useEffect(() => {
    loadUserData();

    // Listen for post updates
    const handlePostsUpdated = () => {
      loadUserData();
    };

    // Listen for profile updates
    const handleProfileUpdated = () => {
      loadUserData();
    };

    window.addEventListener("postsUpdated", handlePostsUpdated);
    window.addEventListener("profileUpdated", handleProfileUpdated);
    return () => {
      window.removeEventListener("postsUpdated", handlePostsUpdated);
      window.removeEventListener("profileUpdated", handleProfileUpdated);
    };
  }, [userId]);

  if (!user) {
    return (
      <div className="content-profile">
        <div className="profile-loading">Loading profile...</div>
      </div>
    );
  }

  return (
    <div className="content-profile">
      {/* Cover and Avatar Section */}
      <div className="profile-header">
        <div className="profile-cover"></div>
        <div className="profile-info-container">
          <div className="profile-avatar-section">
            <div className="profile-avatar">
              {user.avatarUrl ? (
                <img src={user.avatarUrl} alt={user.name} />
              ) : (
                user.name.charAt(0)
              )}
            </div>
          </div>
          <div className="profile-details">
            <h1 className="profile-name">{user.name}</h1>
            <p className="profile-headline">{user.headline}</p>
            {user.location && (
              <p className="profile-location">{user.location}</p>
            )}
            <div className="profile-stats">
              <div className="profile-stat">
                <span className="stat-value">{user.connections || 0}</span>
                <span className="stat-label">Connections</span>
              </div>
              <div className="profile-stat">
                <span className="stat-value">{user.profileViews || 0}</span>
                <span className="stat-label">Profile Views</span>
              </div>
            </div>
          </div>
          {isOwnProfile && (
            <button
              type="button"
              className="profile-edit-btn"
              onClick={() => setIsEditModalOpen(true)}
            >
              Edit Profile
            </button>
          )}
        </div>
      </div>

      {/* About Section */}
      {user.bio && (
        <div className="profile-section">
          <h2>About</h2>
          <p className="profile-bio">{user.bio}</p>
        </div>
      )}

      {/* Activity Section */}
      <div className="profile-section">
        <div className="section-header">
          <h2>Activity</h2>
          <span className="post-count">{userPosts.length} posts</span>
        </div>
        <div className="profile-posts">
          {userPosts.length === 0 ? (
            <div className="no-posts">
              <div className="no-posts-icon">📝</div>
              <p>{isOwnProfile ? "You haven't posted anything yet" : "No posts to display"}</p>
            </div>
          ) : (
            userPosts.map((post) => (
              <ViewPost key={post.id} post={post} isProfilePage={true} />
            ))
          )}
        </div>
      </div>

      {/* Edit Profile Modal */}
      <ProfileEditModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
      />
    </div>
  );
};

export default Content_Profile;
