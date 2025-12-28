import { useState, useEffect } from 'react'
import './App.css'
import Content from './components/Content/Content'
import TopNav from './components/TopNav/TopNav'
import Notification from './components/Notification/Notification'
import BookingModal from './components/BookingModal/BookingModal'
import Login from './components/Auth/Login/Login'
import Register from './components/Auth/Register/Register'
import CompleteProfile from './components/Auth/CompleteProfile/CompleteProfile'
import { ensureSampleData } from './utils/sampleData'
import { STORAGE_KEYS, CUSTOM_EVENTS } from './constants/appConstants'

interface ServiceProvider {
  id: number;
  name: string;
  headline: string;
  avatarUrl: string | null;
  tradeCategory: string;
}

type AuthView = 'login' | 'register' | 'complete-profile' | 'app';

function App() {
  const [authView, setAuthView] = useState<AuthView>('login');
  const [registrationData, setRegistrationData] = useState<any>(null);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [selectedServiceProvider, setSelectedServiceProvider] = useState<ServiceProvider | null>(null);

  useEffect(() => {
    // Check if user is already authenticated
    const isAuthenticated = localStorage.getItem(STORAGE_KEYS.IS_AUTHENTICATED);
    if (isAuthenticated === 'true') {
      setAuthView('app');
      // Initialize sample data when user is authenticated
      ensureSampleData();
    }
  }, []);

  useEffect(() => {
    const handleOpenBooking = (event: CustomEvent) => {
      setSelectedServiceProvider(event.detail.serviceProvider);
      setIsBookingModalOpen(true);
    };

    window.addEventListener(CUSTOM_EVENTS.OPEN_BOOKING_MODAL as any, handleOpenBooking);

    return () => {
      window.removeEventListener(CUSTOM_EVENTS.OPEN_BOOKING_MODAL as any, handleOpenBooking);
    };
  }, []);

  const handleLoginSuccess = () => {
    setAuthView('app');
    ensureSampleData();
  };

  const handleRegisterSuccess = (userData: any) => {
    setRegistrationData(userData);
    setAuthView('complete-profile');
  };

  const handleCompleteProfile = () => {
    setAuthView('app');
    ensureSampleData();
  };

  if (authView === 'login') {
    return (
      <Login
        onSwitchToRegister={() => setAuthView('register')}
        onLoginSuccess={handleLoginSuccess}
      />
    );
  }

  if (authView === 'register') {
    return (
      <Register
        onSwitchToLogin={() => setAuthView('login')}
        onRegisterSuccess={handleRegisterSuccess}
      />
    );
  }

  if (authView === 'complete-profile') {
    return (
      <CompleteProfile
        userData={registrationData}
        onComplete={handleCompleteProfile}
      />
    );
  }

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
