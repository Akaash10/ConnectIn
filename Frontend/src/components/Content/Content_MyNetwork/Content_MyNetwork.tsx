import { useState } from "react";
import ConnectionRequests from "./ConnectionRequests/ConnectionRequests";
import ConnectedPeople from "./ConnectedPeople/ConnectedPeople";
import SuggestedConnections from "./SuggestedConnections/SuggestedConnections";
import "./Content_MyNetwork.css";

const ContentMyNetwork = () => {
  const [activeTab, setActiveTab] = useState<"requests" | "connected">("requests");

  return (
    <div className="content-mynetwork">
      <div className="network-tabs">
        <button
          type="button"
          className={`network-tab ${activeTab === "requests" ? "active" : ""}`}
          onClick={() => setActiveTab("requests")}
        >
          Requests
        </button>
        <button
          type="button"
          className={`network-tab ${activeTab === "connected" ? "active" : ""}`}
          onClick={() => setActiveTab("connected")}
        >
          Connected People
        </button>
      </div>

      <div className="network-content">
        {activeTab === "requests" ? <ConnectionRequests /> : <ConnectedPeople />}
      </div>

      <SuggestedConnections />
    </div>
  );
};

export default ContentMyNetwork;
