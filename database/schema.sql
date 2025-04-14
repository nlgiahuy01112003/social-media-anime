-- Xóa tất cả bảng để tránh xung đột
DROP TABLE IF EXISTS likes, friends, messages, posts, comments, notifications, video_calls, users CASCADE;

-- Tạo bảng users trước
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(255) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  avatar_url TEXT,
  cover_url TEXT,
  bio TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tạo bảng posts
CREATE TABLE posts (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  content TEXT,
  media_url TEXT,
  visibility VARCHAR(20) NOT NULL CHECK (visibility IN ('public', 'friends', 'private')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tạo bảng likes (sau posts)
CREATE TABLE likes (
  id SERIAL PRIMARY KEY,
  post_id INTEGER REFERENCES posts(id),
  user_id INTEGER REFERENCES users(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE (post_id, user_id)
);

-- Tạo bảng friends
CREATE TABLE friends (
  user_id_1 INTEGER REFERENCES users(id),
  user_id_2 INTEGER REFERENCES users(id),
  status VARCHAR(20) NOT NULL CHECK (status IN ('pending', 'accepted', 'rejected')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CHECK (user_id_1 < user_id_2),
  PRIMARY KEY (user_id_1, user_id_2)
);

-- Tạo bảng messages
CREATE TABLE messages (
  id SERIAL PRIMARY KEY,
  sender_id INTEGER REFERENCES users(id),
  receiver_id INTEGER REFERENCES users(id),
  encrypted_content TEXT NOT NULL,
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tạo bảng comments
CREATE TABLE comments (
  id SERIAL PRIMARY KEY,
  post_id INTEGER REFERENCES posts(id),
  user_id INTEGER REFERENCES users(id),
  content TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tạo bảng notifications
CREATE TABLE notifications (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  type VARCHAR(50) NOT NULL CHECK (type IN ('friend_request', 'post_like', 'comment', 'message', 'call')),
  source_id INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tạo bảng video_calls
CREATE TABLE video_calls (
  id SERIAL PRIMARY KEY,
  caller_id INTEGER REFERENCES users(id),
  receiver_id INTEGER REFERENCES users(id),
  status VARCHAR(20) NOT NULL CHECK (status IN ('initiated', 'accepted', 'rejected', 'ended')),
  started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tạo index
CREATE INDEX idx_posts_user_id ON posts(user_id);
CREATE INDEX idx_messages_sender_receiver ON messages(sender_id, receiver_id);
CREATE INDEX idx_notifications_user_id ON notifications(user_id);