import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useParams } from 'react-router-dom';
import api from '../utils/api';
import Post from '../components/Post';
import Comment from '../components/Comment';
import { toast } from 'react-toastify';

function PostDetail() {
  const { postId } = useParams();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [commentContent, setCommentContent] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchPost = async () => {
      setLoading(true);
      try {
        const postRes = await api.get(`/posts/${postId}`);
        setPost(postRes.data);
        const commentsRes = await api.get(`/posts/${postId}/comments`);
        setComments(commentsRes.data);
      } catch (error) {
        console.error(error);
        toast.error('Tải bài viết thất bại! 😿');
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [postId]);

  const handleComment = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post(`/posts/${postId}/comments`, { content: commentContent });
      setComments([...comments, res.data]);
      setCommentContent('');
      toast.success('Đã gửi bình luận! 💬');
    } catch (error) {
      console.error(error);
      toast.error('Gửi bình luận thất bại! 😿');
    } finally {
      setLoading(false);
    }
  };

  if (!post) return null;

  return (
    <div className="min-h-screen bg-anime-gradient p-6">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-2xl mx-auto"
      >
        {loading ? (
          <p className="text-center font-anime text-gray-500">Đang tải... ⏳</p>
        ) : (
          <>
            <Post post={post} />
            <div className="mt-6 bg-white p-6 rounded-2xl shadow-anime-glow">
              <h2 className="text-2xl font-anime text-anime-purple mb-4">Bình Luận</h2>
              <form onSubmit={handleComment} className="mb-6">
                <textarea
                  value={commentContent}
                  onChange={(e) => setCommentContent(e.target.value)}
                  placeholder="Viết bình luận... 💬"
                  className="w-full p-3 border-2 border-anime-pink rounded-lg font-anime focus:outline-none focus:border-anime-blue"
                  rows="3"
                  disabled={loading}
                />
                <motion.button
                  whileHover={{ scale: loading ? 1 : 1.05, boxShadow: loading ? 'none' : '0 0 15px rgba(84, 160, 255, 0.8)' }}
                  whileTap={{ scale: loading ? 1 : 0.95 }}
                  type="submit"
                  className={`mt-2 p-2 bg-anime-blue text-white rounded-lg font-anime ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                  disabled={loading}
                >
                  {loading ? 'Đang gửi...' : 'Gửi ✨'}
                </motion.button>
              </form>
              <div className="space-y-4">
                {comments.map((comment) => (
                  <Comment key={comment.id} comment={comment} />
                ))}
              </div>
            </div>
          </>
        )}
      </motion.div>
    </div>
  );
}

export default PostDetail;