// frontend/src/pages/Login.js
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { toast } from 'react-toastify';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      console.log('Sending login request:', { email });
      const response = await api.post('/auth/login', { email, password });
      console.log('Login response:', response.data);
      localStorage.setItem('token', response.data.token);
      toast.success('Đăng nhập thành công! Chào mừng bạn! 🌸');
      navigate('/feed');
    } catch (error) {
      console.error('Login error:', error.response?.data || error.message);
      toast.error(error.response?.data?.message || 'Đăng nhập thất bại! 😿');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-anime-gradient font-anime flex items-center justify-center relative overflow-hidden p-4">
      <motion.img
        src="/chibi.png"
        className="absolute top-4 right-4 w-12 h-12 md:w-12 md:h-12 sm:w-10 sm:h-10 object-cover z-10"
        animate={{ y: [0, -10, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
        alt="Chibi character"
      />

      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="relative p-8 bg-white rounded-2xl shadow-anime-glow w-full max-w-md z-10"
      >
        <h2 className="text-3xl font-anime text-anime-purple mb-6 text-center">
          Đăng Nhập Anime World 🌸
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email của bạn 💌"
              className="w-full p-3 border-2 border-anime-pink rounded-lg focus:outline-none focus:border-anime-blue font-anime"
              disabled={loading}
            />
          </div>
          <div className="mb-4">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Mật khẩu bí mật 🔒"
              className="w-full p-3 border-2 border-anime-pink rounded-lg focus:outline-none focus:border-anime-blue font-anime"
              disabled={loading}
            />
          </div>
          <motion.button
            whileHover={{ scale: loading ? 1 : 1.05, boxShadow: '0 0 15px rgba(84, 160, 255, 0.8)' }}
            whileTap={{ scale: loading ? 1 : 0.95 }}
            type="submit"
            className={`w-full p-3 bg-anime-blue text-white rounded-lg font-anime ${
              loading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            disabled={loading}
          >
            {loading ? 'Đang xử lý...' : 'Đăng Nhập Ngay! 🌟'}
          </motion.button>
        </form>

        <p className="mt-4 text-center text-gray-600">
          Chưa có tài khoản?{' '}
          <Link to="/register" className="text-anime-blue hover:underline">
            Đăng ký ngay! 🌟
          </Link>
        </p>
      </motion.div>
    </div>
  );
}

export default Login;