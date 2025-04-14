import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import io from 'socket.io-client';
import api from '../utils/api';
import { useParams, Link } from 'react-router-dom';
import { toast } from 'react-toastify';

const socket = io('http://localhost:5000', {
  auth: { token: localStorage.getItem('token') },
});

function ChatDetail() {
  const { userId } = useParams();
  const [messages, setMessages] = useState([]);
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [stickers] = useState(['😺', '🌸', '✨', '🐾', '🍙']);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    socket.emit('join', userId);

    const fetchMessages = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/messages/${userId}`);
        setMessages(res.data);
      } catch (error) {
        console.error(error);
        toast.error('Tải tin nhắn thất bại! 😿');
      } finally {
        setLoading(false);
      }
    };
    fetchMessages();

    socket.on('message', (message) => {
      setMessages((prev) => [...prev, message]);
    });

    return () => socket.off('message');
  }, [userId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (content) {
      socket.emit('message', { receiverId: userId, content });
      setContent('');
      toast.success('Đã gửi tin nhắn! 💬');
    }
  };

  return (
    <div className="min-h-screen bg-anime-gradient p-6">
      <motion.h1
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        className="text-3xl font-anime text-white text-center mb-6"
      >
        Chat Anime 💬✨
      </motion.h1>
      <div className="max-w-2xl mx-auto">
        <Link to={`/call/${userId}`}>
          <motion.button
            whileHover={{ scale: 1.05 }}
            className="mb-4 p-2 bg-anime-purple text-white rounded-lg font-anime"
          >
            Gọi Video 📹
          </motion.button>
        </Link>
        <div className="h-96 overflow-y-auto p-4 bg-white rounded-2xl shadow-anime-glow mb-4">
          {loading ? (
            <p className="text-center font-anime text-gray-500">Đang tải... ⏳</p>
          ) : (
            messages.map((msg, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: msg.sender_id === parseInt(userId) ? -20 : 20 }}
                animate={{ opacity: 1, x: 0 }}
                className={`mb-4 p-3 rounded-lg font-anime ${
                  msg.sender_id === parseInt(userId)
                    ? 'bg-anime-blue text-white'
                    : 'bg-anime-pink text-white ml-auto'
                } max-w-xs`}
              >
                <span>{msg.content}</span>
              </motion.div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-5 gap-2 mb-2">
            {stickers.map((sticker) => (
              <motion.button
                key={sticker}
                whileHover={{ scale: 1.2, rotate: 10 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => {
                  setContent(content + sticker);
                  toast.success(`Đã thêm sticker ${sticker}! ✨`);
                }}
                type="button"
                className="text-2xl p-2 rounded-full bg-anime-pink bg-opacity-20"
              >
                {sticker}
              </motion.button>
            ))}
          </div>
          <div className="flex">
            <input
              type="text"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Nhắn gì đó nè~ 😺"
              className="flex-1 p-3 border-2 border-anime-purple rounded-l-lg font-anime focus:outline-none focus:border-anime-blue"
              disabled={loading}
            />
            <motion.button
              whileHover={{ scale: loading ? 1 : 1.1 }}
              whileTap={{ scale: loading ? 1 : 0.9 }}
              type="submit"
              className={`p-3 bg-anime-purple text-white rounded-r-lg font-anime ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
              disabled={loading}
            >
              Gửi 🌟
            </motion.button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ChatDetail;