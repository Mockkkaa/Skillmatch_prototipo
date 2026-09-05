import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useNotifications } from '../../context/NotificationContext';
import { IconBell } from './Icons';
import './NotificationDropdown.css';

export default function NotificationDropdown() {
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  // Cerrar dropdown al hacer click fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleNotificationClick = async (notif) => {
    if (!notif.leida) {
      await markAsRead(notif.id);
    }
    setIsOpen(false);
    if (notif.enlace) {
      navigate(notif.enlace);
    }
  };

  const formatTime = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'Hace un momento';
    if (diffMins < 60) return `Hace ${diffMins} min`;
    if (diffHours < 24) return `Hace ${diffHours} h`;
    return `Hace ${diffDays} d`;
  };

  return (
    <div className="notification-container" ref={dropdownRef}>
      <button
        className="notification-bell-btn"
        onClick={() => setIsOpen(!isOpen)}
        title="Notificaciones"
        aria-label="Ver notificaciones"
      >
        <IconBell size={19} />
        {unreadCount > 0 && (
          <span className="notification-badge-count">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="notification-dropdown">
          <div className="notification-header">
            <h4>Notificaciones {unreadCount > 0 && `(${unreadCount})`}</h4>
            {unreadCount > 0 && (
              <button
                className="notification-mark-all-btn"
                onClick={markAllAsRead}
              >
                Marcar todas
              </button>
            )}
          </div>

          <div className="notification-list">
            {notifications.length === 0 ? (
              <div className="notification-empty">
                <p>No tienes notificaciones pendientes.</p>
              </div>
            ) : (
              notifications.map((n) => (
                <div
                  key={n.id}
                  className={`notification-item ${!n.leida ? 'unread' : ''}`}
                  onClick={() => handleNotificationClick(n)}
                >
                  <div className={`notification-icon-wrapper ${(n.tipo || 'info').toLowerCase()}`}>
                    {n.tipo === 'SUCCESS' ? '✓' : (n.tipo === 'WARNING' ? '!' : '🔔')}
                  </div>
                  <div className="notification-content">
                    <div className="notification-title">{n.titulo}</div>
                    <div className="notification-message">{n.mensaje}</div>
                    <div className="notification-time">{formatTime(n.created_at)}</div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
