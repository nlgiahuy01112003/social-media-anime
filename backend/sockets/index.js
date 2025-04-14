const jwt = require('jsonwebtoken');
const CryptoJS = require('crypto-js');
const db = require('../config/db');

module.exports = (io) => {
  io.on('connection', (socket) => {
    const token = socket.handshake.auth.token;
    if (!token) return socket.disconnect();

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) return socket.disconnect();
      socket.user = user;
    });

    socket.on('join', (userId) => {
      socket.join(userId);
    });

    socket.on('message', async (data) => {
      const { receiverId, content } = data;
      try {
        const encryptedContent = CryptoJS.AES.encrypt(
          content,
          process.env.JWT_SECRET
        ).toString();
        const result = await db.query(
          'INSERT INTO messages (sender_id, receiver_id, encrypted_content, timestamp) VALUES ($1, $2, $3, NOW()) RETURNING *',
          [socket.user.id, receiverId, encryptedContent]
        );
        const message = {
          ...result.rows[0],
          content,
          username: socket.user.username,
        };
        io.to(receiverId).emit('message', message);
        socket.emit('message', message);
      } catch (error) {
        console.error(error);
      }
    });

    socket.on('notification', async (data) => {
      const { userId, type, sourceId } = data;
      try {
        const result = await db.query(
          'INSERT INTO notifications (user_id, type, source_id, created_at) VALUES ($1, $2, $3, NOW()) RETURNING *',
          [userId, type, sourceId]
        );
        io.to(userId).emit('notification', result.rows[0]);
      } catch (error) {
        console.error(error);
      }
    });

    socket.on('offer', ({ offer, receiverId }) => {
      socket.to(receiverId).emit('offer', offer);
    });

    socket.on('answer', ({ answer, receiverId }) => {
      socket.to(receiverId).emit('answer', answer);
    });

    socket.on('ice-candidate', ({ candidate, receiverId }) => {
      socket.to(receiverId).emit('ice-candidate', candidate);
    });
  });
};