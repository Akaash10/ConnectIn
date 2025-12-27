import ContentHome from "../Content_Home/Content_Home";
import ContentMyNetwork from "../Content_MyNetwork/Content_MyNetwork";
import ContentServices from "../Content_Services/Content_Services";
import ContentBookings from "../Content_Bookings/Content_Bookings";
import ContentProfile from "../Content_Profile/Content_Profile";
import "./ContentCenter.css";
import type { ActiveView } from "../Content";

interface ContentCenterProps {
  activeView: ActiveView;
  profileUserId?: number;
}

const ContentCenter = ({ activeView, profileUserId }: ContentCenterProps) => {
  const renderContent = () => {
    switch (activeView) {
      case "home":
        return <ContentHome />;
      case "mynetwork":
        return <ContentMyNetwork />;
      case "service":
        return <ContentServices />;
      case "bookings":
        return <ContentBookings />;
      case "profile":
        return <ContentProfile userId={profileUserId} />;
      default:
        return <ContentHome />;
    }
  };

  return (
    <main className="content-center">
      {renderContent()}
    </main>
  );
};

export default ContentCenter;
