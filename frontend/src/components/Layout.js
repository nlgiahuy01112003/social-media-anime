// frontend/src/components/Layout.js
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FaHome, FaUserFriends, FaBell, FaDice, FaSignOutAlt, FaUser, FaComments, FaSearch, FaCog, FaLock, FaBars } from 'react-icons/fa';
import { toast } from 'react-toastify';
import Confetti from 'react-confetti';

const Layout = ({ children }) => {
  const [showConfetti, setShowConfetti] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (location.pathname === '/feed' || location.pathname === '/gacha') {
      setShowConfetti(true);
    }
  }, [location]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    toast.info('Đăng xuất thành công! 👋');
    navigate('/login');
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="min-h-screen bg-anime-gradient font-anime flex flex-col relative overflow-hidden">
      <AnimatePresence>
        {showConfetti && (
          <Confetti
            width={window.innerWidth}
            height={window.innerHeight}
            recycle={false}
            numberOfPieces={200}
            onConfettiComplete={() => setShowConfetti(false)}
            className="z-0"
          />
        )}
      </AnimatePresence>

      <nav className="bg-anime-purple text-white shadow-lg fixed top-0 left-0 right-0 z-30 h-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between">
          <div className="flex items-center">
            <Link to="/feed" className="text-2xl font-bold flex items-center">
              <motion.img
                src="/chibi.png"
                alt="Chibi Logo"
                className="w-10 h-10 md:w-10 md:h-10 sm:w-8 sm:h-8 object-cover mr-2"
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.5 }}
              />
              Anime World 🌸
            </Link>
          </div>

          <div className="md:hidden">
            <button onClick={toggleSidebar} className="p-2 focus:outline-none">
              <FaBars size={24} />
            </button>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            <Link to="/feed" className="hover:bg-anime-blue p-2 rounded-full transition">
              <FaHome size={20} />
            </Link>
            <Link to="/friends" className="hover:bg-anime-blue p-2 rounded-full transition">
              <FaUserFriends size={20} />
            </Link>
            <Link to="/chat" className="hover:bg-anime-blue p-2 rounded-full transition">
              <FaComments size={20} />
            </Link>
            <Link to="/notifications" className="hover:bg-anime-blue p-2 rounded-full transition">
              <FaBell size={20} />
            </Link>
            <Link to="/gacha" className="hover:bg-anime-blue p-2 rounded-full transition">
              <FaDice size={20} />
            </Link>
            <Link to="/search" className="hover:bg-anime-blue p-2 rounded-full transition">
              <FaSearch size={20} />
            </Link>
            <button
              onClick={handleLogout}
              className="hover:bg-anime-blue p-2 rounded-full transition"
            >
              <FaSignOutAlt size={20} />
            </button>
          </div>
        </div>
      </nav>

      <div
        className={`fixed top-16 h-[calc(100vh-4rem)] bg-anime-pink text-white flex flex-col items-center py-4 space-y-6 z-20 transition-all duration-300 ${
          isSidebarOpen ? 'w-16 left-0' : 'w-16 left-0 md:w-16 md:left-0 -left-16'
        }`}
      >
        <Link to="/profile" className="hover:bg-anime-blue p-2 rounded-full transition">
          <motion.img
            src="/chibi.png"
            alt="Profile Chibi"
            className="w-8 h-8 object-cover"
            whileHover={{ scale: 1.2 }}
          />
        </Link>
        <Link to="/friends" className="hover:bg-anime-blue p-2 rounded-full transition">
          <FaUserFriends size={24} />
        </Link>
        <Link to="/chat" className="hover:bg-anime-blue p-2 rounded-full transition">
          <FaComments size={24} />
        </Link>
        <Link to="/gacha" className="hover:bg-anime-blue p-2 rounded-full transition">
          <FaDice size={24} />
        </Link>
        <Link to="/settings" className="hover:bg-anime-blue p-2 rounded-full transition">
          <FaCog size={24} />
        </Link>
        <Link to="/security" className="hover:bg-anime-blue p-2 rounded-full transition">
          <FaLock size={24} />
        </Link>
      </div>

      <main className="flex-1 mt-16 md:ml-16 p-6 max-w-7xl mx-auto w-full">
        {children}
      </main>

      <footer className="bg-anime-purple text-white py-4 w-full shrink-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p>© 2025 Anime World. Tất cả quyền được bảo lưu. 🌸</p>
          <p>
            Made with 💖 by <a href="https://github.com/your-username" className="underline">Your Name</a>
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;