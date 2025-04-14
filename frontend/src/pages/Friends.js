import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import api from '../utils/api';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

function Friends() {
  const [friends, setFriends] = useState([]);
  const [requests, setRequests] = useState([]);
  const [searchId, setSearchId] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchFriends = async () => {
      setLoading(true);
      try {
        const friendsRes = await api.get('/friends');
        setFriends(friendsRes.data);
        const requestsRes = await api.get('/friends/requests');
        setRequests(requestsRes.data);
      } catch (error) {
        console.error(error);
        toast.error('Tải danh sách bạn bè thất bại! 😿');
      } finally {
        setLoading(false);
      }
    };
    fetchFriends();
  }, []);

  const handleAccept = async (userId) => {
    setLoading(true);
    try {
      await api.post(`/friends/accept/${userId}`);
      setRequests(requests.filter((req) => req.id !== userId));
      setFriends([...friends, { id: userId, username: requests.find((r) => r.id === userId).username }]);
      toast.success('Đã chấp nhận kết bạn! 🌟');
    } catch (error) {
      console.error(error);
      toast.error('Chấp nhận thất bại! 😿');
    } finally {
      setLoading(false);
    }
  };

  const handleRequest = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/friends/request', { userId: searchId });
      toast.success('Đã gửi lời mời kết bạn! ✨');
      setSearchId('');
    } catch (error) {
      console.error(error);
      toast.error('Gửi lời mời thất bại! 😿');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-anime-gradient p-6">
      <motion.h1
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="text-4xl font-anime text-white text-center mb-8"
      >
        Bạn Bè Anime 👥
      </motion.h1>
      <div className="max-w-2xl mx-auto">
        <form onSubmit={handleRequest} className="mb-6">
          <input
            type="text"
            value={searchId}
            onChange={(e) => setSearchId(e.target.value)}
            placeholder="Nhập ID người dùng để kết bạn..."
            className="w-full p-3 border-2 border-anime-pink rounded-lg font-anime focus:outline-none focus:border-anime-blue"
            disabled={loading}
          />
          <motion.button
            whileHover={{ scale: loading ? 1 : 1.05, boxShadow: loading ? 'none' : '0 0 15px rgba(84, 160, 255, 0.8)' }}
            whileTap={{ scale: loading ? 1 : 0.95 }}
            type="submit"
            className={`mt-2 p-2 bg-anime-blue text-white rounded-lg font-anime ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={loading}
          >
            {loading ? 'Đang gửi...' : 'Gửi Lời Mời 🌟'}
          </motion.button>
        </form>
        <h2 className="text-2xl font-anime text-anime-purple mb-4">Lời Mời Kết Bạn</h2>
        {loading ? (
          <p className="text-center font-anime text-gray-500">Đang tải... ⏳</p>
        ) : (
          <div className="space-y-4 mb-8">
            {requests.map((req) => (
              <motion.div
                key={req.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="p-4 bg-white rounded-2xl shadow-anime-glow flex justify-between"
              >
                <p className="font-anime">{req.username}</p>
                <motion.button
                  whileHover={{ scale: loading ? 1 : 1.05, boxShadow: loading ? 'none' : '0 0 15px rgba(84, 160, 255, 0.8)' }}
                  whileTap={{ scale: loading ? 1 : 0.95 }}
                  onClick={() => handleAccept(req.id)}
                  className={`p-2 bg-anime-blue text-white rounded-lg font-anime ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                  disabled={loading}
                >
                  Chấp Nhận 🌟
                </motion.button>
              </motion.div>
            ))}
          </div>
        )}
        <h2 className="text-2xl font-anime text-anime-purple mb-4">Danh Sách Bạn Bè</h2>
        <div className="space-y-4">
          {friends.map((friend) => (
            <motion.div
              key={friend.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="p-4 bg-white rounded-2xl shadow-anime-glow"
            >
              <Link to={`/profile/${friend.id}`}>
                <p className="font-anime text-anime-purple">{friend.username}</p>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Friends;