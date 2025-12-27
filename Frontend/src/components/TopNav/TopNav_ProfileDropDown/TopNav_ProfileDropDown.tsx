import { useEffect, useState } from "react";
import "./TopNav_ProfileDropDown.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";

const TopNavProfileDropDown = () => {
  const [currentUser, setCurrentUser] = useState<any>(null);

  const loadUser = () => {
    const user = JSON.parse(localStorage.getItem("currentUser") || JSON.stringify({
      name: "John Doe",
      headline: "Administrator",
      avatarUrl: null,
    }));
    setCurrentUser(user);
  };

  useEffect(() => {
    loadUser();

    // Listen for profile updates
    const handleProfileUpdated = () => {
      loadUser();
    };

    window.addEventListener("profileUpdated", handleProfileUpdated);
    return () => window.removeEventListener("profileUpdated", handleProfileUpdated);
  }, []);

  const handleViewProfile = () => {
    const event = new CustomEvent("navigate", { detail: "profile" });
    window.dispatchEvent(event);
  };

  if (!currentUser) return null;

  return (
    <div className="profile-dropdown">
      <div className="profile-header">
        <div className="avatar large">
          {currentUser.avatarUrl ? (
            <img src={currentUser.avatarUrl} alt={currentUser.name} />
          ) : (
            <FontAwesomeIcon icon={faUser} />
          )}
        </div>
        <div>
          <div className="profile-name">{currentUser.name}</div>
          <div className="profile-role">
            {currentUser.headline}
          </div>
        </div>
      </div>

      <button type="button" className="view-profile-btn" onClick={handleViewProfile}>
        View profile
      </button>

      <div className="divider" />

      <div className="dropdown-item signout">Sign Out</div>
    </div>
  );
};

export default TopNavProfileDropDown;
