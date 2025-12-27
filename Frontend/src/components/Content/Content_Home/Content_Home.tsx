import CreatePost from "../CreatePost/CreatePost";
import MyPosts from "../MyPosts/MyPosts";
import PostList from "../PostList/PostList";
import "./Content_Home.css";

const ContentHome = () => {
  return (
    <div className="content-home">
      <CreatePost />
      <MyPosts />
      <PostList />
    </div>
  );
};

export default ContentHome;
