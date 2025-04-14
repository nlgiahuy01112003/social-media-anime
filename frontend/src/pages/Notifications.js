import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import io from 'socket.io-client';
import api from '../utils/api';
import Notification from '../components/Notification';
import { toast } from 'react-toastify';

const socket = io('http://localhost:5000', {
  auth: { token: localStorage.getItem('token') },
});

function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchNotifications = async () => {
      setLoading(true);
      try {
        const res = await api.get('/notifications');
        setNotifications(res.data);
      } catch (error) {
        console.error(error);
        toast.error('Tải thông báo thất bại! 😿');
      } finally {
        setLoading(false);
      }
    };
    fetchNotifications();

    socket.on('notification', (notification) => {
      setNotifications((prev) => [notification, ...prev]);
      toast.info(`Thông báo mới: ${notification.content} 🔔`);
    });

    return () => socket.off('notification');
  }, []);

  return (
    <div className="min-h-screen bg-anime-gradient p-6">
      <motion.h1
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="text-4xl font-anime text-white text-center mb-8"
      >
        Thông Báo Anime 🔔
      </motion.h1>
      <div className="max-w-2xl mx-auto space-y-4">
        {loading ? (
          <p className="text-center font-anime text-gray-500">Đang tải... ⏳</p>
        ) : (
          notifications.map((notif) => (
            <Notification key={notif.id} notification={notif} />
          ))
        )}
      </div>
    </div>
  );
}

export default Notifications;