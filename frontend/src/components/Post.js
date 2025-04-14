import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

function Post({ post }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="p-6 bg-white rounded-2xl shadow-anime-glow relative"
    >
      <motion.img
        src="/chibi.png"
        alt="Chibi Icon"
        className="absolute -top-4 -left-4 w-12 h-12 animate-bounce"
      />
      <Link to={`/profile/${post.user_id}`}>
        <h3 className="text-xl font-anime text-anime-purple">{post.username}</h3>
      </Link>
      <p className="mt-2 font-anime text-gray-700">{post.content}</p>
      {post.media_url && (
        <motion.img
          src={post.media_url}
          alt="Post"
          loading="lazy"
          className="mt-4 rounded-lg border-2 border-anime-pink"
          whileHover={{ scale: 1.02 }}
        />
      )}
      <div className="mt-4 flex space-x-4">
        <motion.button
          whileHover={{ scale: 1.2 }}
          className="text-anime-blue font-anime"
        >
          ❤️ Thích
        </motion.button>
        <Link to={`/post/${post.id}`}>
          <motion.button
            whileHover={{ scale: 1.2 }}
            className="text-anime-blue font-anime"
          >
            💬 Bình luận
          </motion.button>
        </Link>
      </div>
    </motion.div>
  );
}

export default Post;