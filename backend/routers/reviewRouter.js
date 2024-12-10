import express from 'express';
import { supabase } from '../helpers/db.js';
import authenticate from '../helpers/auth.js';
import e from 'express';

const router = express.Router();

// Add a Review
router.post('/', authenticate, async (req, res) => {
  const { movieId, rating, comment, type } = req.body;
  const userId = req.userId;

  if (!movieId || !rating || !comment || !type) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const { data: existingReview, error: fetchError } = await supabase
      .from('reviews')
      .select('*')
      .eq('movies_id', movieId)
      .eq('users_id', userId)
      .eq('type', type);

    if (fetchError) throw fetchError;

    if (existingReview.length > 0) {
      return res.status(409).json({
        message: "You have already submitted a review. Please delete it first if you want to make changes."
      });
    }

    const { data, error } = await supabase
      .from('reviews')
      .insert([{ movies_id: movieId, users_id: userId, rating, comment, type }]);

    if (error) throw error;

    res.status(201).json(data[0]);
  } catch (error) {
    console.error("Error adding review:", error.message);
    res.status(500).json({ error: "Failed to add review" });
  }
});

export default router;
