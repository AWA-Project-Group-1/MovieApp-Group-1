import express from 'express';
import { pool } from '../helpers/db.js';
import fetch from 'node-fetch'

const router = express.Router();
const hardcodedUserId = 945; // Hardcoded user ID for simplicity

const tmdbApiKey = '8e00f8de49614d9ebf140af3901aa5b5'; // Ensure this is set in your .env file

// Add a movie or TV show to favorites
router.post('/add', async (req, res) => {
  const { movieId, type } = req.body;
  try {
    // Fetch the title from TMDB API
    const tmdbUrl = `https://api.themoviedb.org/3/${type}/${movieId}?api_key=${tmdbApiKey}`;
    const response = await fetch(tmdbUrl);
    const data = await response.json();

    const title = data.title || data.name; // Movies use 'title', TV shows use 'name'

    console.log('Received data:', req.body, 'Fetched title:', title);

    await pool.query(
      'INSERT INTO favorites (users_id, movie_id, title, type) VALUES ($1, $2, $3, $4)',
      [hardcodedUserId, movieId, title, type]
    );

    res.status(201).json({ message: `${type} "${title}" added to favorites` });
  } catch (error) {
    console.error(`Error adding ${type} to favorites:`, error);
    res.status(500).json({ error: `Failed to add ${type} to favorites` });
  }
});

// Fetch all favorite movies or TV shows for the user
router.get('/user/:userId', async (req, res) => {
  const { userId } = req.params;
  try {
    const result = await pool.query(
      'SELECT movie_id, title, type FROM favorites WHERE users_id = $1',
      [userId]
    );
    res.json(result.rows); // Return rows including movie_id, title, and type
  } catch (error) {
    console.error('Error fetching favorite items:', error);
    res.status(500).json({ error: 'Failed to fetch favorite items' });
  }
});

// Remove a movie or TV show from favorites
router.delete('/remove', async (req, res) => {
  const { movieId } = req.body;
  try {
    await pool.query(
      'DELETE FROM favorites WHERE users_id = $1 AND movie_id = $2',
      [hardcodedUserId, movieId]
    );
    res.status(200).json({ message: 'Item removed from favorites' });
  } catch (error) {
    console.error('Error removing item from favorites:', error);
    res.status(500).json({ error: 'Failed to remove item from favorites' });
  }
});

// Get shared favorites for a specific user by userId
router.get('/shared-favorites/:userId', async (req, res) => {
  const { userId } = req.params;

  try {
    // Fetch the user's favorites from the database
    const result = await pool.query(
      'SELECT movie_id AS id, title, type FROM favorites WHERE users_id = $1',
      [userId]
    );

    res.json(result.rows); // Return an array of { id, title, type }
  } catch (error) {
    console.error('Error fetching shared favorites:', error);
    res.status(500).json({ error: 'Failed to fetch shared favorites' });
  }
});

export default router;