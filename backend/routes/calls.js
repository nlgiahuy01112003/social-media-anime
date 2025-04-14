const express = require('express');
const { authenticateToken } = require('../middleware/auth');
const db = require('../config/db');
const router = express.Router();

router.post('/initiate', authenticateToken, async (req, res) => {
  const { receiverId } = req.body;
  const callerId = req.user.id;
  try {
    const result = await db.query(
      'INSERT INTO video_calls (caller_id, receiver_id, status, started_at) VALUES ($1, $2, $3, NOW()) RETURNING *',
      [callerId, receiverId, 'initiated']
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ message: 'Error initiating call', error: error.message });
  }
});

module.exports = router;