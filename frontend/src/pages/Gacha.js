import { useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';

function Gacha() {
  const [avatar, setAvatar] = useState(null);
  const [loading, setLoading] = useState(false);
  const avatars = [
    '/avatars/avatar1.png',
    '/avatars/avatar2.png',
    '/avatars/avatar3.png',
  ];

  const roll = async () => {
    setLoading(true);
    try {
      // Giả lập API call hoặc logic quay
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Delay giả lập
      const random = avatars[Math.floor(Math.random() * avatars.length)];
      setAvatar(random);
      toast.success('Chúc mừng! Bạn nhận được một avatar mới! 🎉');
    } catch (error) {
      console.error(error);
      toast.error('Quay gacha thất bại! 😿');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-anime-gradient p-6">
      <motion.h1
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="text-4xl font-anime text-white text-center mb-8"
      >
        Gacha Anime 🎰
      </motion.h1>
      <div className="max-w-md mx-auto text-center">
        <motion.button
          whileHover={{ scale: loading ? 1 : 1.05, boxShadow: loading ? 'none' : '0 0 15px rgba(84, 160, 255, 0.8)' }}
          whileTap={{ scale: loading ? 1 : 0.95 }}
          onClick={roll}
          className={`p-3 bg-anime-purple text-white rounded-lg font-anime mb-4 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
          disabled={loading}
        >
          {loading ? 'Đang quay...' : 'Quay Gacha! 🌟'}
        </motion.button>
        {avatar && (
          <motion.img
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 100 }}
            src={avatar}
            alt="Gacha"
            className="w-32 h-32 mx-auto rounded-full border-2 border-anime-pink shadow-anime-glow"
          />
        )}
      </div>
    </div>
  );
}

export default Gacha;