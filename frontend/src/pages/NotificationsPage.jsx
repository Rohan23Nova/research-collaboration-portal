// frontend/src/pages/NotificationsPage.jsx
import { useState, useEffect, useCallback } from 'react';
import api from '../services/api';
import { Card, CardBody } from '../components/ui/Card';
import Button from '../components/ui/Button';
import { useToast } from '../context/ToastContext';
import Skeleton from '../components/ui/Skeleton';
import EmptyState from '../components/ui/EmptyState';
import ErrorState from '../components/ui/ErrorState';
import { Bell, CheckCheck, Circle } from 'lucide-react';

export default function NotificationsPage() {
  const { addToast } = useToast();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchNotifications = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get('/notifications');
      setNotifications(res.data.data.notifications || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch notifications');
      addToast('Failed to fetch notifications', 'error');
    } finally {
      setLoading(false);
    }
  }, [addToast]);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const markAllAsRead = async () => {
    try {
      await api.put('/notifications/mark-all-read');
      setNotifications(prev => prev.map(n => ({ ...n, is_read: 1 })));
      addToast('All notifications marked as read', 'success');
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
      <div className="max-w-4xl mx-auto space-y-4 pb-20">
        <div className="flex items-center justify-between mb-6">
          <Skeleton className="h-8 w-44" />
          <Skeleton className="h-9 w-32 rounded-md" />
        </div>
        {[1, 2, 3].map(i => (
          <Skeleton key={i} className="h-20 w-full rounded-xl" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto pb-20 space-y-6">
        <div>
          <h1 className="text-3xl sm:text-4xl font-semibold font-serif text-foreground tracking-tight leading-tight">Notifications</h1>
          <p className="mt-1.5 text-sm sm:text-base text-foreground-muted">Stay updated on your projects and tasks.</p>
        </div>
        <ErrorState 
          title="Could not load notifications"
          message={error}
          onRetry={fetchNotifications}
        />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto pb-20">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl sm:text-4xl font-semibold font-serif text-foreground tracking-tight leading-tight">Notifications</h1>
          <p className="mt-1.5 text-sm sm:text-base text-foreground-muted">Stay updated on your projects and tasks.</p>
        </div>
        {notifications.some(n => !n.is_read) && (
          <Button variant="ghost" onClick={markAllAsRead} className="gap-2 self-start sm:self-center">
            <CheckCheck size={18} aria-hidden="true" /> Mark all read
          </Button>
        )}
      </div>

      {notifications.length === 0 ? (
        <EmptyState 
          icon={Bell} 
          title="No notifications" 
          description="You're all caught up! New updates regarding your projects and tasks will appear here." 
        />
      ) : (
        <div className="space-y-3">
          {notifications.map(n => (
            <Card 
              key={n.notification_id} 
              className={`transition-all duration-200 hover:shadow-doodle-sm ${
                !n.is_read 
                  ? 'border-primary/50 dark:border-primary/40 bg-primary-soft/20 dark:bg-[#6E4634]/15' 
                  : 'hover:border-primary/40'
              }`}
            >
              <CardBody className="p-4 flex items-start gap-4">
                <div className="mt-1 shrink-0">
                  {!n.is_read ? (
                    <Circle className="h-3 w-3 text-primary fill-primary" aria-label="Unread" />
                  ) : (
                    <Circle className="h-3 w-3 text-border-muted dark:text-[#575048]" aria-label="Read" />
                  )}
                </div>
                <div className="flex-1">
                  <p className={`text-sm md:text-base ${!n.is_read ? 'font-medium text-foreground' : 'text-foreground'}`}>
                    {n.message}
                  </p>
                  <p className="text-xs text-foreground-muted dark:text-[#8F887E] mt-1">
                    {new Date(n.created_at).toLocaleString()}
                  </p>
                </div>
                {!n.is_read && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => markAsRead(n.notification_id)}
                    className="shrink-0 text-xs"
                  >
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
