const express = require('express');
const router = express.Router();
const pool = require('../db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// sign up
router.post('/signup', async (req, res) => {
    const { email, password } = req.body;
    try {
        const existingUser = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        if (existingUser.rows.length > 0) {
            return res.status(400).json({ error: 'Email already registered' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const result = await pool.query(
            'INSERT INTO users (email, password) VALUES ($1, $2) RETURNING id',
            [email, hashedPassword]
        );
        res.status(201).json({ userId: result.rows[0].id });
    } catch (error) {
        res.status(500).json({ error: 'Error signing up' });
    }
});

// sign in
router.post('/signin', async (req, res) => {
    const { email, password } = req.body;
    try {
        const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        if (result.rows.length === 0) return res.status(400).json({ error: 'User not found' });

        const user = result.rows[0];
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ error: 'Invalid credentials' });

        // token
        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.status(200).json({ token });
    } catch (error) {
        res.status(500).json({ error: 'Error signing in' });
    }
});

// delete account
router.delete('/delete-account', async (req, res) => {
    const { userId } = req.body;
    try {
        await pool.query('DELETE FROM users WHERE id = $1', [userId]);
        res.json({ message: 'Account deleted' });
    } catch (error) {
        res.status(500).json({ error: 'Error deleting account' });
    }
});

module.exports = router;
