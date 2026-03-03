import React, { useState, useEffect, useRef } from 'react';
import { Bell, Check, CheckCheck, Trash2, X, CheckCircle, XCircle, FileText } from 'lucide-react';
import { NotificationService } from '../services/notificationService';
import type { Notification } from '../types/collaboration';
import { useNavigate } from 'react-router-dom';

interface NotificationBellProps {
  userId: string;
  userRole: string;
}

const NotificationBell: React.FC<NotificationBellProps> = ({ userId, userRole }) => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadNotifications();
    // Actualizar notificaciones cada 30 segundos
    const interval = setInterval(loadNotifications, 30000);
    return () => clearInterval(interval);
  }, [userId]);

  // Cerrar dropdown al hacer click fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const loadNotifications = async () => {
    const [allNotifications, count] = await Promise.all([
      NotificationService.getUserNotifications(userId),
      NotificationService.getUnreadCount(userId)
    ]);
    console.log('Notificaciones cargadas:', allNotifications.length, 'No leídas:', count);
    setNotifications(allNotifications);
    setUnreadCount(count);
  };

  // Obtener color del badge según el rol (contraste con el gradiente del header)
  const getBadgeColor = () => {
    const colors: Record<string, string> = {
      collaborator: 'bg-yellow-400',      // Amarillo para contraste con azul
      trusted_collaborator: 'bg-green-400', // Verde para contraste con púrpura
      moderator: 'bg-orange-500',         // Naranja para contraste con verde
      superadmin: 'bg-[#542516]'          // Marrón oscuro personalizado
    };
    return colors[userRole] || 'bg-red-500';
  };

  const handleMarkAsRead = async (notificationId: string) => {
    await NotificationService.markAsRead(notificationId);
    await loadNotifications();
  };

  const handleMarkAllAsRead = async () => {
    setLoading(true);
    await NotificationService.markAllAsRead(userId);
    await loadNotifications();
    setLoading(false);
  };

  const handleDelete = async (notificationId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    await NotificationService.deleteNotification(notificationId);
    await loadNotifications();
  };

  const handleNotificationClick = async (notification: Notification) => {
    // Marcar como leída
    if (!notification.is_read) {
      await handleMarkAsRead(notification.id);
    }
    
    // Navegar según el tipo de notificación
    if (notification.type === 'new_question_pending') {
      navigate('/colaborador/moderacion');
    }
    
    setIsOpen(false);
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'question_approved':
        return <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />;
      case 'question_rejected':
        return <XCircle className="h-5 w-5 text-red-600 dark:text-red-400" />;
      case 'new_question_pending':
        return <FileText className="h-5 w-5 text-amber-600 dark:text-amber-400" />;
      default:
        return <Bell className="h-5 w-5 text-gray-600 dark:text-gray-400" />;
    }
  };

  const getNotificationColor = () => {
    // Todas las notificaciones con el mismo color minimalista
    return 'border-gray-200 dark:border-gray-700 bg-[#fdfdfd] dark:bg-gray-800';
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-xl bg-white/20 hover:bg-white/30 backdrop-blur-sm transition-all"
        aria-label="Notificaciones"
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className={`absolute -top-2 -right-2 ${getBadgeColor()} text-white text-xs font-bold rounded-full min-w-[20px] h-[20px] flex items-center justify-center px-1.5 shadow-lg`}>
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-96 max-w-[calc(100vw-2rem)] bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 z-50 max-h-[80vh] flex flex-col overflow-hidden">
          {/* Header */}
          <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between bg-[#fdfdfd] dark:bg-gray-800">
            <div>
              <h3 className="text-base font-semibold text-gray-900 dark:text-white">
                Notificaciones
              </h3>
              {unreadCount > 0 && (
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                  {unreadCount} sin leer
                </p>
              )}
            </div>
            <div className="flex items-center gap-1">
              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAllAsRead}
                  disabled={loading}
                  className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors"
                  title="Marcar todas como leídas"
                >
                  <CheckCheck className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                </button>
              )}
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <X className="h-4 w-4 text-gray-600 dark:text-gray-400" />
              </button>
            </div>
          </div>

          {/* Notifications List */}
          <div className="overflow-y-auto flex-1 bg-gray-50 dark:bg-gray-900">
            {notifications.length === 0 ? (
              <div className="p-8 text-center">
                <div className="bg-gray-100 dark:bg-gray-800 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Bell className="h-7 w-7 text-gray-400" />
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  No tienes notificaciones
                </p>
              </div>
            ) : (
              <div className="p-3 space-y-2">{notifications.map((notification) => (
                  <div
                    key={notification.id}
                    onClick={() => handleNotificationClick(notification)}
                    className={`p-4 rounded-xl border cursor-pointer transition-all hover:shadow-md ${
                      getNotificationColor()
                    } ${!notification.is_read ? 'border-l-4 border-l-amber-500' : ''}`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 mt-0.5">
                        {getNotificationIcon(notification.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <h4 className="font-semibold text-gray-900 dark:text-white text-sm">
                            {notification.title}
                          </h4>
                          {!notification.is_read && (
                            <span className="flex-shrink-0 w-2 h-2 bg-amber-500 rounded-full mt-1"></span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2 leading-relaxed">
                          {notification.message}
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-500 dark:text-gray-500">
                            {new Date(notification.created_at).toLocaleDateString('es-ES', {
                              day: 'numeric',
                              month: 'short',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </span>
                          <div className="flex items-center gap-1">
                            {!notification.is_read && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleMarkAsRead(notification.id);
                                }}
                                className="p-1.5 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors"
                                title="Marcar como leída"
                              >
                                <Check className="h-3.5 w-3.5 text-gray-500 dark:text-gray-400" />
                              </button>
                            )}
                            <button
                              onClick={(e) => handleDelete(notification.id, e)}
                              className="p-1.5 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors"
                              title="Eliminar"
                            >
                              <Trash2 className="h-3.5 w-3.5 text-gray-500 dark:text-gray-400" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
