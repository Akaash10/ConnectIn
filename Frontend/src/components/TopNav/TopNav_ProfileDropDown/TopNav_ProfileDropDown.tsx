import { useEffect, useState } from "react";
import "./TopNav_ProfileDropDown.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { STORAGE_KEYS, CUSTOM_EVENTS, DEFAULT_USER } from "../../../constants/appConstants";

const TopNavProfileDropDown = () => {
  const [currentUser, setCurrentUser] = useState<any>(null);

  const loadUser = () => {
    const user = JSON.parse(localStorage.getItem(STORAGE_KEYS.CURRENT_USER) || JSON.stringify({
      name: DEFAULT_USER.name,
      headline: DEFAULT_USER.headline,
      avatarUrl: DEFAULT_USER.avatarUrl,
    }));
    setCurrentUser(user);
  };

  useEffect(() => {
    loadUser();

    // Listen for profile updates
    const handleProfileUpdated = () => {
      loadUser();
    };

    window.addEventListener(CUSTOM_EVENTS.PROFILE_UPDATED, handleProfileUpdated);
    return () => window.removeEventListener(CUSTOM_EVENTS.PROFILE_UPDATED, handleProfileUpdated);
  }, []);

  const handleViewProfile = () => {
    const event = new CustomEvent(CUSTOM_EVENTS.NAVIGATE, { detail: "profile" });
    window.dispatchEvent(event);
  };

  const handleSignOut = () => {
    // Clear authentication data
    localStorage.removeItem(STORAGE_KEYS.IS_AUTHENTICATED);
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);

    // Dispatch sign out event to App component
    const event = new CustomEvent(CUSTOM_EVENTS.SIGN_OUT);
    window.dispatchEvent(event);

    // Reload the page to reset state
    window.location.reload();
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

      <div className="dropdown-item signout" onClick={handleSignOut}>Sign Out</div>
    </div>
  );
};

export default TopNavProfileDropDown;
