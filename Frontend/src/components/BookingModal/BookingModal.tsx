import { useState, useEffect } from "react";
import "./BookingModal.css";
import { showNotification } from "../Notification/Notification";

interface ServiceProvider {
  id: number;
  name: string;
  headline: string;
  avatarUrl: string | null;
  tradeCategory: string;
}

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  serviceProvider: ServiceProvider | null;
}

const BookingModal = ({ isOpen, onClose, serviceProvider }: BookingModalProps) => {
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const timeSlots = [
    "09:00 AM", "10:00 AM", "11:00 AM", "12:00 PM",
    "01:00 PM", "02:00 PM", "03:00 PM", "04:00 PM",
    "05:00 PM", "06:00 PM"
  ];

  // Get current user
  const currentUser = JSON.parse(localStorage.getItem("currentUser") || JSON.stringify({
    id: Date.now(),
    name: "Sanjay A Kanakaraj",
    headline: "Software Development Engineer",
    avatarUrl: null,
  }));

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setSelectedDate("");
      setSelectedTime("");
      setMessage("");
    }
  }, [isOpen]);

  // Get minimum date (today)
  const getMinDate = () => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  };

  const handleSubmit = async () => {
    if (!selectedDate || !selectedTime || !serviceProvider) {
      showNotification("error", "Please select both date and time");
      return;
    }

    setIsSubmitting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Create booking object
    const booking = {
      id: Date.now(),
      customerId: currentUser.id,
      customerName: currentUser.name,
      customerAvatar: currentUser.avatarUrl,
      providerId: serviceProvider.id,
      providerName: serviceProvider.name,
      providerHeadline: serviceProvider.headline,
      providerAvatar: serviceProvider.avatarUrl,
      tradeCategory: serviceProvider.tradeCategory,
      date: selectedDate,
      time: selectedTime,
      message: message,
      status: "pending",
      createdAt: new Date().toISOString(),
    };

    // Save booking to localStorage
    const bookings = JSON.parse(localStorage.getItem("bookings") || "[]");
    bookings.unshift(booking);
    localStorage.setItem("bookings", JSON.stringify(bookings));

    // Add notification for user
    const notifications = JSON.parse(localStorage.getItem("notifications") || "[]");
    notifications.unshift({
      id: Date.now(),
      type: "booking_created",
      message: `Booking request sent to ${serviceProvider.name}`,
      timestamp: new Date().toISOString(),
      read: false,
    });
    localStorage.setItem("notifications", JSON.stringify(notifications));

    setIsSubmitting(false);
    showNotification("success", `Booking request sent to ${serviceProvider.name}!`);
    onClose();
  };

  if (!isOpen || !serviceProvider) return null;

  return (
    <div className="booking-modal-overlay" onClick={onClose}>
      <div className="booking-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="booking-modal-header">
          <h2>Book Service</h2>
          <button
            type="button"
            className="booking-modal-close"
            onClick={onClose}
            disabled={isSubmitting}
          >
            ×
          </button>
        </div>

        <div className="booking-modal-body">
          {/* Service Provider Info */}
          <div className="booking-provider-info">
            <div className="booking-provider-avatar">
              {serviceProvider.avatarUrl ? (
                <img src={serviceProvider.avatarUrl} alt={serviceProvider.name} />
              ) : (
                serviceProvider.name.charAt(0)
              )}
            </div>
            <div className="booking-provider-details">
              <h3 className="booking-provider-name">{serviceProvider.name}</h3>
              <p className="booking-provider-headline">{serviceProvider.headline}</p>
              <span className="booking-provider-category">{serviceProvider.tradeCategory}</span>
            </div>
          </div>

          {/* Date Selection */}
          <div className="booking-field">
            <label htmlFor="booking-date">Select Date</label>
            <input
              type="date"
              id="booking-date"
              className="booking-input"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              min={getMinDate()}
              required
            />
          </div>

          {/* Time Selection */}
          <div className="booking-field">
            <label htmlFor="booking-time">Select Time</label>
            <div className="booking-time-slots">
              {timeSlots.map((slot) => (
                <button
                  key={slot}
                  type="button"
                  className={`time-slot ${selectedTime === slot ? "selected" : ""}`}
                  onClick={() => setSelectedTime(slot)}
                >
                  {slot}
                </button>
              ))}
            </div>
          </div>

          {/* Optional Message */}
          <div className="booking-field">
            <label htmlFor="booking-message">Message (Optional)</label>
            <textarea
              id="booking-message"
              className="booking-textarea"
              placeholder="Add any specific requirements or notes..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={4}
              maxLength={500}
            />
            <span className="booking-char-count">{message.length}/500</span>
          </div>
        </div>

        <div className="booking-modal-footer">
          <button
            type="button"
            className="booking-cancel-btn"
            onClick={onClose}
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            type="button"
            className="booking-submit-btn"
            onClick={handleSubmit}
            disabled={isSubmitting || !selectedDate || !selectedTime}
          >
            {isSubmitting ? "Submitting..." : "Send Booking Request"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookingModal;
