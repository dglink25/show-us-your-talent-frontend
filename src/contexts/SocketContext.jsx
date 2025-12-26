import React, { createContext, useContext, useState, useEffect } from 'react';

const SocketContext = createContext();

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};

export const SocketProvider = ({ children }) => {
  const [notificationsCount, setNotificationsCount] = useState(0);
  const [isConnected, setIsConnected] = useState(false);
  const [socket, setSocket] = useState(null);

  const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

  // Charger les notifications initiales
  const loadInitialNotifications = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await fetch(`${API_BASE_URL}/chat/notifications`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        },
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          const unreadCount = data.notifications?.filter(n => !n.is_read).length || 0;
          setNotificationsCount(unreadCount);
        }
      }
    } catch (error) {
      console.error('Erreur chargement notifications:', error);
    }
  };

  // Simuler une connexion WebSocket
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    // Simuler une connexion socket
    const simulateSocket = () => {
      console.log('Simulation WebSocket activée');
      setIsConnected(true);

      // Simuler la réception de notifications
      const interval = setInterval(() => {
        // Mettre à jour périodiquement les notifications
        loadInitialNotifications();
      }, 30000); // Toutes les 30 secondes

      return () => {
        clearInterval(interval);
        setIsConnected(false);
      };
    };

    loadInitialNotifications();
    const cleanup = simulateSocket();

    return () => {
      if (cleanup) cleanup();
    };
  }, []);

  // Recharger les notifications quand l'utilisateur se connecte
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      loadInitialNotifications();
    }
  }, []);

  const value = {
    notificationsCount,
    setNotificationsCount,
    isConnected,
    loadNotifications: loadInitialNotifications,
  };

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
};