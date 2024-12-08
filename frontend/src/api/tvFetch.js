import axios from 'axios';

const BASE_URL = 'https://api.themoviedb.org/3';
const API_KEY = process.env.REACT_APP_TMDB_API_KEY;

// Fetch top-rated TV series
export const topTVSeries = async (params = {}) => {
    try {
        console.log("Discover TV Series Params:", params); // Debug log
        const response = await axios.get(`${BASE_URL}/discover/tv`, {
            params: {
                api_key: API_KEY,
                language: 'en-US',
                sort_by: 'popularity.desc', // Sort by popularity or use another sorting method
                ...params, // Additional params
            },
        });
        console.log("Discover TV Series Response:", response.data); // Debug log
        return response.data.results;
    } catch (error) {
        console.error('Error fetching discovered TV series:', error);
        throw error;
    }
};


// Fetch old tv series
export const discoverOldTv = async (params) => {
    try {
        const response = await axios.get(`${BASE_URL}/discover/tv`, {
            params: {
                api_key: API_KEY,
                language: 'en-US',
                sort_by: 'release_date.asc',  // Sort by release date in ascending order
                'first_air_date.lte': '1999-12-31', // Filter for TV shows aired before the year 2000
                ...params, // Additional params if any
            },
        });
        console.log("Old TV Series Response:", response.data); // Debug log
        return response.data.results; // Returns an array of upcoming movies
    } catch (error) {
        console.error('Error fetching old TV Series:', error);
        throw error;
    }
};










