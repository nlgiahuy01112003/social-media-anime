const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../config/db');
const { z } = require('zod');
const router = express.Router();

const registerSchema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters'),
  email: z.string().email('Invalid email format'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

router.post('/register', async (req, res) => {
  console.log('Register request received:', req.body);
  try {
    // Validate input
    const validatedData = registerSchema.parse(req.body);
    const { username, email, password } = validatedData;

    // Hash password
    console.log('Hashing password...');
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert user
    console.log('Inserting user into database...');
    const result = await db.query(
      'INSERT INTO users (username, email, password_hash, created_at) VALUES ($1, $2, $3, NOW()) RETURNING id, username, email',
      [username, email, hashedPassword]
    );

    console.log('User registered successfully:', result.rows[0]);
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error in /register:', error);
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: 'Validation error', errors: error.errors });
    }
    if (error.code === '23505') {
      const field = error.detail.includes('username') ? 'username' : 'email';
      return res.status(400).json({ message: `${field} already exists` });
    }
    res.status(500).json({ message: 'Error registering user', error: error.message });
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  console.log('Login request received:', { email });
  try {
    const result = await db.query('SELECT * FROM users WHERE email = $1', [email]);
    const user = result.rows[0];
    if (!user) {
      console.log('User not found for email:', email);
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      console.log('Password mismatch for email:', email);
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    const token = jwt.sign(
      { id: user.id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
    console.log('Login successful, token generated for user:', user.username);
    res.json({ token });
  } catch (error) {
    console.error('Error in /login:', error);
    res.status(500).json({ message: 'Error logging in', error: error.message });
  }
});

module.exports = router;