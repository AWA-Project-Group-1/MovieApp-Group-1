import express from 'express';
import { pool } from '../helpers/db.js';
import authenticate from '../helpers/auth.js';

const router = express.Router();

// GET request for fetching reviews for a specific movie or TV show (no authentication needed)
router.get('/:contentType/:movieId', (req, res) => {
    const { contentType, movieId } = req.params;

    if (!contentType || (contentType !== 'movie' && contentType !== 'tv')) {
        return res.status(400).json({ error: 'Missing or invalid contentType. Expected "movie" or "tv".' });
    }

    // Validate movieId (ensure it's a valid number or ID format, if applicable)
    if (!movieId || isNaN(movieId)) {
        return res.status(400).json({ error: 'Missing or invalid movieId.' });
    }

    const query = `
        SELECT reviews.id, reviews.movies_id, reviews.rating, reviews.comment, reviews.type, reviews.created_at, users.email
        FROM reviews
        INNER JOIN users ON reviews.users_id = users.id
        WHERE reviews.movies_id = $1 AND reviews.type = $2
    `;

    pool.query(query, [movieId, contentType], (error, result) => {
        if (error) {
            console.error('Error executing query', error.stack);
            return res.status(500).json({ error: error.message });
        }
        return res.status(200).json(result.rows);
    });
});

// GET request for fetching reviews for a specific movie or TV show of the logged-in user (for the card give review/ already reviwewd toggle functionality)
router.get('/user/:contentType/:movieId', authenticate, (req, res) => {
    const { contentType, movieId } = req.params;
    const userId = req.userId; // Use the user ID from the token

    const query = `
        SELECT reviews.id, reviews.movies_id, reviews.rating, reviews.comment, reviews.type, reviews.created_at, users.email
        FROM reviews
        INNER JOIN users ON reviews.users_id = users.id
        WHERE reviews.users_id = $1 AND reviews.type = $2 AND reviews.movies_id = $3
    `;

    pool.query(query, [userId, contentType, movieId], (error, result) => {
        if (error) {
            console.error('Error executing query', error.stack);
            return res.status(500).json({ error: error.message });
        }

        if (result.rowCount === 0) {
            return res.status(404).json({ message: 'Review not found' });
        }

        return res.status(200).json(result.rows[0]); // Return the user's review
    });
});

router.get('/user', authenticate, (req, res) => {
    const { contentType } = req.query; // Extract 'movie' or 'tv' from query params
    const userId = req.userId;

    // Validate the contentType
    if (contentType !== 'movie' && contentType !== 'tv') {
        return res.status(400).json({ error: "Invalid content type. It must be 'movie' or 'tv'" });
    }

    const query = `SELECT DISTINCT movies_id FROM reviews WHERE users_id = $1 AND type = $2;`;

    pool.query(query, [userId, contentType], (error, result) => {
        if (error) {
            return res.status(500).json({ error: error.message });
        }

        if (result.rowCount === 0) {
            return res.status(404).json({ message: 'No reviews found for this user and content type' });
        }

        return res.status(200).json({ movieIds: result.rows.map(row => row.movies_id) });
    });
});




// POST request to add a new review
router.post('/', authenticate, (req, res) => {
    const { movieId, rating, comment, type } = req.body;

    if (!movieId || !rating || !comment || !type) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    if (type !== 'movie' && type !== 'tv') {
        return res.status(400).json({ error: "Invalid 'type' field. Must be 'movie' or 'tv'" });
    }

    const userId = req.userId;

    // Step 1: Check if the user already submitted a review for this movie/type
    const checkQuery = `
        SELECT * FROM reviews
        WHERE movies_id = $1 AND users_id = $2 AND type = $3;
    `;

    pool.query(checkQuery, [movieId, userId, type], (checkError, checkResult) => {
        if (checkError) {
            console.error('Error executing check query', checkError.stack);
            return res.status(500).json({ error: checkError.message });
        }

        if (checkResult.rowCount > 0) {
            // User already submitted a review
            return res.status(409).json({
                message: 'You have already submitted a review. Please delete it first if you want to make changes.'
            });
        }

        // Step 2: Proceed to add the review
        const insertQuery = `
            INSERT INTO reviews (movies_id, users_id, rating, comment, type)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING *;
        `;

        const values = [movieId, userId, rating, comment, type];
        pool.query(insertQuery, values, (insertError, insertResult) => {
            if (insertError) {
                console.error('Error executing insert query', insertError.stack);
                return res.status(500).json({ error: insertError.message });
            }
            return res.status(201).json(insertResult.rows[0]);
        });
    });
});

// DELETE request to delete a review by ID (only if the user is authorized)
router.delete('/:reviewId', authenticate, (req, res) => {
    const reviewId = req.params.reviewId;
    const userId = req.userId; // Get the user ID from the authenticated user

    // Step 1: Check if the review belongs to the logged-in user
    const checkOwnershipQuery = `
        SELECT * FROM reviews
        WHERE id = $1 AND users_id = $2;
    `;

    pool.query(checkOwnershipQuery, [reviewId, userId], (ownershipError, ownershipResult) => {
        if (ownershipError) {
            console.error('Error executing ownership check query', ownershipError.stack);
            return res.status(500).json({ error: ownershipError.message });
        }

        if (ownershipResult.rowCount === 0) {
            // If the user is not authorized to delete this review
            console.log(`User ${userId} is not authorized to delete review ID: ${reviewId}`);
            return res.status(403).json({ error: 'You are not authorized to delete this review' });
        }

        // Step 2: Proceed with deletion if ownership is verified
        const deleteQuery = `
            DELETE FROM reviews
            WHERE id = $1
            RETURNING *;
        `;

        pool.query(deleteQuery, [reviewId], (deleteError, deleteResult) => {
            if (deleteError) {
                console.error('Error executing delete query', deleteError.stack);
                return res.status(500).json({ error: deleteError.message });
            }

            console.log(`Review ID: ${reviewId} deleted successfully by user ID: ${userId}`);
            return res.status(200).json({
                message: 'Review deleted successfully',
                review: deleteResult.rows[0],
            });
        });
    });
});

export default router;