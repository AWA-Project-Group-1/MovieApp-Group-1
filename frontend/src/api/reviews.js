import axios from 'axios';

const baseUrl = process.env.REACT_APP_BACKEND_URL;
const baseUrlforReviews = `${baseUrl}/api/reviews`;

export const fetchReviews = async (movieId, contentType) => {
    try {
        const response = await axios.get(`${baseUrlforReviews}/${contentType}/${movieId}`);
        return response.data; // Axios automatically parses JSON responses
    } catch (error) {
        console.error('Error fetching reviews:', error.response || error.message);
        throw new Error(error.response?.data?.error || 'Failed to fetch reviews');
    }
};

// Fetch review for the logged-in user for a specific movie or TV show
export async function fetchUserReview(contentType, movieId) {
    const token = localStorage.getItem("token");
    if (!token) {
        console.error('User is not logged in. No token found.');
        throw new Error('User not logged in.');
    }

    try {
        const response = await axios.get(
            `${baseUrlforReviews}/user/${contentType}/${movieId}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            }
        );
        return response.data; // Return the review data
    } catch (error) {
        // Detailed error handling
        console.error('Error fetching user review:', error);

        if (error.response) {
            // Server responded with an error (4xx/5xx)
            console.error('Server responded with:', error.response.data);
            throw new Error(error.response.data.error || 'Failed to fetch user review');
        } else if (error.request) {
            // No response from server (network issues, timeout, etc.)
            console.error('No response from server:', error.request);
            throw new Error('No response from server');
        } else {
            // General errors (configuration, etc.)
            console.error('Error:', error.message);
            throw new Error(error.message || 'Error fetching user review');
        }
    }
}

// Function to fetch reviewed content for the user
export const fetchReviewedContent = async (userToken, contentType) => {
    try {
        const response = await fetch(`${baseUrlforReviews}/user?contentType=${contentType}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${userToken}`
            }
        });

        if (!response.ok) {
            throw new Error('Failed to fetch reviewed content');
        }

        const data = await response.json();
        return data.movieIds; // or tvIds if contentType is 'tv'
    } catch (error) {
        console.error('Error fetching reviewed content:', error);
        return [];
    }
};



export const submitReview = async (movieId, { rating, comment, type }) => {
    const token = localStorage.getItem("token");
    console.log("Token:", localStorage.getItem("token"));
    if (!token) {
        throw new Error("User not logged in.");
    }

    try {
        const response = await axios.post(
            `${baseUrlforReviews}`,
            { movieId, rating, comment, type },
            { headers: { Authorization: `Bearer ${token}` } }
        );
        return response.data;
    } catch (error) {
        console.error('Error submitting review:', error);
        throw new Error(error.response?.data?.error || "Error submitting review");
    }
};


// Delete a specific review by reviewId
export async function deleteReview(reviewId, token) {
    try {
        const response = await axios.delete(
            `${baseUrlforReviews}/${reviewId}`,
            { headers: { Authorization: `Bearer ${token}` } }
        );
        return response.data;  // Axios automatically parses JSON responses
    } catch (error) {
        console.error('Error deleting review:', error);
        throw new Error(error.response?.data?.error || 'Failed to delete review');
    }
}