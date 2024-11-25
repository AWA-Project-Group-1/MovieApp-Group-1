import axios from 'axios';

const serverUrl = 'http://localhost:3001/api/favorites';
const tmdbBaseUrl = 'https://api.themoviedb.org/3';
const tmdbApiKey = '8e00f8de49614d9ebf140af3901aa5b5'; // Replace with your TMDB API key

// Fetch title from TMDB API
async function fetchTitle(movieId, type) {
  try {
    const response = await axios.get(`${tmdbBaseUrl}/${type}/${movieId}`, {
      params: { api_key: tmdbApiKey }
    });
    return response.data.title || response.data.name; // Return title for movies, name for TV shows
  } catch (error) {
    console.error('Error fetching title from TMDB:', error);
    throw new Error('Failed to fetch title from TMDB');
  }
}

// Add an item to favorites (movie or TV show)
export async function addToFavorites(movieId, type) {
  try {
    const title = await fetchTitle(movieId, type); // Fetch title from TMDB API
    return axios.post(`${serverUrl}/add`, { movieId, title, type });
  } catch (error) {
    console.error('Error adding to favorites:', error);
    throw error;
  }
}

// Remove an item from favorites
export async function removeFromFavorites(movieId) {
  return axios.delete(`${serverUrl}/remove`, { data: { movieId } });
}

// Fetch all favorites for the hardcoded user
export async function fetchFavorites() {
  return axios.get(`${serverUrl}/user/945`);
}