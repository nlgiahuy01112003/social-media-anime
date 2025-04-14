import { motion } from 'framer-motion';

function Notification({ notification }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={`p-4 rounded-2xl shadow-anime-glow ${
        notification.is_read ? 'bg-white' : 'bg-anime-pink bg-opacity-30'
      }`}
    >
      <p className="font-anime text-anime-purple">
        {notification.type === 'like' && 'Có người thích bài viết của bạn! ❤️'}
        {notification.type === 'comment' && 'Có bình luận mới! 💬'}
        {notification.type === 'friend_request' && 'Có lời mời kết bạn! 👥'}
        {notification.type === 'call' && 'Có cuộc gọi đến! 📹'}
      </p>
    </motion.div>
  );
}

export default Notification;