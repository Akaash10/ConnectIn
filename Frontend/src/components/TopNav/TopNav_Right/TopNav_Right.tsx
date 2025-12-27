import { forwardRef, useState, useEffect } from "react";
import "./TopNav_Right.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import TopNavProfileDropDown from "../TopNav_ProfileDropDown/TopNav_ProfileDropDown";
type Props = {
  isOpen: boolean;
  toggle: () => void;
};

const TopNavRight = forwardRef<HTMLDivElement, Props>(
  ({ isOpen, toggle }, ref) => {
    const [profileImageUrl, setProfileImageUrl] = useState<string | null>(null);

    const loadProfileImage = () => {
      const currentUser = JSON.parse(localStorage.getItem("currentUser") || "{}");
      setProfileImageUrl(currentUser.avatarUrl || null);
    };

    useEffect(() => {
      loadProfileImage();

      // Listen for profile updates
      const handleProfileUpdated = () => {
        loadProfileImage();
      };

      window.addEventListener("profileUpdated", handleProfileUpdated);
      return () => window.removeEventListener("profileUpdated", handleProfileUpdated);
    }, []);

    return (
      <div className="topnav-right" ref={ref}>
        <div className="nav-item profile" onClick={toggle}>
          <div className="avatar">
            {profileImageUrl ? (
              <div
                className="avatar-img"
                style={{ backgroundImage: `url(${profileImageUrl})` }}
              />
            ) : (
              <FontAwesomeIcon icon={faUser} className="avatar-icon" />
            )}
          </div>
          <span>Me</span>
        </div>

        {isOpen && <TopNavProfileDropDown />}
      </div>
    );
  }
);

export default TopNavRight;
