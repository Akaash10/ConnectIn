import { useState } from "react";
import PostCreationModal from "../PostCreationModal/PostCreationModal";
import "./CreatePost.css";

const CreatePost = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // All data coming from variables (will be replaced by API calls)
  const currentUser = {
    name: "Sanjay A Kanakaraj",
    avatarUrl: null, // Will be replaced by actual image URL from API
  };

  return (
    <>
      <div className="create-post">
        <div className="create-post-top">
          <div className="create-post-avatar">
            {currentUser.avatarUrl ? (
              <img src={currentUser.avatarUrl} alt={currentUser.name} />
            ) : (
              currentUser.name.charAt(0)
            )}
          </div>
          <button
            type="button"
            className="create-post-input"
            onClick={() => setIsModalOpen(true)}
          >
            Start a post
          </button>
        </div>

        <div className="create-post-actions">
          <button
            type="button"
            className="create-post-action"
            onClick={() => setIsModalOpen(true)}
          >
            <svg
              className="action-icon-photo"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M19 4H5a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h14a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3zm1 13a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-1.09l3.29-3.3a1 1 0 0 1 1.42 0L15 18.91zm0-3.17-2.8-2.79a3 3 0 0 0-4.24 0L11.5 12.5 9.21 10.21a3 3 0 0 0-4.24 0L4 11.17V7a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1z" />
              <circle cx="8" cy="9" r="1.5" />
            </svg>
            Photo
          </button>

          <button
            type="button"
            className="create-post-action"
            onClick={() => setIsModalOpen(true)}
          >
            <svg
              className="action-icon-video"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M19 4H5a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h14a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3zm-9 12V8l6 4z" />
            </svg>
            Video
          </button>
        </div>
      </div>

      <PostCreationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
};

export default CreatePost;
