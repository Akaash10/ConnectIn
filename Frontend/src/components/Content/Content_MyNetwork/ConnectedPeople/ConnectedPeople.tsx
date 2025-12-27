import { useState, useEffect } from "react";
import "./ConnectedPeople.css";

interface Connection {
  id: number;
  name: string;
  headline: string;
  avatarUrl: string | null;
  mutualConnections: number;
  connectedDate?: string;
}

const ConnectedPeople = () => {
  const [connections, setConnections] = useState<Connection[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    // Load connections from localStorage (will be replaced by API)
    const storedConnections = JSON.parse(
      localStorage.getItem("myConnections") || "[]"
    );
    setConnections(storedConnections);
  }, []);

  const filteredConnections = connections.filter((conn) =>
    conn.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleMessage = (connectionId: number) => {
    console.log("Message connection:", connectionId);
    // Will implement messaging later
  };

  if (connections.length === 0) {
    return (
      <div className="no-connections">
        <p>You don't have any connections yet</p>
        <p className="no-connections-sub">
          Connect with people you know to expand your network
        </p>
      </div>
    );
  }

  return (
    <div className="connected-people">
      <div className="connections-header">
        <h2 className="section-title">{connections.length} Connections</h2>
        <input
          type="text"
          className="search-connections"
          placeholder="Search connections..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="connections-grid">
        {filteredConnections.length === 0 ? (
          <div className="no-results">No connections found</div>
        ) : (
          filteredConnections.map((connection) => (
            <div key={connection.id} className="connection-card">
              <div className="connection-avatar">
                {connection.avatarUrl ? (
                  <img src={connection.avatarUrl} alt={connection.name} />
                ) : (
                  connection.name.charAt(0)
                )}
              </div>
              <div className="connection-info">
                <h3 className="connection-name">{connection.name}</h3>
                <p className="connection-headline">{connection.headline}</p>
                <p className="connection-mutual">
                  {connection.mutualConnections} mutual connection
                  {connection.mutualConnections !== 1 ? "s" : ""}
                </p>
              </div>
              <button
                type="button"
                className="message-btn"
                onClick={() => handleMessage(connection.id)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  width="16"
                  height="16"
                >
                  <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z" />
                </svg>
                Message
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ConnectedPeople;
