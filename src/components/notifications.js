// ================================
// MANISH TENT HOUSE NOTIFICATIONS
// ================================

const STORAGE_KEY = "mth_notifications";

export const getNotifications = () => {
  try {
    return JSON.parse(
      localStorage.getItem(STORAGE_KEY) || "[]"
    );
  } catch {
    return [];
  }
};

export const saveNotifications = (notifications) => {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(notifications)
  );
};

export const addNotification = ({
  type = "info",
  title,
  message,
}) => {
  const notifications = getNotifications();

  const newNotification = {
    id: Date.now(),
    type,
    title,
    message,
    read: false,
    createdAt: new Date().toISOString(),
  };

  const updated = [
    newNotification,
    ...notifications,
  ].slice(0, 50);

  saveNotifications(updated);

  return newNotification;
};

export const markNotificationAsRead = (id) => {
  const notifications = getNotifications();

  const updated = notifications.map(
    (notification) =>
      notification.id === id
        ? {
            ...notification,
            read: true,
          }
        : notification
  );

  saveNotifications(updated);
};

export const markAllNotificationsAsRead = () => {
  const notifications = getNotifications();

  const updated = notifications.map(
    (notification) => ({
      ...notification,
      read: true,
    })
  );

  saveNotifications(updated);
};

export const clearNotifications = () => {
  localStorage.removeItem(STORAGE_KEY);
};