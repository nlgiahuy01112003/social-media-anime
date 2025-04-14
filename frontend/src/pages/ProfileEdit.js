import { useState } from 'react';
import { motion } from 'framer-motion';
import api from '../utils/api';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

function ProfileEdit() {
  const [bio, setBio] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [coverUrl, setCoverUrl] = useState('');
  const [loading, setLoading] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.put('/users/me', { bio, avatar_url: avatarUrl, cover_url: coverUrl });
      toast.success('Cập nhật profile thành công! 🌟');
      navigate('/profile');
    } catch (error) {
      console.error(error);
      toast.error('Cập nhật thất bại! 😿');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-anime-gradient p-6">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-md mx-auto bg-white p-8 rounded-2xl shadow-anime-glow"
      >
        <h2 className="text-3xl font-anime text-anime-purple mb-6 text-center">
          Cập Nhật Profile 🌸
        </h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Tiểu sử của bạn 📝"
            className="w-full p-3 mb-4 border-2 border-anime-pink rounded-lg font-anime focus:outline-none focus:border-anime-blue"
            disabled={loading}
          />
          <input
            type="text"
            value={avatarUrl}
            onChange={(e) => setAvatarUrl(e.target.value)}
            placeholder="Link ảnh đại diện 🎨"
            className="w-full p-3 mb-4 border-2 border-anime-pink rounded-lg font-anime focus:outline-none focus:border-anime-blue"
            disabled={loading}
          />
          <input
            type="text"
            value={coverUrl}
            onChange={(e) => setCoverUrl(e.target.value)}
            placeholder="Link ảnh bìa 🖼️"
            className="w-full p-3 mb-4 border-2 border-anime-pink rounded-lg font-anime focus:outline-none focus:border-anime-blue"
            disabled={loading}
          />
          <motion.button
            whileHover={{ scale: loading ? 1 : 1.05, boxShadow: loading ? 'none' : '0 0 15px rgba(84, 160, 255, 0.8)' }}
            whileTap={{ scale: loading ? 1 : 0.95 }}
            type="submit"
            className={`w-full p-3 bg-anime-blue text-white rounded-lg font-anime ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={loading}
          >
            {loading ? 'Đang xử lý...' : 'Lưu Thay Đổi 🌟'}
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
}

export default ProfileEdit;