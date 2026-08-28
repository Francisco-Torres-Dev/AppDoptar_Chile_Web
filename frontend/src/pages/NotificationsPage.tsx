import { useEffect, useState } from 'react';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { useAuth } from '../contexts/AuthContext';
import { notificationService } from '../services/notificationService';
import type { Notification } from '../types';

export default function NotificationsPage() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    notificationService.getByUser(user.id)
      .then(setNotifications)
      .finally(() => setLoading(false));
  }, [user]);

  const handleMarkAsRead = async (id: string) => {
    await notificationService.markAsRead(id);
    setNotifications(n => n.map(x => x.id === id ? { ...x, read: true } : x));
  };

  const handleMarkAllAsRead = async () => {
    notifications.filter(n => !n.read).forEach(n => handleMarkAsRead(n.id));
  };

  if (loading) return <div className="container py-4">Cargando...</div>;

  return (
    <div className="container py-4">
      <Breadcrumbs items={[{ label: 'Notificaciones' }]} />
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="h2 mb-0">Notificaciones</h1>
        {notifications.some(n => !n.read) && (
          <button className="btn btn-sm btn-outline-primary" onClick={handleMarkAllAsRead}>
            Marcar todo como leído
          </button>
        )}
      </div>

      {notifications.length === 0 ? (
        <div className="alert alert-info">No tienes notificaciones</div>
      ) : (
        <div className="list-group">
          {notifications.map((n) => (
            <div 
              key={n.id} 
              className={`list-group-item p-3 ${!n.read ? 'bg-light' : ''}`}
              onClick={() => handleMarkAsRead(n.id)}
              style={{ cursor: 'pointer' }}
            >
              <div className="d-flex justify-content-between align-items-start">
                <div>
                  <h5 className="mb-1">{n.title}</h5>
                  <p className="mb-1 text-muted">{n.message}</p>
                  <small className="text-muted">
                    {new Date(n.createdAt).toLocaleDateString()}
                  </small>
                </div>
                {!n.read && <span className="badge bg-primary">Nuevo</span>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
