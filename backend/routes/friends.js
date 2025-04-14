const express = require('express');
const { authenticateToken } = require('../middleware/auth');
const db = require('../config/db');
const router = express.Router();

router.get('/', authenticateToken, async (req, res) => {
  const userId = req.user.id;
  try {
    const result = await db.query(
      `SELECT u.id, u.username 
       FROM friends f 
       JOIN users u ON u.id = f.user_id_2 
       WHERE f.user_id_1 = $1 AND f.status = 'accepted'
       UNION
       SELECT u.id, u.username 
       FROM friends f 
       JOIN users u ON u.id = f.user_id_1 
       WHERE f.user_id_2 = $1 AND f.status = 'accepted'`,
      [userId]
    );
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching friends', error: error.message });
  }
});

router.get('/requests', authenticateToken, async (req, res) => {
  const userId = req.user.id;
  try {
    const result = await db.query(
      `SELECT u.id, u.username 
       FROM friends f 
       JOIN users u ON u.id = f.user_id_1 
       WHERE f.user_id_2 = $1 AND f.status = 'pending'`,
      [userId]
    );
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching requests', error: error.message });
  }
});

router.post('/request', authenticateToken, async (req, res) => {
  const { userId: friendId } = req.body;
  const userId = req.user.id;
  try {
    await db.query(
      'INSERT INTO friends (user_id_1, user_id_2, status, created_at) VALUES ($1, $2, $3, NOW())',
      [userId, friendId, 'pending']
    );
    res.status(201).json({ message: 'Friend request sent' });
  } catch (error) {
    res.status(500).json({ message: 'Error sending request', error: error.message });
  }
});

router.post('/accept/:userId', authenticateToken, async (req, res) => {
  const { userId: friendId } = req.params;
  const userId = req.user.id;
  try {
    await db.query(
      'UPDATE friends SET status = $1 WHERE user_id_1 = $2 AND user_id_2 = $3',
      ['accepted', friendId, userId]
    );
    res.json({ message: 'Friend request accepted' });
  } catch (error) {
    res.status(500).json({ message: 'Error accepting request', error: error.message });
  }
});

module.exports = router;