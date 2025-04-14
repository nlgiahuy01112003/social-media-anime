import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import io from 'socket.io-client';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const socket = io('http://localhost:5000', {
  auth: { token: localStorage.getItem('token') },
});

function Chat() {
  const { userId } = useParams();
  const [messages, setMessages] = useState([]);
  const [content, setContent] = useState('');

  useEffect(() => {
    socket.emit('join', userId);

    const fetchMessages = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/messages/${userId}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        setMessages(res.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchMessages();

    socket.on('message', (message) => {
      setMessages((prev) => [...prev, message]);
    });

    return () => socket.off('message');
  }, [userId]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (content) {
      socket.emit('message', { receiverId: userId, content });
      setContent('');
    }
  };

  return (
    <div className="container mx-auto p-6 bg-anime-gradient min-h-screen">
      <motion.h1
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        className="text-3xl font-anime text-white text-center mb-6"
      >
        Chat Anime 💬✨
      </motion.h1>
      <div className="h-96 overflow-y-auto p-4 bg-white rounded-2xl shadow-anime-glow">
        {messages.map((msg, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: msg.sender_id === userId ? 20 : -20 }}
            animate={{ opacity: 1, x: 0 }}
            className={`mb-4 p-3 rounded-lg font-anime ${
              msg.sender_id === userId ? 'bg-anime-pink text-white ml-auto' : 'bg-anime-blue text-white'
            }`}
          >
            <span>{msg.content}</span>
          </motion.div>
        ))}
      </div>
      <form onSubmit={handleSubmit} className="mt-4 flex">
        <input
          type="text"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Nhắn gì đó nè~ 😺"
          className="flex-1 p-3 border-2 border-anime-purple rounded-l-lg font-anime focus:outline-none"
        />
        <motion.button
          whileHover={{ scale: 1.1 }}
          type="submit"
          className="p-3 bg-anime-purple text-white rounded-r-lg font-anime"
        >
          Gửi 🌟
        </motion.button>
      </form>
    </div>
  );
}

export default Chat;