import { useState } from 'react';
import { motion } from 'framer-motion';

function Settings() {
  const [theme, setTheme] = useState('light');
  const [language, setLanguage] = useState('vi');
  const [notifications, setNotifications] = useState(true);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Lưu cài đặt (giả lập, có thể tích hợp API sau)
    alert(`Đã lưu: Chủ đề ${theme}, Ngôn ngữ ${language}, Thông báo ${notifications ? 'Bật' : 'Tắt'}! 🌟`);
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
          src="/chibi.png"
          className="absolute -top-8 -left-8 w-16 h-16 animate-bounce"
        />
        <h2 className="text-3xl font-anime text-anime-purple mb-6 text-center">
          Cài Đặt Anime ⚙️
        </h2>
        <form onSubmit={handleSubmit}>
          <label className="block mb-4 font-anime">
            Chủ đề:
            <select
              value={theme}
              onChange={(e) => setTheme(e.target.value)}
              className="w-full p-3 mt-2 border-2 border-anime-pink rounded-lg font-anime focus:outline-none focus:border-anime-blue"
            >
              <option value="light">Sáng 🌞</option>
              <option value="dark">Tối 🌙</option>
              <option value="anime">Anime ✨</option>
            </select>
          </label>
          <label className="block mb-4 font-anime">
            Ngôn ngữ:
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="w-full p-3 mt-2 border-2 border-anime-pink rounded-lg font-anime focus:outline-none focus:border-anime-blue"
            >
              <option value="vi">Tiếng Việt 🇻🇳</option>
              <option value="en">English 🇬🇧</option>
              <option value="jp">日本語 🇯🇵</option>
            </select>
          </label>
          <label className="flex items-center mb-4 font-anime">
            <input
              type="checkbox"
              checked={notifications}
              onChange={(e) => setNotifications(e.target.checked)}
              className="mr-2"
            />
            Bật thông báo 🔔
          </label>
          <motion.button
            whileHover={{ scale: 1.05, boxShadow: '0 0 15px rgba(84, 160, 255, 0.8)' }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            className="w-full p-3 bg-anime-blue text-white rounded-lg font-anime"
          >
            Lưu Cài Đặt 🌟
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
}

export default Settings;