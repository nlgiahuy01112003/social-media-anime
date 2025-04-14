import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

function Comment({ comment }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-4 bg-anime-pink bg-opacity-20 rounded-lg"
    >
      <Link to={`/profile/${comment.user_id}`}>
        <p className="font-anime text-anime-purple">{comment.username}</p>
      </Link>
      <p className="font-anime">{comment.content}</p>
    </motion.div>
  );
}

export default Comment;