import { useState, useEffect } from "react";
import "./Content_Bookings.css";
import { showNotification } from "../../Notification/Notification";
import { STORAGE_KEYS, BOOKING_STATUS, BOOKING_STATUS_COLORS } from "../../../constants/appConstants";

interface Booking {
  id: number;
  customerId: number;
  customerName: string;
  customerAvatar: string | null;
  providerId: number;
  providerName: string;
  providerHeadline: string;
  providerAvatar: string | null;
  tradeCategory: string;
  date: string;
  time: string;
  message: string;
  status: "pending" | "accepted" | "rejected" | "completed";
  createdAt: string;
}

const Content_Bookings = () => {
  const [activeTab, setActiveTab] = useState<"my-bookings" | "requests">("my-bookings");
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [selectedMonth, setSelectedMonth] = useState(new Date());

  const currentUser = JSON.parse(localStorage.getItem(STORAGE_KEYS.CURRENT_USER) || JSON.stringify({
    id: Date.now(),
    name: "Sanjay A Kanakaraj",
    headline: "Software Development Engineer",
    avatarUrl: null,
  }));

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = () => {
    const allBookings = JSON.parse(localStorage.getItem(STORAGE_KEYS.BOOKINGS) || "[]");
    setBookings(allBookings);
  };

  // Get bookings where user is customer
  const getMyBookings = () => {
    return bookings.filter(b => b.customerId === currentUser.id);
  };

  // Get bookings where user is service provider
  const getServiceRequests = () => {
    return bookings.filter(b => b.providerId === currentUser.id);
  };

  const handleAcceptBooking = (bookingId: number) => {
    const updatedBookings = bookings.map(b =>
      b.id === bookingId ? { ...b, status: BOOKING_STATUS.ACCEPTED } : b
    );
    setBookings(updatedBookings);
    localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(updatedBookings));

    const booking = bookings.find(b => b.id === bookingId);
    if (booking) {
      showNotification("success", `Booking accepted for ${booking.customerName}`);
    }
  };

  const handleRejectBooking = (bookingId: number) => {
    const updatedBookings = bookings.map(b =>
      b.id === bookingId ? { ...b, status: BOOKING_STATUS.REJECTED } : b
    );
    setBookings(updatedBookings);
    localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(updatedBookings));

    const booking = bookings.find(b => b.id === bookingId);
    if (booking) {
      showNotification("info", `Booking rejected for ${booking.customerName}`);
    }
  };

  const handleCompleteBooking = (bookingId: number) => {
    const updatedBookings = bookings.map(b =>
      b.id === bookingId ? { ...b, status: BOOKING_STATUS.COMPLETED } : b
    );
    setBookings(updatedBookings);
    localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(updatedBookings));
    showNotification("success", "Booking marked as completed!");
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric"
    });
  };

  const getStatusColor = (status: string) => {
    return BOOKING_STATUS_COLORS[status as keyof typeof BOOKING_STATUS_COLORS] || "#666";
  };

  const getStatusLabel = (status: string) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  // Calendar functionality
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    return { daysInMonth, startingDayOfWeek };
  };

  const getBookingsForDate = (day: number) => {
    const dateStr = new Date(
      selectedMonth.getFullYear(),
      selectedMonth.getMonth(),
      day
    ).toISOString().split("T")[0];

    // Get all bookings for this user (as customer or provider)
    return bookings.filter(b => {
      const isMyBooking = b.customerId === currentUser.id || b.providerId === currentUser.id;
      return isMyBooking && b.date === dateStr && b.status === BOOKING_STATUS.ACCEPTED;
    });
  };

  const previousMonth = () => {
    setSelectedMonth(new Date(selectedMonth.getFullYear(), selectedMonth.getMonth() - 1));
  };

  const nextMonth = () => {
    setSelectedMonth(new Date(selectedMonth.getFullYear(), selectedMonth.getMonth() + 1));
  };

  const renderCalendar = () => {
    const { daysInMonth, startingDayOfWeek } = getDaysInMonth(selectedMonth);
    const days = [];

    // Add empty cells for days before month starts
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(<div key={`empty-${i}`} className="calendar-day empty"></div>);
    }

    // Add days of month
    for (let day = 1; day <= daysInMonth; day++) {
      const dayBookings = getBookingsForDate(day);
      const hasBookings = dayBookings.length > 0;

      days.push(
        <div key={day} className={`calendar-day ${hasBookings ? "has-bookings" : ""}`}>
          <div className="calendar-day-number">{day}</div>
          {hasBookings && (
            <div className="calendar-day-bookings">
              {dayBookings.map((booking, idx) => (
                <div
                  key={idx}
                  className="calendar-booking-dot"
                  style={{ backgroundColor: booking.customerId === currentUser.id ? "#0a66c2" : "#057642" }}
                  title={`${booking.time} - ${booking.customerId === currentUser.id ? booking.providerName : booking.customerName}`}
                />
              ))}
            </div>
          )}
        </div>
      );
    }

    return days;
  };

  const myBookings = getMyBookings();
  const serviceRequests = getServiceRequests();

  return (
    <div className="content-bookings">
      {/* Header */}
      <div className="bookings-header">
        <h1>My Bookings</h1>
        <p>Manage your service bookings and requests</p>
      </div>

      {/* Calendar View */}
      <div className="bookings-calendar-section">
        <div className="calendar-header">
          <h2>Calendar View</h2>
          <div className="calendar-controls">
            <button type="button" onClick={previousMonth} className="calendar-nav-btn">
              ‹
            </button>
            <span className="calendar-month">
              {selectedMonth.toLocaleDateString("en-US", { month: "long", year: "numeric" })}
            </span>
            <button type="button" onClick={nextMonth} className="calendar-nav-btn">
              ›
            </button>
          </div>
        </div>
        <div className="calendar-legend">
          <div className="legend-item">
            <div className="legend-dot" style={{ backgroundColor: "#0a66c2" }}></div>
            <span>Booked by me</span>
          </div>
          <div className="legend-item">
            <div className="legend-dot" style={{ backgroundColor: "#057642" }}></div>
            <span>Booked for my service</span>
          </div>
        </div>
        <div className="calendar-grid">
          <div className="calendar-weekday">Sun</div>
          <div className="calendar-weekday">Mon</div>
          <div className="calendar-weekday">Tue</div>
          <div className="calendar-weekday">Wed</div>
          <div className="calendar-weekday">Thu</div>
          <div className="calendar-weekday">Fri</div>
          <div className="calendar-weekday">Sat</div>
          {renderCalendar()}
        </div>
      </div>

      {/* Tabs */}
      <div className="bookings-tabs">
        <button
          type="button"
          className={`tab-btn ${activeTab === "my-bookings" ? "active" : ""}`}
          onClick={() => setActiveTab("my-bookings")}
        >
          Booked by me ({myBookings.length})
        </button>
        <button
          type="button"
          className={`tab-btn ${activeTab === "requests" ? "active" : ""}`}
          onClick={() => setActiveTab("requests")}
        >
          Booked for my service ({serviceRequests.filter(r => r.status === BOOKING_STATUS.PENDING).length})
        </button>
      </div>

      {/* Content */}
      <div className="bookings-content">
        {activeTab === "my-bookings" ? (
          <div className="bookings-list">
            {myBookings.length === 0 ? (
              <div className="no-bookings">
                <div className="no-bookings-icon">📅</div>
                <h3>No bookings yet</h3>
                <p>Book a service from the Services page to get started</p>
              </div>
            ) : (
              myBookings.map((booking) => (
                <div key={booking.id} className="booking-card">
                  <div className="booking-card-header">
                    <div className="booking-provider-info">
                      <div className="booking-avatar">
                        {booking.providerAvatar ? (
                          <img src={booking.providerAvatar} alt={booking.providerName} />
                        ) : (
                          booking.providerName.charAt(0)
                        )}
                      </div>
                      <div className="booking-details">
                        <h3>{booking.providerName}</h3>
                        <p className="booking-headline">{booking.providerHeadline}</p>
                        <span className="booking-category">{booking.tradeCategory}</span>
                      </div>
                    </div>
                    <div
                      className="booking-status"
                      style={{ backgroundColor: getStatusColor(booking.status) }}
                    >
                      {getStatusLabel(booking.status)}
                    </div>
                  </div>
                  <div className="booking-card-body">
                    <div className="booking-info-row">
                      <span className="booking-label">Date:</span>
                      <span className="booking-value">{formatDate(booking.date)}</span>
                    </div>
                    <div className="booking-info-row">
                      <span className="booking-label">Time:</span>
                      <span className="booking-value">{booking.time}</span>
                    </div>
                    {booking.message && (
                      <div className="booking-message">
                        <span className="booking-label">Message:</span>
                        <p>{booking.message}</p>
                      </div>
                    )}
                  </div>
                  {booking.status === BOOKING_STATUS.ACCEPTED && (
                    <div className="booking-card-actions">
                      <button
                        type="button"
                        className="booking-action-btn complete"
                        onClick={() => handleCompleteBooking(booking.id)}
                      >
                        Mark as Completed
                      </button>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        ) : (
          <div className="bookings-list">
            {serviceRequests.length === 0 ? (
              <div className="no-bookings">
                <div className="no-bookings-icon">📬</div>
                <h3>No service requests</h3>
                <p>You haven't received any booking requests yet</p>
              </div>
            ) : (
              serviceRequests.map((booking) => (
                <div key={booking.id} className="booking-card">
                  <div className="booking-card-header">
                    <div className="booking-provider-info">
                      <div className="booking-avatar">
                        {booking.customerAvatar ? (
                          <img src={booking.customerAvatar} alt={booking.customerName} />
                        ) : (
                          booking.customerName.charAt(0)
                        )}
                      </div>
                      <div className="booking-details">
                        <h3>{booking.customerName}</h3>
                        <span className="booking-category">{booking.tradeCategory}</span>
                      </div>
                    </div>
                    <div
                      className="booking-status"
                      style={{ backgroundColor: getStatusColor(booking.status) }}
                    >
                      {getStatusLabel(booking.status)}
                    </div>
                  </div>
                  <div className="booking-card-body">
                    <div className="booking-info-row">
                      <span className="booking-label">Date:</span>
                      <span className="booking-value">{formatDate(booking.date)}</span>
                    </div>
                    <div className="booking-info-row">
                      <span className="booking-label">Time:</span>
                      <span className="booking-value">{booking.time}</span>
                    </div>
                    {booking.message && (
                      <div className="booking-message">
                        <span className="booking-label">Message:</span>
                        <p>{booking.message}</p>
                      </div>
                    )}
                  </div>
                  {booking.status === BOOKING_STATUS.PENDING && (
                    <div className="booking-card-actions">
                      <button
                        type="button"
                        className="booking-action-btn reject"
                        onClick={() => handleRejectBooking(booking.id)}
                      >
                        Reject
                      </button>
                      <button
                        type="button"
                        className="booking-action-btn accept"
                        onClick={() => handleAcceptBooking(booking.id)}
                      >
                        Accept
                      </button>
                    </div>
                  )}
                  {booking.status === BOOKING_STATUS.ACCEPTED && (
                    <div className="booking-card-actions">
                      <button
                        type="button"
                        className="booking-action-btn complete"
                        onClick={() => handleCompleteBooking(booking.id)}
                      >
                        Mark as Completed
                      </button>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Content_Bookings;
