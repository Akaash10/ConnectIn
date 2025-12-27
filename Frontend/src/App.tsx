import { useState, useEffect } from 'react'
import './App.css'
import Content from './components/Content/Content'
import TopNav from './components/TopNav/TopNav'
import Notification from './components/Notification/Notification'
import BookingModal from './components/BookingModal/BookingModal'

interface ServiceProvider {
  id: number;
  name: string;
  headline: string;
  avatarUrl: string | null;
  tradeCategory: string;
}

function App() {
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [selectedServiceProvider, setSelectedServiceProvider] = useState<ServiceProvider | null>(null);

  useEffect(() => {
    const handleOpenBooking = (event: CustomEvent) => {
      setSelectedServiceProvider(event.detail.serviceProvider);
      setIsBookingModalOpen(true);
    };

    window.addEventListener("openBookingModal" as any, handleOpenBooking);

    return () => {
      window.removeEventListener("openBookingModal" as any, handleOpenBooking);
    };
  }, []);

  return (
    <div>
      <TopNav />
      <Content />
      <Notification position="top-right" />
      <BookingModal
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        serviceProvider={selectedServiceProvider}
      />
    </div>
  )
}

export default App
