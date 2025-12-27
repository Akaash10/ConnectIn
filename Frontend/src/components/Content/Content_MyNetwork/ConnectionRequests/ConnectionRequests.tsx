import { useState, useEffect } from "react";
import "./ConnectionRequests.css";
import { showNotification } from "../../../Notification/Notification";

interface ConnectionRequest {
  id: number;
  name: string;
  headline: string;
  avatarUrl: string | null;
  mutualConnections: number;
}

const ConnectionRequests = () => {
  const [requests, setRequests] = useState<ConnectionRequest[]>([]);

  useEffect(() => {
    // Load requests from localStorage (will be replaced by API)
    const storedRequests = JSON.parse(
      localStorage.getItem("connectionRequests") || "[]"
    );
    setRequests(storedRequests);
  }, []);

  const handleAccept = (requestId: number) => {
    const request = requests.find((r) => r.id === requestId);
    if (!request) return;

    // Remove from requests
    const updatedRequests = requests.filter((r) => r.id !== requestId);
    setRequests(updatedRequests);
    localStorage.setItem("connectionRequests", JSON.stringify(updatedRequests));

    // Add to connections
    const connections = JSON.parse(localStorage.getItem("myConnections") || "[]");
    connections.push({ ...request, connectedDate: new Date().toISOString() });
    localStorage.setItem("myConnections", JSON.stringify(connections));

    // Show notification
    showNotification("success", `You are now connected with ${request.name}`);

    // Add to notification center
    const notifications = JSON.parse(localStorage.getItem("notifications") || "[]");
    notifications.unshift({
      id: Date.now(),
      type: "connection_accepted",
      message: `You are now connected with ${request.name}`,
      timestamp: new Date().toISOString(),
      read: false,
    });
    localStorage.setItem("notifications", JSON.stringify(notifications));
  };

  const handleIgnore = (requestId: number) => {
    const updatedRequests = requests.filter((r) => r.id !== requestId);
    setRequests(updatedRequests);
    localStorage.setItem("connectionRequests", JSON.stringify(updatedRequests));
  };

  if (requests.length === 0) {
    return (
      <div className="no-requests">
        <p>No pending connection requests</p>
      </div>
    );
  }

  return (
    <div className="connection-requests">
      <h2 className="section-title">Connection Requests ({requests.length})</h2>
      <div className="requests-grid">
        {requests.map((request) => (
          <div key={request.id} className="request-card">
            <div className="request-avatar">
              {request.avatarUrl ? (
                <img src={request.avatarUrl} alt={request.name} />
              ) : (
                request.name.charAt(0)
              )}
            </div>
            <div className="request-info">
              <h3 className="request-name">{request.name}</h3>
              <p className="request-headline">{request.headline}</p>
              <p className="request-mutual">
                {request.mutualConnections} mutual connection
                {request.mutualConnections !== 1 ? "s" : ""}
              </p>
            </div>
            <div className="request-actions">
              <button
                type="button"
                className="request-btn accept"
                onClick={() => handleAccept(request.id)}
              >
                Accept
              </button>
              <button
                type="button"
                className="request-btn ignore"
                onClick={() => handleIgnore(request.id)}
              >
                Ignore
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ConnectionRequests;
