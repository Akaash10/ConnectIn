import { useState, useEffect } from "react";
import "./ProfileEditModal.css";

interface ProfileEditModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ProfileEditModal = ({ isOpen, onClose }: ProfileEditModalProps) => {
  const [name, setName] = useState("");
  const [headline, setHeadline] = useState("");
  const [location, setLocation] = useState("");
  const [bio, setBio] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const MAX_NAME_LENGTH = 100;
  const MAX_HEADLINE_LENGTH = 220;
  const MAX_LOCATION_LENGTH = 100;
  const MAX_BIO_LENGTH = 2600;

  useEffect(() => {
    if (isOpen) {
      const currentUser = JSON.parse(localStorage.getItem("currentUser") || "{}");
      setName(currentUser.name || "");
      setHeadline(currentUser.headline || "");
      setLocation(currentUser.location || "");
      setBio(currentUser.bio || "");
      setAvatarUrl(currentUser.avatarUrl || "");
    }
  }, [isOpen]);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveAvatar = () => {
    setAvatarUrl("");
  };

  const handleSave = () => {
    if (!name.trim()) {
      alert("Name is required");
      return;
    }

    setIsSaving(true);

    const currentUser = JSON.parse(localStorage.getItem("currentUser") || "{}");
    const updatedUser = {
      ...currentUser,
      name: name.trim(),
      headline: headline.trim(),
      location: location.trim(),
      bio: bio.trim(),
      avatarUrl: avatarUrl || null,
    };

    localStorage.setItem("currentUser", JSON.stringify(updatedUser));

    // Dispatch event to notify other components
    const event = new CustomEvent("profileUpdated");
    window.dispatchEvent(event);

    setTimeout(() => {
      setIsSaving(false);
      onClose();
      window.location.reload(); // Reload to update all instances
    }, 500);
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Edit Profile</h2>
          <button type="button" className="modal-close" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="modal-body">
          {/* Avatar Section */}
          <div className="edit-field avatar-field">
            <label>Profile Photo</label>
            <div className="avatar-upload-container">
              <div className="avatar-preview">
                {avatarUrl ? (
                  <img src={avatarUrl} alt="Profile" />
                ) : (
                  <div className="avatar-placeholder">{name.charAt(0) || "U"}</div>
                )}
              </div>
              <div className="avatar-actions">
                <label htmlFor="avatar-upload" className="avatar-upload-btn">
                  Upload Photo
                </label>
                <input
                  id="avatar-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  style={{ display: "none" }}
                />
                {avatarUrl && (
                  <button
                    type="button"
                    className="avatar-remove-btn"
                    onClick={handleRemoveAvatar}
                  >
                    Remove
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Name Field */}
          <div className="edit-field">
            <label htmlFor="name">
              Name <span className="required">*</span>
            </label>
            <input
              id="name"
              type="text"
              className="edit-input"
              value={name}
              onChange={(e) => setName(e.target.value.slice(0, MAX_NAME_LENGTH))}
              placeholder="Your name"
            />
            <span className="char-count">
              {name.length}/{MAX_NAME_LENGTH}
            </span>
          </div>

          {/* Headline Field */}
          <div className="edit-field">
            <label htmlFor="headline">Headline</label>
            <input
              id="headline"
              type="text"
              className="edit-input"
              value={headline}
              onChange={(e) => setHeadline(e.target.value.slice(0, MAX_HEADLINE_LENGTH))}
              placeholder="e.g., Software Engineer at Company"
            />
            <span className="char-count">
              {headline.length}/{MAX_HEADLINE_LENGTH}
            </span>
          </div>

          {/* Location Field */}
          <div className="edit-field">
            <label htmlFor="location">Location</label>
            <input
              id="location"
              type="text"
              className="edit-input"
              value={location}
              onChange={(e) => setLocation(e.target.value.slice(0, MAX_LOCATION_LENGTH))}
              placeholder="e.g., New York, NY"
            />
            <span className="char-count">
              {location.length}/{MAX_LOCATION_LENGTH}
            </span>
          </div>

          {/* Bio Field */}
          <div className="edit-field">
            <label htmlFor="bio">About</label>
            <textarea
              id="bio"
              className="edit-textarea"
              value={bio}
              onChange={(e) => setBio(e.target.value.slice(0, MAX_BIO_LENGTH))}
              placeholder="Write about yourself..."
              rows={5}
            />
            <span className="char-count">
              {bio.length}/{MAX_BIO_LENGTH}
            </span>
          </div>
        </div>

        <div className="modal-footer">
          <button type="button" className="btn-cancel" onClick={onClose}>
            Cancel
          </button>
          <button
            type="button"
            className="btn-save"
            onClick={handleSave}
            disabled={isSaving || !name.trim()}
          >
            {isSaving ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileEditModal;
