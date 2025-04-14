import { motion } from 'framer-motion';

function Sakura() {
  return (
    <motion.div
      className="absolute w-4 h-4 bg-pink-300 rounded-full"
      style={{ left: Math.random() * 100 + 'vw' }}
      animate={{ y: '100vh', rotate: 360 }}
      transition={{ duration: 5 + Math.random() * 5, repeat: Infinity }}
    />
  );
}

export default Sakura;