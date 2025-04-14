// filepath: g:\hoc truong\cong_cu\social-media-anime\backend\index.js
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cookieParser = require('cookie-parser');
const csrf = require('csurf');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const postRoutes = require('./routes/posts');
const friendRoutes = require('./routes/friends');
const messageRoutes = require('./routes/messages');
const notificationRoutes = require('./routes/notifications');
const callRoutes = require('./routes/calls');
const initializeSocket = require('./sockets');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

// Enable CORS
app.use(
  cors({
    origin: 'http://localhost:3000',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-CSRF-Token'],
  })
);

// Middleware
app.use(express.json());
app.use(cookieParser());
const csrfProtection = csrf({ cookie: { httpOnly: true, sameSite: 'lax' } });

// Log requests for debugging
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`, req.body);
  next();
});

// CSRF token endpoint
app.get('/api/csrf-token', csrfProtection, (req, res) => {
  try {
    res.json({ csrfToken: req.csrfToken() });
  } catch (error) {
    console.error('Error generating CSRF token:', error);
    res.status(500).json({ error: 'Failed to generate CSRF token' });
  }
});

// Routes
app.use('/api/auth', authRoutes); // No CSRF for auth
app.use('/api/users', csrfProtection, userRoutes);
app.use('/api/posts', csrfProtection, postRoutes);
app.use('/api/friends', csrfProtection, friendRoutes);
app.use('/api/messages', csrfProtection, messageRoutes);
app.use('/api/notifications', csrfProtection, notificationRoutes);
app.use('/api/calls', csrfProtection, callRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  if (err.code === 'EBADCSRFTOKEN') {
    return res.status(403).json({ message: 'Invalid CSRF token' });
  }
  res.status(500).json({ message: 'Internal server error', error: err.message });
});

initializeSocket(io);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));