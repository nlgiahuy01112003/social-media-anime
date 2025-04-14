import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useParams, Link } from 'react-router-dom';
import api from '../utils/api';
import Post from '../components/Post';

function Profile() {
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get(`/users/${userId || 'me'}`);
        setUser(res.data);
        const postsRes = await api.get(`/posts/user/${userId || 'me'}`);
        setPosts(postsRes.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchProfile();
  }, [userId]);

  if (!user) return null;

  return (
    <div className="min-h-screen bg-anime-gradient">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="relative"
      >
        <img
          src={user.cover_url || '/cover-anime.jpg'}
          alt="Cover"
          className="w-full h-64 object-cover"
        />
        <motion.img
          src={user.avatar_url || '/avatar-anime.jpg'}
          alt="Avatar"
          className="absolute -bottom-16 left-8 w-32 h-32 rounded-full border-4 border-white shadow-anime-glow"
          whileHover={{ scale: 1.1 }}
        />
      </motion.div>
      <div className="container mx-auto p-6 mt-16">
        <h1 className="text-3xl font-anime text-anime-purple">{user.username}</h1>
        <p className="mt-2 font-anime text-gray-700">{user.bio || 'Chưa có tiểu sử~ 😺'}</p>
        {!userId && (
          <Link to="/profile/edit">
            <motion.button
              whileHover={{ scale: 1.05 }}
              className="mt-4 p-2 bg-anime-blue text-white rounded-lg font-anime"
            >
              Chỉnh Sửa Profile 🌟
            </motion.button>
          </Link>
        )}
        <div className="mt-6">
          <h2 className="text-2xl font-anime text-anime-purple">Bài Viết</h2>
          <div className="space-y-6 mt-4">
            {posts.map((post) => (
              <Post key={post.id} post={post} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;