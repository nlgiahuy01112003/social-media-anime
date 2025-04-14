// frontend/src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Layout from './components/Layout';
import Login from './pages/Login';
import Register from './pages/Register';
import Feed from './pages/Feed';
import Profile from './pages/Profile';
import ProfileEdit from './pages/ProfileEdit';
import PostCreate from './pages/PostCreate';
import PostDetail from './pages/PostDetail';
import Friends from './pages/Friends';
import ChatList from './pages/ChatList';
import ChatDetail from './pages/ChatDetail';
import VideoCallPage from './pages/VideoCallPage';
import Search from './pages/Search';
import Notifications from './pages/Notifications';
import Security from './pages/Security';
import Settings from './pages/Settings';
import NotFound from './pages/NotFound';
import Gacha from './pages/Gacha';
import Sakura from './components/Sakura';

function App() {
  return (
    <Router>
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="fixed inset-0 pointer-events-none z-0">
        {[...Array(12)].map((_, i) => (
          <Sakura key={i} />
        ))}
      </div>
      <Routes>
        {/* Các trang không dùng Layout */}
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        {/* Các trang dùng Layout */}
        <Route
          path="/*"
          element={
            <Layout>
              <Routes>
                <Route path="/feed" element={<Feed />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/profile/:userId" element={<Profile />} />
                <Route path="/profile/edit" element={<ProfileEdit />} />
                <Route path="/post/create" element={<PostCreate />} />
                <Route path="/post/:postId" element={<PostDetail />} />
                <Route path="/friends" element={<Friends />} />
                <Route path="/chat" element={<ChatList />} />
                <Route path="/chat/:userId" element={<ChatDetail />} />
                <Route path="/call/:userId" element={<VideoCallPage />} />
                <Route path="/search" element={<Search />} />
                <Route path="/notifications" element={<Notifications />} />
                <Route path="/security" element={<Security />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/gacha" element={<Gacha />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Layout>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;