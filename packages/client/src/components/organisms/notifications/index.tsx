import React, { createContext, useContext, useState, ReactNode } from 'react';
import './styles.scss';

type Notification = {
  id: string;
  message: string;
  type: 'success' | 'error';
};
type NotificationContextType = {
  addNotification: (notification: Notification) => void;
};

const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined
);
export let addNotification: (notification: Notification) => void;
export const NotificationProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  addNotification = (notification: Notification) => {
    setNotifications((prev) => [...prev, notification]);

    setTimeout(() => {
      setNotifications((prev) =>
        prev.filter((not) => not.id !== notification.id)
      );
    }, 5000);
  };

  return (
    <NotificationContext.Provider value={{ addNotification }}>
      {children}
      <NotificationList notifications={notifications} />
    </NotificationContext.Provider>
  );
};

const NotificationList: React.FC<{ notifications: Notification[] }> = ({
  notifications,
}) => (
  <div className="notification-container">
    {notifications.map((notification) => (
      <div
        key={notification.id}
        className={`notification ${notification.type}`}
      >
        {notification.message}
      </div>
    ))}
  </div>
);

export const useNotifications = () => useContext(NotificationContext);
