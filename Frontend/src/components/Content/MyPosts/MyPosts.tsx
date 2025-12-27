import { useState, useEffect } from "react";
import ViewPost from "../ViewPost/ViewPost";

const MyPosts = () => {
  const [myPosts, setMyPosts] = useState<any[]>([]);

  const loadPosts = () => {
    const posts = JSON.parse(localStorage.getItem("myPosts") || "[]");
    setMyPosts(posts);
  };

  useEffect(() => {
    loadPosts();

    // Listen for post updates
    const handlePostsUpdated = () => {
      loadPosts();
    };

    window.addEventListener("postsUpdated", handlePostsUpdated);
    return () => window.removeEventListener("postsUpdated", handlePostsUpdated);
  }, []);

  // If there are no posts, show empty state
  if (myPosts.length === 0) {
    return (
      <div className="post end-post">
        You haven't created any posts yet. Click "Start a post" to share your first post!
      </div>
    );
  }

  return (
    <>
      {myPosts.map((post: any) => (
        <ViewPost key={post.id} post={post} />
      ))}
    </>
  );
};

export default MyPosts;
