const express = require('express');
const { authenticateToken } = require('../middleware/auth');
const db = require('../config/db');
const router = express.Router();

router.post('/', authenticateToken, async (req, res) => {
  const { content, media_url, visibility } = req.body;
  const userId = req.user.id;
  try {
    const result = await db.query(
      'INSERT INTO posts (user_id, content, media_url, visibility, created_at) VALUES ($1, $2, $3, $4, NOW()) RETURNING *',
      [userId, content, media_url, visibility]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ message: 'Error creating post', error: error.message });
  }
});

router.get('/feed', authenticateToken, async (req, res) => {
  try {
    const result = await db.query(
      `SELECT p.*, u.username 
       FROM posts p 
       JOIN users u ON p.user_id = u.id 
       WHERE p.visibility = 'public' 
       ORDER BY p.created_at DESC`
    );
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching feed', error: error.message });
  }
});

router.get('/user/:userId', authenticateToken, async (req, res) => {
  const { userId } = req.params;
  const id = userId === 'me' ? req.user.id : userId;
  try {
    const result = await db.query(
      'SELECT p.*, u.username FROM posts p JOIN users u ON p.user_id = u.id WHERE p.user_id = $1 ORDER BY p.created_at DESC',
      [id]
    );
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching posts', error: error.message });
  }
});

router.get('/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  try {
    const result = await db.query(
      'SELECT p.*, u.username FROM posts p JOIN users u ON p.user_id = u.id WHERE p.id = $1',
      [id]
    );
    if (!result.rows[0]) return res.status(404).json({ message: 'Post not found' });
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching post', error: error.message });
  }
});

router.post('/:id/comments', authenticateToken, async (req, res) => {
  const { id } = req.params;
  const { content } = req.body;
  const userId = req.user.id;
  try {
    const result = await db.query(
      'INSERT INTO comments (post_id, user_id, content, created_at) VALUES ($1, $2, $3, NOW()) RETURNING *',
      [id, userId, content]
    );
    const comment = result.rows[0];
    comment.username = req.user.username;
    res.status(201).json(comment);
  } catch (error) {
    res.status(500).json({ message: 'Error adding comment', error: error.message });
  }
});

router.get('/:id/comments', authenticateToken, async (req, res) => {
  const { id } = req.params;
  try {
    const result = await db.query(
      'SELECT c.*, u.username FROM comments c JOIN users u ON c.user_id = u.id WHERE c.post_id = $1 ORDER BY c.created_at',
      [id]
    );
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching comments', error: error.message });
  }
});

module.exports = router;