import { useState } from 'react';
import { motion } from 'framer-motion';
import api from '../utils/api';
import { toast } from 'react-toastify';

function Security() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [twoFactor, setTwoFactor] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Mật khẩu không khớp! 😿');
      toast.error('Mật khẩu không khớp! 😿');
      return;
    }
    if (password.length < 6) {
      setError('Mật khẩu phải có ít nhất 6 ký tự! 🔒');
      toast.error('Mật khẩu phải có ít nhất 6 ký tự! 🔒');
      return;
    }
    setLoading(true);
    try {
      await api.put('/users/security', { password, two_factor: twoFactor });
      toast.success('Cập nhật bảo mật thành công! 🌟');
      setPassword('');
      setConfirmPassword('');
      setError('');
    } catch (error) {
      console.error(error);
      setError('Cập nhật bảo mật thất bại! Hãy thử lại nhé~ 😺');
      toast.error('Cập nhật bảo mật thất bại! 😺');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-anime-gradient p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-md mx-auto bg-white p-8 rounded-2xl shadow-anime-glow relative"
      >
        <motion.img
          src="/sparkle.png"
          className="absolute top-0 right-0 w-12 h-12 animate-sparkle"
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 5 }}
        />
        <h2 className="text-3xl font-anime text-anime-purple mb-6 text-center">
          Bảo Mật Anime 🔒
        </h2>
        {error && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-red-500 font-anime mb-4 text-center"
          >
            {error}
          </motion.p>
        )}
        <form onSubmit={handleSubmit}>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Mật khẩu mới 🔑"
            className="w-full p-3 mb-4 border-2 border-anime-pink rounded-lg font-anime focus:outline-none focus:border-anime-blue"
            disabled={loading}
          />
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Xác nhận mật khẩu 🔑"
            className="w-full p-3 mb-4 border-2 border-anime-pink rounded-lg font-anime focus:outline-none focus:border-anime-blue"
            disabled={loading}
          />
          <label className="flex items-center mb-4 font-anime">
            <input
              type="checkbox"
              checked={twoFactor}
              onChange={(e) => setTwoFactor(e.target.checked)}
              className="mr-2"
              disabled={loading}
            />
            Bật xác minh 2 bước 📱
          </label>
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

export default Security;