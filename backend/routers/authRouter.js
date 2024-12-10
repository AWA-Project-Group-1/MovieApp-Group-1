import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { supabase } from "../helpers/db.js";

const router = express.Router();

// Sign Up
router.post("/signup", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  try {
    const { data: existingUser, error: fetchError } = await supabase
      .from('users')
      .select('*')
      .eq('email', email);

    if (fetchError) throw fetchError;

    if (existingUser.length > 0) {
      return res.status(400).json({ error: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const { data, error } = await supabase
      .from('users')
      .insert([{ email, password: hashedPassword }]);

    if (error) throw error;

    res.status(201).json({ userId: data[0].id });
  } catch (error) {
    console.error("Error signing up:", error.message);
    res.status(500).json({ error: "Failed to sign up" });
  }
});

// Sign In
router.post("/signin", async (req, res) => {
  const { email, password } = req.body;

  try {
    const { data: user, error: fetchError } = await supabase
      .from('users')
      .select('*')
      .eq('email', email);

    if (fetchError) throw fetchError;

    if (user.length === 0) {
      return res.status(400).json({ error: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user[0].password);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign({ userId: user[0].id }, process.env.JWT_SECRET, { expiresIn: "1h" });

    res.status(200).json({ token, id: user[0].id, email: user[0].email });
  } catch (error) {
    console.error("Error signing in:", error.message);
    res.status(500).json({ error: "Failed to sign in" });
  }
});

// Delete Account
router.delete("/delete-account", async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ error: "Authorization token required" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.userId;

    await supabase.from('favorites').delete().eq('users_id', userId);
    await supabase.from('reviews').delete().eq('users_id', userId);
    await supabase.from('users').delete().eq('id', userId);

    res.status(200).json({ message: "Account deleted successfully" });
  } catch (error) {
    console.error("Error deleting account:", error.message);
    res.status(500).json({ error: "Failed to delete account" });
  }
});
