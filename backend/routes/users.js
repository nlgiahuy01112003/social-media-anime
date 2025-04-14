const express = require('express');
const { authenticateToken } = require('../middleware/auth');
const db = require('../config/db');
const router = express.Router();

router.get('/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  const userId = id === 'me' ? req.user.id : id;
  try {
    const result = await db.query(
      'SELECT id, username, email, avatar_url, cover_url, bio FROM users WHERE id = $1',
      [userId]
    );
    if (!result.rows[0]) return res.status(404).json({ message: 'User not found' });
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user', error: error.message });
  }
});

router.put('/me', authenticateToken, async (req, res) => {
  const { bio, avatar_url, cover_url } = req.body;
  try {
    const result = await db.query(
      'UPDATE users SET bio = $1, avatar_url = $2, cover_url = $3 WHERE id = $4 RETURNING *',
      [bio, avatar_url, cover_url, req.user.id]
    );
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ message: 'Error updating profile', error: error.message });
  }
});

router.put('/security', authenticateToken, async (req, res) => {
  const { password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    await db.query('UPDATE users SET password_hash = $1 WHERE id = $2', [
      hashedPassword,
      req.user.id,
    ]);
    res.json({ message: 'Password updated' });
  } catch (error) {
    res.status(500).json({ message: 'Error updating security', error: error.message });
  }
});

router.get('/search', authenticateToken, async (req, res) => {
  const { q } = req.query;
  try {
    const result = await db.query(
      'SELECT id, username, avatar_url FROM users WHERE username ILIKE $1 OR email ILIKE $1',
      [`%${q}%`]
    );
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ message: 'Error searching users', error: error.message });
  }
});

module.exports = router;