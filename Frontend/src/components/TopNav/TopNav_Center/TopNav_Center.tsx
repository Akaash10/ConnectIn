import { useState, useEffect } from "react";
import "./TopNav_Center.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHouse,
  faUserGroup,
  faBriefcase,
  faCalendarCheck,
} from "@fortawesome/free-solid-svg-icons";

type ActiveView = "home" | "mynetwork" | "service" | "bookings" | "profile";

const TopNavCenter = () => {
  const [activeView, setActiveView] = useState<ActiveView>(() => {
    const savedView = sessionStorage.getItem("activeView");
    return (savedView as ActiveView) || "home";
  });

  // Listen for navigation events to sync highlighting
  useEffect(() => {
    const handleNavigationSync = (event: CustomEvent<ActiveView>) => {
      setActiveView(event.detail);
    };

    const handleProfileViewSync = () => {
      setActiveView("profile");
    };

    window.addEventListener("navigate" as any, handleNavigationSync);
    window.addEventListener("viewProfile" as any, handleProfileViewSync);

    return () => {
      window.removeEventListener("navigate" as any, handleNavigationSync);
      window.removeEventListener("viewProfile" as any, handleProfileViewSync);
    };
  }, []);

  const handleNavigation = (view: ActiveView) => {
    setActiveView(view);
    // Dispatch custom event for Content component to listen to
    const event = new CustomEvent("navigate", { detail: view });
    window.dispatchEvent(event);
  };

  return (
    <nav className="topnav-center">
      <div
        className={`nav-item ${activeView === "home" ? "active" : ""}`}
        onClick={() => handleNavigation("home")}
      >
        <FontAwesomeIcon icon={faHouse} />
        <span>Home</span>
      </div>

      <div
        className={`nav-item ${activeView === "mynetwork" ? "active" : ""}`}
        onClick={() => handleNavigation("mynetwork")}
      >
        <FontAwesomeIcon icon={faUserGroup} />
        <span>My Network</span>
      </div>

      <div
        className={`nav-item ${activeView === "service" ? "active" : ""}`}
        onClick={() => handleNavigation("service")}
      >
        <FontAwesomeIcon icon={faBriefcase} />
        <span>Service</span>
      </div>

      <div
        className={`nav-item ${activeView === "bookings" ? "active" : ""}`}
        onClick={() => handleNavigation("bookings")}
      >
        <FontAwesomeIcon icon={faCalendarCheck} />
        <span>My Bookings</span>
      </div>
    </nav>
  );
};

export default TopNavCenter;
