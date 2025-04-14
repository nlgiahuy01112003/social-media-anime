import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import api from '../utils/api';
import { Link } from 'react-router-dom';

function ChatList() {
  const [conversations, setConversations] = useState([]);

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const res = await api.get('/messages/conversations');
        setConversations(res.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchConversations();
  }, []);

  return (
    <div className="min-h-screen bg-anime-gradient p-6">
      <motion.h1
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="text-4xl font-anime text-white text-center mb-8"
      >
        Danh Sách Chat 💬
      </motion.h1>
      <div className="max-w-2xl mx-auto space-y-4">
        {conversations.map((conv) => (
          <Link to={`/chat/${conv.id}`} key={conv.id}>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="p-4 bg-white rounded-2xl shadow-anime-glow flex justify-between"
            >
              <p className="font-anime text-anime-purple">{conv.username}</p>
              <p className="font-anime text-gray-500">{conv.last_message}</p>
            </motion.div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default ChatList;