import { STORAGE_KEYS, CUSTOM_EVENTS, BOOKING_STATUS } from "../constants/appConstants";

// Sample service request bookings data
export const initializeSampleBookings = () => {
  const existingBookings = localStorage.getItem(STORAGE_KEYS.BOOKINGS);

  // Only initialize if no bookings exist
  if (!existingBookings || JSON.parse(existingBookings).length === 0) {
    const currentUser = JSON.parse(localStorage.getItem(STORAGE_KEYS.CURRENT_USER) || "{}");
    const currentUserId = currentUser.id || Date.now();

    // Get dates for upcoming bookings
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const nextWeek = new Date(today);
    nextWeek.setDate(nextWeek.getDate() + 7);
    const inTwoWeeks = new Date(today);
    inTwoWeeks.setDate(inTwoWeeks.getDate() + 14);

    const sampleBookings = [
      // Bookings where current user is the customer (booked by me)
      {
        id: Date.now() + 1,
        customerId: currentUserId,
        customerName: currentUser.name || "Current User",
        customerAvatar: currentUser.avatarUrl || null,
        providerId: 102,
        providerName: "John's Carpentry Services",
        providerHeadline: "Professional Carpenter - 15 Years Experience",
        providerAvatar: null,
        tradeCategory: "Carpenter",
        date: tomorrow.toISOString().split("T")[0],
        time: "10:00 AM",
        message: "Need custom cabinets for my kitchen. Please bring material samples.",
        status: BOOKING_STATUS.ACCEPTED,
        createdAt: new Date().toISOString()
      },
      {
        id: Date.now() + 2,
        customerId: currentUserId,
        customerName: currentUser.name || "Current User",
        customerAvatar: currentUser.avatarUrl || null,
        providerId: 103,
        providerName: "QuickFix Plumbing",
        providerHeadline: "Licensed Plumber - Emergency Services Available",
        providerAvatar: null,
        tradeCategory: "Plumber",
        date: nextWeek.toISOString().split("T")[0],
        time: "2:00 PM",
        message: "Bathroom sink is leaking. Need urgent repair.",
        status: BOOKING_STATUS.PENDING,
        createdAt: new Date().toISOString()
      },
      {
        id: Date.now() + 3,
        customerId: currentUserId,
        customerName: currentUser.name || "Current User",
        customerAvatar: currentUser.avatarUrl || null,
        providerId: 104,
        providerName: "Bright Spark Electrical",
        providerHeadline: "Certified Electrician - Residential & Commercial",
        providerAvatar: null,
        tradeCategory: "Electrician",
        date: inTwoWeeks.toISOString().split("T")[0],
        time: "9:00 AM",
        message: "Need to install new lighting fixtures in living room.",
        status: BOOKING_STATUS.ACCEPTED,
        createdAt: new Date().toISOString()
      },

      // Bookings where current user is the service provider (booked for my service)
      {
        id: Date.now() + 101,
        customerId: 107,
        customerName: "Sarah Mitchell",
        customerAvatar: null,
        providerId: currentUserId,
        providerName: currentUser.name || "Current User",
        providerHeadline: currentUser.headline || "Service Provider",
        providerAvatar: currentUser.avatarUrl || null,
        tradeCategory: currentUser.roles?.[0] || "General",
        date: tomorrow.toISOString().split("T")[0],
        time: "3:00 PM",
        message: "Looking for professional service. Can you help with my project?",
        status: BOOKING_STATUS.PENDING,
        createdAt: new Date().toISOString()
      },
      {
        id: Date.now() + 102,
        customerId: 108,
        customerName: "Michael Chen",
        customerAvatar: null,
        providerId: currentUserId,
        providerName: currentUser.name || "Current User",
        providerHeadline: currentUser.headline || "Service Provider",
        providerAvatar: currentUser.avatarUrl || null,
        tradeCategory: currentUser.roles?.[0] || "General",
        date: nextWeek.toISOString().split("T")[0],
        time: "11:00 AM",
        message: "Need your expertise for a home improvement project.",
        status: BOOKING_STATUS.ACCEPTED,
        createdAt: new Date().toISOString()
      },
      {
        id: Date.now() + 103,
        customerId: 109,
        customerName: "Priya Sharma",
        customerAvatar: null,
        providerId: currentUserId,
        providerName: currentUser.name || "Current User",
        providerHeadline: currentUser.headline || "Service Provider",
        providerAvatar: currentUser.avatarUrl || null,
        tradeCategory: currentUser.roles?.[0] || "General",
        date: inTwoWeeks.toISOString().split("T")[0],
        time: "1:00 PM",
        message: "Interested in booking your service. Available on this date?",
        status: BOOKING_STATUS.PENDING,
        createdAt: new Date().toISOString()
      },
      {
        id: Date.now() + 104,
        customerId: 110,
        customerName: "David Rodriguez",
        customerAvatar: null,
        providerId: currentUserId,
        providerName: currentUser.name || "Current User",
        providerHeadline: currentUser.headline || "Service Provider",
        providerAvatar: currentUser.avatarUrl || null,
        tradeCategory: currentUser.roles?.[0] || "General",
        date: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 3).toISOString().split("T")[0],
        time: "4:00 PM",
        message: "Recommended by a friend. Would like to discuss the project details.",
        status: BOOKING_STATUS.PENDING,
        createdAt: new Date().toISOString()
      }
    ];

    localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(sampleBookings));

    // Dispatch event to notify components
    const event = new CustomEvent(CUSTOM_EVENTS.BOOKINGS_UPDATED);
    window.dispatchEvent(event);

    return sampleBookings;
  }

  return JSON.parse(existingBookings);
};

// Call this function when the app loads to ensure sample data exists
export const ensureSampleData = () => {
  initializeSampleBookings();
};
