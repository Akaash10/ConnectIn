import { useState, useEffect } from "react";
import "./ContentLeft.css";

const ContentLeft = () => {
  const [profile, setProfile] = useState<any>(null);
  const [quickServices, setQuickServices] = useState({
    bookingRequests: 0,
    connections: 0,
    connectionRequests: 0
  });

  const loadProfile = () => {
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
    setProfile(currentUser);

    // Save to localStorage if it doesn't exist
    if (!localStorage.getItem("currentUser")) {
      localStorage.setItem("currentUser", JSON.stringify(currentUser));
    }
  };

  useEffect(() => {
    loadProfile();
    loadQuickServices();

    // Listen for profile updates
    const handleProfileUpdated = () => {
      loadProfile();
    };

    window.addEventListener("profileUpdated", handleProfileUpdated);
    return () => window.removeEventListener("profileUpdated", handleProfileUpdated);
  }, []);

  const loadQuickServices = () => {
    const bookings = JSON.parse(localStorage.getItem("bookings") || "[]");
    const myConnections = JSON.parse(localStorage.getItem("myConnections") || "[]");
    const connectionRequests = JSON.parse(localStorage.getItem("connectionRequests") || "[]");

    // Count pending booking requests (where current user is service provider)
    const pendingBookingRequests = bookings.filter(
      (b: any) => b.serviceProviderId === profile?.id && b.status === "pending"
    ).length;

    setQuickServices({
      bookingRequests: pendingBookingRequests,
      connections: myConnections.length,
      connectionRequests: connectionRequests.length
    });
  };

  const handleProfileClick = () => {
    const event = new CustomEvent("navigate", { detail: "profile" });
    window.dispatchEvent(event);
  };

  const handleNavigate = (view: string) => {
    const event = new CustomEvent("navigate", { detail: view });
    window.dispatchEvent(event);
  };

  if (!profile) return null;

  return (
    <aside className="content-left">
      <div className="profile-card">
        <div className="profile-cover" onClick={handleProfileClick}></div>
        <div className="profile-info">
          <div className="profile-avatar" onClick={handleProfileClick}>
            {profile.avatarUrl ? (
              <img src={profile.avatarUrl} alt={profile.name} />
            ) : (
              profile.name.charAt(0)
            )}
          </div>
          <h3 className="profile-name" onClick={handleProfileClick}>{profile.name}</h3>
          <p className="profile-headline">{profile.headline}</p>
        </div>

        <div className="profile-divider"></div>

        <div className="quick-services">
          <h4 className="quick-services-title">Quick Access</h4>
          <div
            className="quick-service-item"
            onClick={() => handleNavigate("bookings")}
          >
            <span className="quick-service-label">Booking Requests</span>
            <span className="quick-service-value">{quickServices.bookingRequests}</span>
          </div>
          <div
            className="quick-service-item"
            onClick={() => handleNavigate("mynetwork")}
          >
            <span className="quick-service-label">Connections</span>
            <span className="quick-service-value">{quickServices.connections}</span>
          </div>
          <div
            className="quick-service-item"
            onClick={() => handleNavigate("mynetwork")}
          >
            <span className="quick-service-label">Connection Requests</span>
            <span className="quick-service-value">{quickServices.connectionRequests}</span>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default ContentLeft;
