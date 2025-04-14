import { useState } from 'react';
import { motion } from 'framer-motion';
import api from '../utils/api';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Confetti from 'react-confetti';

function PostCreate() {
  const [content, setContent] = useState('');
  const [mediaUrl, setMediaUrl] = useState('');
  const [visibility, setVisibility] = useState('public');
  const [loading, setLoading] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/posts', { content, media_url: mediaUrl, visibility });
      setShowConfetti(true);
      toast.success('Đăng bài thành công! 🎉');
      setTimeout(() => {
        navigate('/feed');
        setShowConfetti(false);
      }, 3000);
    } catch (error) {
      console.error(error);
      toast.error('Đăng bài thất bại! 😿');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-anime-gradient p-6">
      {showConfetti && <Confetti />}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-md mx-auto bg-white p-8 rounded-2xl shadow-anime-glow"
      >
        <h2 className="text-3xl font-anime text-anime-purple mb-6 text-center">
          Tạo Bài Viết Mới ✨
        </h2>
        <form onSubmit={handleSubmit}>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Bạn đang nghĩ gì? 😺"
            className="w-full p-3 mb-4 border-2 border-anime-pink rounded-lg font-anime focus:outline-none focus:border-anime-blue"
            rows="4"
            disabled={loading}
          />
          <input
            type="text"
            value={mediaUrl}
            onChange={(e) => setMediaUrl(e.target.value)}
            placeholder="Link ảnh/video 📸"
            className="w-full p-3 mb-4 border-2 border-anime-pink rounded-lg font-anime focus:outline-none focus:border-anime-blue"
            disabled={loading}
          />
          <select
            value={visibility}
            onChange={(e) => setVisibility(e.target.value)}
            className="w-full p-3 mb-4 border-2 border-anime-pink rounded-lg font-anime focus:outline-none focus:border-anime-blue"
            disabled={loading}
          >
            <option value="public">Công khai 🌍</option>
            <option value="friends">Bạn bè 👥</option>
            <option value="private">Riêng tư 🔒</option>
          </select>
          <motion.button
            whileHover={{ scale: loading ? 1 : 1.05, boxShadow: loading ? 'none' : '0 0 15px rgba(84, 160, 255, 0.8)' }}
            whileTap={{ scale: loading ? 1 : 0.95 }}
            type="submit"
            className={`w-full p-3 bg-anime-blue text-white rounded-lg font-anime ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={loading}
          >
            {loading ? 'Đang đăng...' : 'Đăng Bài! 🌟'}
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
}

export default PostCreate;