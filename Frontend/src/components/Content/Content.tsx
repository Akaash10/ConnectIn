import { useState, useEffect } from "react";
import "./Content.css";
import ContentLeft from "./ContentLeft/ContentLeft";
import ContentCenter from "./ContentCenter/ContentCenter";
import ContentRight from "./ContentRight/ContentRight";

export type ActiveView = "home" | "mynetwork" | "service" | "bookings" | "profile";

const Content = () => {
  const [activeView, setActiveView] = useState<ActiveView>(() => {
    // Get saved view from sessionStorage (persists within session, not across browser restarts)
    const savedView = sessionStorage.getItem("activeView");
    return (savedView as ActiveView) || "home";
  });
  const [profileUserId, setProfileUserId] = useState<number | undefined>(() => {
    const savedUserId = sessionStorage.getItem("profileUserId");
    return savedUserId ? parseInt(savedUserId) : undefined;
  });

  // Initialize sample data on first load
  useEffect(() => {
    const initialized = localStorage.getItem("dataInitialized");
    if (!initialized) {
      // Sample connection requests
      const sampleRequests = [
        {
          id: 1,
          name: "Sameena Jahir",
          headline: "Aspiring Cybersecurity Analyst | CSE Cybersecurity Student | Python Basics | DCA",
          avatarUrl: null,
          mutualConnections: 4,
        },
        {
          id: 2,
          name: "NITISH R.G.",
          headline: "IITM 29' BS Data Science | SIET 29' BE CSE",
          avatarUrl: null,
          mutualConnections: 18,
        },
        {
          id: 3,
          name: "Surya S",
          headline: "Software Developer | Java | DSA | PHP | SQL | MySQL | 300+ LeetCode Challenges",
          avatarUrl: null,
          mutualConnections: 2,
        },
      ];
      localStorage.setItem("connectionRequests", JSON.stringify(sampleRequests));

      // Sample connections
      const sampleConnections = [
        {
          id: 4,
          name: "Shreyas Senthilkumar",
          headline: "Master's in Data Science | RMIT University | B.E. Computer Science",
          avatarUrl: null,
          mutualConnections: 15,
          connectedDate: "2024-01-15",
        },
        {
          id: 5,
          name: "Greeti Antony",
          headline: "Student at Sri Shakthi Institute of Engineering",
          avatarUrl: null,
          mutualConnections: 22,
          connectedDate: "2024-02-10",
        },
        {
          id: 6,
          name: "Dhanaprakash R",
          headline: "Software Developer Junior",
          avatarUrl: null,
          mutualConnections: 8,
          connectedDate: "2024-03-05",
        },
        {
          id: 7,
          name: "Swetha Sridharan",
          headline: "Software Engineering Student",
          avatarUrl: null,
          mutualConnections: 12,
          connectedDate: "2024-03-20",
        },
      ];
      localStorage.setItem("myConnections", JSON.stringify(sampleConnections));

      localStorage.setItem("dataInitialized", "true");
    }
  }, []);

  // Save active view and profile user ID to sessionStorage
  useEffect(() => {
    sessionStorage.setItem("activeView", activeView);
    if (profileUserId !== undefined) {
      sessionStorage.setItem("profileUserId", profileUserId.toString());
    } else {
      sessionStorage.removeItem("profileUserId");
    }
  }, [activeView, profileUserId]);

  // Listen for navigation events from TopNav
  useEffect(() => {
    const handleNavigation = (event: CustomEvent<ActiveView>) => {
      setActiveView(event.detail);
      setProfileUserId(undefined); // Reset profile user ID when navigating normally
    };

    const handleViewProfile = (event: CustomEvent<number>) => {
      setProfileUserId(event.detail);
      setActiveView("profile");
    };

    window.addEventListener("navigate" as any, handleNavigation);
    window.addEventListener("viewProfile" as any, handleViewProfile);
    return () => {
      window.removeEventListener("navigate" as any, handleNavigation);
      window.removeEventListener("viewProfile" as any, handleViewProfile);
    };
  }, []);

  return (
    <div className="content">
      <ContentLeft />
      <ContentCenter activeView={activeView} profileUserId={profileUserId} />
      <ContentRight />
    </div>
  );
};

export default Content;
