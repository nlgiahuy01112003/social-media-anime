// frontend/src/pages/Home.js
import React from 'react';
import { motion } from 'framer-motion';

function Home() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-2xl shadow-anime-glow p-6"
    >
      <h1 className="text-3xl font-anime text-anime-purple mb-4">
        Chào mừng đến với Anime World! 🌸
      </h1>
      <p className="text-gray-600">
        Nơi kết nối các fan anime, chia sẻ bài viết, chơi Gacha, và gọi video cùng bạn bè! 🎉
      </p>
    </motion.div>
  );
}

export default Home;