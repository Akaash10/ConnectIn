import { useState, useEffect } from "react";
import "./ContentRight.css";

const ContentRight = () => {
  const [nextBooking, setNextBooking] = useState<any>(null);
  const [nextServiceBooking, setNextServiceBooking] = useState<any>(null);

  useEffect(() => {
    loadUpcomingBookings();

    // Listen for booking updates
    const handleBookingsUpdated = () => {
      loadUpcomingBookings();
    };

    window.addEventListener("bookingsUpdated", handleBookingsUpdated);
    return () => window.removeEventListener("bookingsUpdated", handleBookingsUpdated);
  }, []);

  const loadUpcomingBookings = () => {
    const currentUser = JSON.parse(localStorage.getItem("currentUser") || "{}");
    const bookings = JSON.parse(localStorage.getItem("bookings") || "[]");

    // Get upcoming bookings (approved, in the future)
    const now = new Date();

    // Find next booking as a customer
    const customerBookings = bookings.filter(
      (b: any) => b.customerId === currentUser.id && b.status === "approved"
    );
    const nextCustomerBooking = customerBookings.length > 0 ? customerBookings[0] : null;
    setNextBooking(nextCustomerBooking);

    // Find next booking as a service provider
    const providerBookings = bookings.filter(
      (b: any) => b.serviceProviderId === currentUser.id && b.status === "approved"
    );
    const nextProviderBooking = providerBookings.length > 0 ? providerBookings[0] : null;
    setNextServiceBooking(nextProviderBooking);
  };

  const handleNavigate = () => {
    const event = new CustomEvent("navigate", { detail: "bookings" });
    window.dispatchEvent(event);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    };
    return date.toLocaleDateString('en-US', options);
  };

  return (
    <aside className="content-right">
      <div className="bookings-reminder-card">
        <div className="reminder-header">
          <div className="reminder-icon">📅</div>
          <h3 className="reminder-title">Upcoming Bookings</h3>
        </div>

        {!nextBooking && !nextServiceBooking ? (
          <div className="no-bookings-message">
            <div className="no-bookings-icon">📭</div>
            <p>No upcoming bookings</p>
          </div>
        ) : (
          <>
            {nextBooking && (
          <div className="booking-preview">
            <div className="booking-type">As Customer</div>
            <div className="booking-details">
              <div className="booking-service-name">{nextBooking.serviceName}</div>
              <div className="booking-provider">{nextBooking.serviceProviderName}</div>
              <div className="booking-date-time">
                <span className="booking-date">{formatDate(nextBooking.date)}</span>
                {nextBooking.time && (
                  <>
                    <span className="booking-separator">•</span>
                    <span className="booking-time">{nextBooking.time}</span>
                  </>
                )}
              </div>
            </div>
          </div>
        )}

        {nextServiceBooking && (
          <div className="booking-preview">
            <div className="booking-type">As Service Provider</div>
            <div className="booking-details">
              <div className="booking-service-name">{nextServiceBooking.serviceName}</div>
              <div className="booking-provider">{nextServiceBooking.customerName}</div>
              <div className="booking-date-time">
                <span className="booking-date">{formatDate(nextServiceBooking.date)}</span>
                {nextServiceBooking.time && (
                  <>
                    <span className="booking-separator">•</span>
                    <span className="booking-time">{nextServiceBooking.time}</span>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
          </>
        )}

        <button type="button" className="view-all-bookings-btn" onClick={handleNavigate}>
          View All Bookings
        </button>
      </div>
    </aside>
  );
};

export default ContentRight;
