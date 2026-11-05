import { useState, useEffect, useCallback } from 'react';
import { ClinicNotification } from '../../../types';

const STORAGE_KEY = 'jc_clinic_real_notifications';

export function useNotificationState() {
  const [notifications, setNotifications] = useState<ClinicNotification[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
      return [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(notifications));
    } catch (err) {
      console.error('Error saving notifications to localStorage', err);
    }
  }, [notifications]);

  const addNotification = useCallback((
    notif: Omit<ClinicNotification, 'id' | 'timestamp' | 'read'>
  ) => {
    const newNotif: ClinicNotification = {
      ...notif,
      id: 'notif_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
      timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      read: false,
    };

    setNotifications((prev) => [newNotif, ...prev]);
    return newNotif;
  }, []);

  const markAsRead = useCallback((id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  }, []);

  const toggleRead = useCallback((id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: !n.read } : n))
    );
  }, []);

  const markAllAsRead = useCallback((userId?: string) => {
    setNotifications((prev) =>
      prev.map((n) => {
        if (!userId || !n.targetUserId || n.targetUserId === 'all' || n.targetUserId === userId) {
          return { ...n, read: true };
        }
        return n;
      })
    );
  }, []);

  const deleteNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  const clearNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  const getUserNotifications = useCallback((userId?: string) => {
    if (!userId) return notifications;
    return notifications.filter(
      (n) => !n.targetUserId || n.targetUserId === 'all' || n.targetUserId === userId
    );
  }, [notifications]);

  const getUnreadCount = useCallback((userId?: string) => {
    const list = getUserNotifications(userId);
    return list.filter((n) => !n.read).length;
  }, [getUserNotifications]);

  return {
    notifications,
    addNotification,
    markAsRead,
    toggleRead,
    markAllAsRead,
    deleteNotification,
    clearNotifications,
    getUserNotifications,
    getUnreadCount,
  };
}
