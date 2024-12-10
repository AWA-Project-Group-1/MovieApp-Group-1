import express from 'express';
import { supabase } from '../helpers/db.js';
import authenticate from '../helpers/auth.js';

const router = express.Router();

// Add to Favorites
router.post('/add', authenticate, async (req, res) => {
  const { movieId, type } = req.body;
  const userId = req.userId;

  try {
    const tmdbUrl = `https://api.themoviedb.org/3/${type}/${movieId}?api_key=${process.env.API_KEY}`;
    const response = await fetch(tmdbUrl);
    const data = await response.json();

    const title = data.title || data.name;

    const { error } = await supabase
      .from('favorites')
      .insert([{ users_id: userId, movie_id: movieId, title, type }]);

    if (error) throw error;

    res.status(201).json({ message: `${type} "${title}" added to favorites` });
  } catch (error) {
    console.error("Error adding to favorites:", error.message);
    res.status(500).json({ error: "Failed to add to favorites" });
  }
});

// Fetch User Favorites
router.get('/user', authenticate, async (req, res) => {
  const userId = req.userId;

  try {
    const { data, error } = await supabase
      .from('favorites')
      .select('movie_id, title, type')
      .eq('users_id', userId);

    if (error) throw error;

    res.json(data);
  } catch (error) {
    console.error("Error fetching favorites:", error.message);
    res.status(500).json({ error: "Failed to fetch favorites" });
  }
});

export default router;