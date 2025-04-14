import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

function NotFound() {
  return (
    <div className="min-h-screen bg-anime-gradient flex items-center justify-center p-6">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center relative"
      >
        <motion.img
          src="/chibi.png"
          className="w-32 h-32 mx-auto mb-6 animate-bounce"
        />
        <h1 className="text-5xl font-anime text-white mb-4 drop-shadow-lg">
          404 - Lạc Lối Rồi! 😿
        </h1>
        <p className="text-xl font-anime text-white mb-6">
          Trang này không tồn tại đâu~ Quay về nhé!
        </p>
        <Link to="/feed">
          <motion.button
            whileHover={{ scale: 1.05, boxShadow: '0 0 15px rgba(84, 160, 255, 0.8)' }}
            whileTap={{ scale: 0.95 }}
            className="p-3 bg-anime-blue text-white rounded-lg font-anime"
          >
            Về Trang Chủ 🌟
          </motion.button>
        </Link>
      </motion.div>
    </div>
  );
}

export default NotFound;