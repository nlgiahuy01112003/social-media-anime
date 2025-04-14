const express = require('express');
const { authenticateToken } = require('../middleware/auth');
const db = require('../config/db');
const CryptoJS = require('crypto-js');
const router = express.Router();

router.get('/conversations', authenticateToken, async (req, res) => {
  const userId = req.user.id;
  try {
    const result = await db.query(
      `SELECT DISTINCT ON (u.id) u.id, u.username, m.encrypted_content AS last_message
       FROM messages m
       JOIN users u ON u.id = CASE 
         WHEN m.sender_id = $1 THEN m.receiver_id 
         ELSE m.sender_id 
       END
       WHERE m.sender_id = $1 OR m.receiver_id = $1
       ORDER BY u.id, m.timestamp DESC`,
      [userId]
    );
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching conversations', error: error.message });
  }
});

router.get('/:userId', authenticateToken, async (req, res) => {
  const { userId } = req.params;
  const currentUserId = req.user.id;
  try {
    const result = await db.query(
      `SELECT m.*, 
              CASE WHEN m.sender_id = $1 THEN u1.username ELSE u2.username END AS username
       FROM messages m
       JOIN users u1 ON u1.id = m.sender_id
       JOIN users u2 ON u2.id = m.receiver_id
       WHERE (m.sender_id = $1 AND m.receiver_id = $2) OR (m.sender_id = $2 AND m.receiver_id = $1)
       ORDER BY m.timestamp`,
      [currentUserId, userId]
    );
    const messages = result.rows.map((msg) => ({
      ...msg,
      content: CryptoJS.AES.decrypt(msg.encrypted_content, process.env.JWT_SECRET).toString(
        CryptoJS.enc.Utf8
      ),
    }));
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching messages', error: error.message });
  }
});

module.exports = router;