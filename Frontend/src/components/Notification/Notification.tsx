import { useState, useEffect } from "react";
import "./Notification.css";

export type NotificationType = "success" | "error" | "info" | "warning";
export type NotificationPosition = "top-right" | "top-center" | "bottom-right" | "bottom-center" | "center";

interface NotificationMessage {
  id: number;
  type: NotificationType;
  message: string;
  duration?: number;
}

interface NotificationProps {
  position?: NotificationPosition;
}

const Notification = ({ position = "top-right" }: NotificationProps) => {
  const [notifications, setNotifications] = useState<NotificationMessage[]>([]);

  useEffect(() => {
    const handleShowNotification = (event: CustomEvent) => {
      const { type, message, duration = 3000 } = event.detail;

      const newNotification: NotificationMessage = {
        id: Date.now() + Math.random(),
        type,
        message,
        duration,
      };

      setNotifications((prev) => [...prev, newNotification]);

      // Auto-remove notification after duration
      setTimeout(() => {
        setNotifications((prev) => prev.filter((n) => n.id !== newNotification.id));
      }, duration);
    };

    window.addEventListener("showNotification" as any, handleShowNotification);

    return () => {
      window.removeEventListener("showNotification" as any, handleShowNotification);
    };
  }, []);

  const removeNotification = (id: number) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const getIcon = (type: NotificationType) => {
    switch (type) {
      case "success":
        return (
          <svg className="notification-icon" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
          </svg>
        );
      case "error":
        return (
          <svg className="notification-icon" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
          </svg>
        );
      case "warning":
        return (
          <svg className="notification-icon" viewBox="0 0 24 24" fill="currentColor">
            <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z" />
          </svg>
        );
      case "info":
        return (
          <svg className="notification-icon" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" />
          </svg>
        );
    }
  };

  if (notifications.length === 0) return null;

  return (
    <div className={`notification-container notification-${position}`}>
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className={`notification notification-${notification.type}`}
        >
          <div className="notification-content">
            {getIcon(notification.type)}
            <span className="notification-message">{notification.message}</span>
          </div>
          <button
            type="button"
            className="notification-close"
            onClick={() => removeNotification(notification.id)}
          >
            ×
          </button>
        </div>
      ))}
    </div>
  );
};

// Helper function to show notifications
export const showNotification = (
  type: NotificationType,
  message: string,
  duration: number = 3000
) => {
  const event = new CustomEvent("showNotification", {
    detail: { type, message, duration },
  });
  window.dispatchEvent(event);
};

export default Notification;
