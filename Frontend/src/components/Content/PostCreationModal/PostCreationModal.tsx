import { useState } from "react";
import "./PostCreationModal.css";
import { showNotification } from "../../Notification/Notification";

interface PostCreationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PostCreationModal = ({ isOpen, onClose }: PostCreationModalProps) => {
  const [text, setText] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [fileType, setFileType] = useState<"image" | "video" | null>(null);
  const [tradeCategory, setTradeCategory] = useState<string>("");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  // Get user data from localStorage
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

  const tradeCategories = [
    "General",
    "Carpenter",
    "Plumber",
    "Electrician",
    "Painter",
    "Mason",
    "HVAC Technician",
    "Landscaper",
    "Cleaner",
    "Other Services"
  ];

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>, type: "image" | "video") => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setFileType(type);
      const reader = new FileReader();
      reader.onloadend = () => {
        setFilePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setFilePreview(null);
    setFileType(null);
  };

  const handlePost = async () => {
    if (!text.trim() && !selectedFile) return;

    setIsUploading(true);
    setUploadProgress(0);

    // Simulate upload progress
    const uploadInterval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 90) {
          clearInterval(uploadInterval);
          return 90;
        }
        return prev + 10;
      });
    }, 100);

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1200));

    clearInterval(uploadInterval);
    setUploadProgress(100);

    const posts = JSON.parse(localStorage.getItem("myPosts") || "[]");
    const newPost = {
      id: Date.now(),
      authorId: currentUser.id,
      author: currentUser.name,
      authorAvatar: currentUser.avatarUrl,
      headline: currentUser.headline,
      timeAgo: "Just now",
      description: text,
      image: filePreview,
      tradeCategory: tradeCategory || "General",
      likes: 0,
      comments: 0,
      isMyPost: true,
    };

    localStorage.setItem("myPosts", JSON.stringify([newPost, ...posts]));

    // Show success notification
    showNotification("success", "Your post has been published successfully!");

    // Also add to notification center for later viewing
    const notifications = JSON.parse(localStorage.getItem("notifications") || "[]");
    notifications.unshift({
      id: Date.now(),
      type: "post_created",
      message: "Your post has been published successfully",
      timestamp: new Date().toISOString(),
      read: false,
    });
    localStorage.setItem("notifications", JSON.stringify(notifications));
    window.dispatchEvent(new Event("notificationAdded"));

    setTimeout(() => {
      setText("");
      setSelectedFile(null);
      setFilePreview(null);
      setFileType(null);
      setTradeCategory("");
      setIsUploading(false);
      setUploadProgress(0);
      onClose();
      window.location.reload();
    }, 500);
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={isUploading ? undefined : onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {isUploading && (
          <div className="upload-overlay">
            <div className="upload-progress-container">
              <div className="upload-spinner"></div>
              <div className="upload-text">Uploading your post...</div>
              <div className="progress-bar">
                <div
                  className="progress-fill"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
              <div className="upload-percentage">{uploadProgress}%</div>
            </div>
          </div>
        )}
        <div className="modal-header">
          <h2>Create a post</h2>
          <button
            type="button"
            className="modal-close"
            onClick={onClose}
            disabled={isUploading}
          >
            ×
          </button>
        </div>

        <div className="modal-body">
          <div className="modal-user-info">
            <div className="modal-avatar">
              {currentUser.avatarUrl ? (
                <img src={currentUser.avatarUrl} alt={currentUser.name} />
              ) : (
                currentUser.name.charAt(0)
              )}
            </div>
            <div>
              <div className="modal-user-name">{currentUser.name}</div>
              <div className="modal-user-headline">{currentUser.headline}</div>
            </div>
          </div>

          <textarea
            className="modal-textarea"
            placeholder="What do you want to talk about?"
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={8}
            autoFocus
          />

          <div className="modal-trade-selector">
            <label htmlFor="trade-category">Service Category:</label>
            <select
              id="trade-category"
              className="trade-dropdown"
              value={tradeCategory}
              onChange={(e) => setTradeCategory(e.target.value)}
            >
              <option value="">Select a category (optional)</option>
              {tradeCategories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          {filePreview && (
            <div className="modal-file-preview">
              {fileType === "image" ? (
                <img src={filePreview} alt="Preview" />
              ) : (
                <video src={filePreview} controls />
              )}
              <button
                type="button"
                className="remove-file-btn"
                onClick={handleRemoveFile}
              >
                ×
              </button>
            </div>
          )}

          <div className="modal-actions">
            <label className="modal-action-btn">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleFileSelect(e, "image")}
                style={{ display: "none" }}
              />
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
            </label>

            <label className="modal-action-btn">
              <input
                type="file"
                accept="video/*"
                onChange={(e) => handleFileSelect(e, "video")}
                style={{ display: "none" }}
              />
              <svg
                className="action-icon-video"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M19 4H5a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h14a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3zm-9 12V8l6 4z" />
              </svg>
              Video
            </label>
          </div>
        </div>

        <div className="modal-footer">
          <button
            type="button"
            className="modal-post-btn"
            onClick={handlePost}
            disabled={(!text.trim() && !selectedFile) || isUploading}
          >
            {isUploading ? "Posting..." : "Post"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PostCreationModal;
