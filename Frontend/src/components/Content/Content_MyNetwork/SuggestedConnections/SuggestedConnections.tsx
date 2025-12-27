import { useState } from "react";
import "./SuggestedConnections.css";
import { showNotification } from "../../../Notification/Notification";

interface SuggestedConnection {
  id: number;
  name: string;
  headline: string;
  avatarUrl: string | null;
  mutualConnections: number;
}

// Sample data (will be replaced by API)
const initialSuggestions: SuggestedConnection[] = [
  {
    id: 1,
    name: "Sowndharya A",
    headline: "Computer Science Engineering Student | SIET",
    avatarUrl: null,
    mutualConnections: 1,
  },
  {
    id: 2,
    name: "Vibin Kumar",
    headline: "Software Engineer",
    avatarUrl: null,
    mutualConnections: 11,
  },
  {
    id: 3,
    name: "Arvindhan S P",
    headline: "Exploring new job opportunities or internship programs",
    avatarUrl: null,
    mutualConnections: 16,
  },
  {
    id: 4,
    name: "Rakshana Velumayil",
    headline: "Student at Sri Shakthi Institute of Engineering",
    avatarUrl: null,
    mutualConnections: 37,
  },
];

const SuggestedConnections = () => {
  const [suggestions, setSuggestions] = useState<SuggestedConnection[]>(initialSuggestions);
  const [sentRequests, setSentRequests] = useState<Set<number>>(new Set());

  const handleConnect = (suggestionId: number) => {
    const suggestion = suggestions.find((s) => s.id === suggestionId);
    if (!suggestion) return;

    // Mark as sent
    setSentRequests(new Set(sentRequests).add(suggestionId));

    // Show notification
    showNotification("success", `Connection request sent to ${suggestion.name}`);

    // Add to notification center
    const notifications = JSON.parse(localStorage.getItem("notifications") || "[]");
    notifications.unshift({
      id: Date.now(),
      type: "request_sent",
      message: `Connection request sent to ${suggestion.name}`,
      timestamp: new Date().toISOString(),
      read: false,
    });
    localStorage.setItem("notifications", JSON.stringify(notifications));

    // Simulate sending request (in real app, would call API)
    setTimeout(() => {
      // Remove from suggestions after animation
      setSuggestions(suggestions.filter((s) => s.id !== suggestionId));
      setSentRequests((prev) => {
        const newSet = new Set(prev);
        newSet.delete(suggestionId);
        return newSet;
      });
    }, 2000);
  };

  const handleDismiss = (suggestionId: number) => {
    setSuggestions(suggestions.filter((s) => s.id !== suggestionId));
  };

  if (suggestions.length === 0) {
    return null;
  }

  return (
    <div className="suggested-connections">
      <h2 className="section-title">People you may know</h2>
      <div className="suggestions-grid">
        {suggestions.map((suggestion) => (
          <div key={suggestion.id} className="suggestion-card">
            <button
              type="button"
              className="dismiss-btn"
              onClick={() => handleDismiss(suggestion.id)}
              title="Dismiss"
            >
              ×
            </button>
            <div className="suggestion-avatar">
              {suggestion.avatarUrl ? (
                <img src={suggestion.avatarUrl} alt={suggestion.name} />
              ) : (
                suggestion.name.charAt(0)
              )}
            </div>
            <div className="suggestion-info">
              <h3 className="suggestion-name">{suggestion.name}</h3>
              <p className="suggestion-headline">{suggestion.headline}</p>
              <p className="suggestion-mutual">
                {suggestion.mutualConnections} mutual connection
                {suggestion.mutualConnections !== 1 ? "s" : ""}
              </p>
            </div>
            <button
              type="button"
              className={`connect-btn ${sentRequests.has(suggestion.id) ? "sent" : ""}`}
              onClick={() => handleConnect(suggestion.id)}
              disabled={sentRequests.has(suggestion.id)}
            >
              {sentRequests.has(suggestion.id) ? (
                <>
                  <svg
                    className="check-icon"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    width="16"
                    height="16"
                  >
                    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                  </svg>
                  Request Sent
                </>
              ) : (
                "Connect"
              )}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SuggestedConnections;
