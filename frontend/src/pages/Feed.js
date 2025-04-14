import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import api from '../utils/api';
import { Link } from 'react-router-dom';
import Post from '../components/Post';

function Feed() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await api.get('/posts/feed');
        setPosts(res.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchPosts();
  }, []);

  return (
    <div className="min-h-screen bg-anime-gradient p-6">
      <motion.h1
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="text-4xl font-anime text-white text-center mb-8 drop-shadow-lg"
      >
        Bảng Tin Anime 🌌
      </motion.h1>
      <Link to="/post/create">
        <motion.button
          whileHover={{ scale: 1.05 }}
          className="mb-6 p-3 bg-anime-purple text-white rounded-lg font-anime mx-auto block"
        >
          Tạo Bài Viết Mới ✨
        </motion.button>
      </Link>
      <div className="space-y-6 max-w-2xl mx-auto">
        {posts.map((post) => (
          <Post key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
}

export default Feed;