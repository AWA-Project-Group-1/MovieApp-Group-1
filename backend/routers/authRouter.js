import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { pool } from "../helpers/db.js";

const router = express.Router();

// sign up
router.post("/signup", async (req, res) => {
  const { email, password } = req.body;

  try {
    const existingUser = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
    if (existingUser.rows.length > 0) {
      return res.status(400).json({ error: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await pool.query(
      "INSERT INTO users (email, password) VALUES ($1, $2) RETURNING id",
      [email, hashedPassword]
    );
    res.status(201).json({ userId: result.rows[0].id });
  } catch (error) {
    console.error("Error signing up:", error);
    res.status(500).json({ error: "Failed to sign up" });
  }
});

// sign in
router.post("/signin", async (req, res) => {
  const { email, password } = req.body;

  try {
    const result = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
    if (result.rows.length === 0) {
      return res.status(400).json({ error: "User not found" });
    }

    const user = result.rows[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    // creat JWT token
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: "1h" });
    res.status(200).json({ token, id: user.id, email: user.email,
      username: user.email }); //heyanwen added
  } catch (error) {
    console.error("Error signing in:", error);
    res.status(500).json({ error: "Failed to sign in" });
  }
});

// delete account

router.delete("/delete-account", async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1]; // Extract the token
  if (!token) {
    return res.status(401).json({ error: "Authorization token required" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Decode the token
    const userId = decoded.userId; // Extract userId from token payload

    await pool.query("DELETE FROM favorites WHERE users_id = $1", [userId]); // delete favorites first
    await pool.query("DELETE FROM reviews WHERE users_id = $1", [userId]); // delete reviews

    await pool.query("DELETE FROM users WHERE id = $1", [userId]); // Use the extracted userId
    res.status(200).json({ message: "Account deleted successfully" });
  } catch (error) {
    console.error("Error deleting account:", error);
    res.status(500).json({ error: "Failed to delete account" });
  }
});

// Get a list of all users (for admin-like functionality)
router.get('/users', async (req, res) => {
  try {
    const result = await pool.query('SELECT id, email FROM users');
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

export default router;