// frontend/src/pages/NotificationsPage.jsx
import { useState, useEffect } from 'react';
import api from '../services/api';
import { Card, CardBody } from '../components/ui/Card';
import Button from '../components/ui/Button';
import { useToast } from '../context/ToastContext';
import Skeleton from '../components/ui/Skeleton';
import EmptyState from '../components/ui/EmptyState';
import { Bell, CheckCheck, Circle } from 'lucide-react';

export default function NotificationsPage() {
  const { addToast } = useToast();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const res = await api.get('/notifications');
      setNotifications(res.data.data.notifications);
    } catch (err) {
      addToast('Failed to fetch notifications', 'error');
    } finally {
      setLoading(false);
    }
  };

  const markAllAsRead = async () => {
    try {
      await api.put('/notifications/mark-all-read');
      setNotifications(prev => prev.map(n => ({ ...n, is_read: 1 })));
    } catch (err) {
      addToast('Failed to mark all as read', 'error');
    }
  };

  const markAsRead = async (id) => {
    try {
      await api.put(`/notifications/${id}/read`);
      setNotifications(prev => prev.map(n => n.notification_id === id ? { ...n, is_read: 1 } : n));
    } catch (err) {
      addToast('Failed to mark as read', 'error');
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto space-y-4">
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-20 w-full" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto pb-20">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Notifications</h1>
          <p className="text-sm text-slate-500">Stay updated on your projects and tasks.</p>
        </div>
        {notifications.some(n => !n.is_read) && (
          <Button variant="ghost" onClick={markAllAsRead} className="gap-2">
            <CheckCheck size={18} /> Mark all read
          </Button>
        )}
      </div>

      {notifications.length === 0 ? (
        <EmptyState icon={Bell} title="No notifications" description="You're all caught up!" />
      ) : (
        <div className="space-y-3">
          {notifications.map(n => (
            <Card key={n.notification_id} className={`transition-colors ${!n.is_read ? 'border-indigo-200 dark:border-indigo-800 bg-indigo-50/30 dark:bg-indigo-900/10' : ''}`}>
              <CardBody className="p-4 flex items-start gap-4">
                <div className="mt-1">
                  {!n.is_read ? (
                    <Circle className="h-3 w-3 text-indigo-500 fill-indigo-500" />
                  ) : (
                    <Circle className="h-3 w-3 text-slate-300 dark:text-slate-700" />
                  )}
                </div>
                <div className="flex-1">
                  <p className={`text-sm md:text-base ${!n.is_read ? 'font-medium text-slate-900 dark:text-white' : 'text-slate-600 dark:text-slate-300'}`}>
                    {n.message}
                  </p>
                  <p className="text-xs text-slate-400 mt-1">
                    {new Date(n.created_at).toLocaleString()}
                  </p>
                </div>
                {!n.is_read && (
                  <Button variant="ghost" size="sm" onClick={() => markAsRead(n.notification_id)}>
                    Mark Read
                  </Button>
                )}
              </CardBody>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
