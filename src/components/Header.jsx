import { useEffect, useRef, useState } from "react";
import {
  Menu,
  Bell,
  Search,
  FileText,
  Package,
  CreditCard,
  UserPlus,
  CheckCheck,
  X,
} from "lucide-react";

import {
  getNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
} from "./notifications";

function Header({ setMobileOpen }) {
  const [notifications, setNotifications] = useState(
    getNotifications()
  );

  const [showNotifications, setShowNotifications] =
    useState(false);

  const notificationRef = useRef(null);

  // Refresh notifications
  useEffect(() => {
    const refreshNotifications = () => {
      setNotifications(getNotifications());
    };

    window.addEventListener(
      "mth-notifications-updated",
      refreshNotifications
    );

    const interval = setInterval(
      refreshNotifications,
      2000
    );

    return () => {
      window.removeEventListener(
        "mth-notifications-updated",
        refreshNotifications
      );

      clearInterval(interval);
    };
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(
          event.target
        )
      ) {
        setShowNotifications(false);
      }
    };

    document.addEventListener(
      "mousedown",
      handleClickOutside
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, []);

  const unreadCount = notifications.filter(
    (notification) => !notification.read
  ).length;

  const handleNotificationClick = (id) => {
    markNotificationAsRead(id);

    setNotifications(getNotifications());
  };

  const handleMarkAllRead = () => {
    markAllNotificationsAsRead();

    setNotifications(getNotifications());
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case "bill":
        return <FileText size={16} />;

      case "stock":
        return <Package size={16} />;

      case "payment":
        return <CreditCard size={16} />;

      case "customer":
        return <UserPlus size={16} />;

      default:
        return <Bell size={16} />;
    }
  };

  const getTimeAgo = (date) => {
    const seconds = Math.floor(
      (Date.now() - new Date(date).getTime()) / 1000
    );

    if (seconds < 60) {
      return "Just now";
    }

    const minutes = Math.floor(seconds / 60);

    if (minutes < 60) {
      return `${minutes} min ago`;
    }

    const hours = Math.floor(minutes / 60);

    if (hours < 24) {
      return `${hours} hr ago`;
    }

    const days = Math.floor(hours / 24);

    return `${days} day${days > 1 ? "s" : ""} ago`;
  };

  return (
    <header className="header">
      {/* MOBILE MENU */}

      <button
        className="menu-button"
        onClick={() => setMobileOpen((prev) => !prev)}
      >
        <Menu size={22} />
      </button>

      {/* SEARCH */}

      <div className="header-search">
        <Search size={18} />

        <input
          type="text"
          placeholder="Search bills, customers, items..."
        />
      </div>

      {/* RIGHT */}

      <div className="header-right">

        {/* NOTIFICATION */}

        <div
          className="notification-wrapper"
          ref={notificationRef}
        >
          <button
            className="notification"
            onClick={() =>
              setShowNotifications(
                (prev) => !prev
              )
            }
          >
            <Bell size={19} />

            {unreadCount > 0 && (
              <span className="notification-badge">
                {unreadCount > 9
                  ? "9+"
                  : unreadCount}
              </span>
            )}
          </button>

          {/* DROPDOWN */}

          {showNotifications && (
            <div className="notification-dropdown">

              <div className="notification-header">
                <div>
                  <h3>Notifications</h3>

                  <p>
                    {unreadCount > 0
                      ? `${unreadCount} unread notification${
                          unreadCount > 1
                            ? "s"
                            : ""
                        }`
                      : "You're all caught up"}
                  </p>
                </div>

                {notifications.length > 0 && (
                  <button
                    className="mark-read-button"
                    onClick={
                      handleMarkAllRead
                    }
                    title="Mark all as read"
                  >
                    <CheckCheck size={16} />
                  </button>
                )}
              </div>

              <div className="notification-list">

                {notifications.length === 0 ? (
                  <div className="notification-empty">
                    <div className="notification-empty-icon">
                      <Bell size={22} />
                    </div>

                    <strong>
                      No notifications
                    </strong>

                    <span>
                      New bills, payments and stock
                      alerts will appear here.
                    </span>
                  </div>
                ) : (
                  notifications
                    .slice(0, 10)
                    .map((notification) => (
                      <button
                        key={notification.id}
                        className={`notification-item ${
                          !notification.read
                            ? "unread"
                            : ""
                        }`}
                        onClick={() =>
                          handleNotificationClick(
                            notification.id
                          )
                        }
                      >
                        <div
                          className={`notification-icon ${notification.type}`}
                        >
                          {getNotificationIcon(
                            notification.type
                          )}
                        </div>

                        <div className="notification-content">
                          <strong>
                            {notification.title}
                          </strong>

                          <p>
                            {notification.message}
                          </p>

                          <small>
                            {getTimeAgo(
                              notification.createdAt
                            )}
                          </small>
                        </div>

                        {!notification.read && (
                          <span className="unread-dot" />
                        )}
                      </button>
                    ))
                )}

              </div>

              {notifications.length > 0 && (
                <div className="notification-footer">
                  <button
                    onClick={() =>
                      setShowNotifications(
                        false
                      )
                    }
                  >
                    Close
                    <X size={14} />
                  </button>
                </div>
              )}

            </div>
          )}
        </div>

        {/* PROFILE */}


      </div>
    </header>
  );
}

export default Header;