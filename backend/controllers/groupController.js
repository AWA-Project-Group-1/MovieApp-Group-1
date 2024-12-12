import { pool } from "../helpers/db.js";

export const createGroup = async (req, res) => {
    const { name, description, userId } = req.body;

    console.log('Received group data:', { name, description, userId }); // Debugging line

    try {
        // Make sure the userId exists in the database
        const userResult = await pool.query('SELECT * FROM users WHERE id = $1', [userId]);
        if (userResult.rows.length === 0) {
            return res.status(400).json({ message: 'User not found' });
        }

        // Insert the new group with the provided userId as the owner
        const result = await pool.query(
            `INSERT INTO groups (name, description, owners_id) 
             VALUES ($1, $2, $3) RETURNING *`,
            [name, description || null, userId]  // Use null if no description is provided
        );

        const newGroup = result.rows[0];

        // After group is created, insert the creator as an admin in the groupMembers table
        await pool.query(
            `INSERT INTO groupMembers (group_id, users_id, status, role) 
             VALUES ($1, $2, $3, $4)`,
            [newGroup.id, userId, 'accepted', 'admin']  // Creator is always admin
        );

        // Send the newly created group as a response
        res.status(201).json(newGroup);
    } catch (error) {
        console.error('Error creating group:', error.message);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

export const getUserGroups = async (req, res) => {
    const { userId } = req.params; // Get userId from URL parameter

    console.log('Fetching groups for user:', userId); // Debugging line

    try {
        // Query to fetch owned groups (where user is the owner)
        const ownedGroupsResult = await pool.query(`
            SELECT * 
            FROM groups
            WHERE owners_id = $1
        `, [userId]);

        // Query to fetch joined groups (where user is a member with 'accepted' status)
        const joinedGroupsResult = await pool.query(`
            SELECT groups.* 
            FROM groups
            JOIN groupMembers ON groups.id = groupMembers.group_id
            WHERE groupMembers.users_id = $1 AND groupMembers.status = 'accepted'
        `, [userId]);

        console.log("Fetched owned groups:", ownedGroupsResult.rows); // Debugging line
        console.log("Fetched joined groups:", joinedGroupsResult.rows); // Debugging line

        // Combine the results for both owned and joined groups
        const userGroups = {
            owned: ownedGroupsResult.rows,
            joined: joinedGroupsResult.rows,
        };

        res.status(200).json(userGroups);
    } catch (error) {
        console.error('Error fetching user groups:', error.message);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};



// List all groups
export const getGroups = async (req, res) => {
    try {
        const result = await pool.query(`SELECT * FROM groups`);
        res.status(200).json(result.rows);
    } catch (error) {
        console.error('Error fetching groups:', error.message);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

// Fetch a group by ID and return join requests and owner information

export const getGroupById = async (req, res) => {
    const { id } = req.params;

    const currentUserId = req.userId; // Assuming currentUserId is set in your request context
    try {
        const result = await pool.query(`
            SELECT groups.*, 
                   groups.owners_id, 
                   users.id AS member_id, 
                   users.email AS member_email,  
                   groupMembers.status,
                   groupMembers.role AS member_role, 
                   groupMembers.id AS request_id
            FROM groups
            LEFT JOIN groupMembers ON groups.id = groupMembers.group_id
            LEFT JOIN users ON users.id = groupMembers.users_id
            WHERE groups.id = $1`, [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Group not found' });
        }

        const group = result.rows[0];

        // Filter only the accepted members
        const members = result.rows.filter(row => row.status === 'accepted').map(row => ({
            id: row.member_id,
            email: row.member_email, // Display email
            role: row.member_role || 'member' // Default role to member if not set
        }));

        // Get pending join requests
        const joinRequests = result.rows.filter(row => row.status === 'pending').map(row => ({
            users_id: row.member_id,
            users_email: row.member_email, // Send email instead of name
            request_id: row.request_id
        }));

        // Send response with group details and members
        res.status(200).json({
            ...group,
            owners_id: group.owners_id,
            currentUserId, // Add current user's ID
            members,
            joinRequests
        });
    } catch (error) {
        console.error(`Error fetching group with id ${id}:`, error.message);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};





// Send a join request
export const sendJoinRequest = async (req, res) => {
    const { groupId, userId } = req.body;

    try {
        // Log the incoming request for debugging
        console.log('Incoming join request for groupId:', groupId, 'userId:', userId);

        // Check if the user is authenticated and valid
        if (!userId || !groupId) {
            return res.status(400).json({ message: 'Missing groupId or userId.' });
        }

        // Check if the user is already a member or has a pending request
        const existingMember = await pool.query(
            `SELECT * FROM groupMembers WHERE group_id = $1 AND users_id = $2`,
            [groupId, userId]
        );

        if (existingMember.rowCount > 0) {
            return res.status(400).json({ message: 'You have already joined or requested to join this group.' });
        }

        // Insert a new join request with status 'pending'
        await pool.query(
            `INSERT INTO groupMembers (group_id, users_id, status) VALUES ($1, $2, $3)`,
            [groupId, userId, 'pending']
        );

        res.status(200).json({ message: 'Join request sent successfully.' });
        console.log('Join request inserted successfully');

    } catch (error) {
        console.error('Error sending join request:', error);
        res.status(500).json({ message: 'Internal server error.' });
    }
};

export const acceptJoinRequest = async (req, res) => {
    const { groupId, userId, currentUserId } = req.body;

    try {
        // Validate group and ownership
        const group = await pool.query(`SELECT * FROM groups WHERE id = $1`, [groupId]);
        if (group.rows.length === 0) {
            return res.status(404).json({ message: 'Group not found' });
        }
        if (group.rows[0].owners_id !== currentUserId) {
            return res.status(403).json({ message: 'Only the group owner can accept requests.' });
        }

        // Update the join request status to accepted
        const result = await pool.query(`
            UPDATE groupMembers 
            SET status = 'accepted' 
            WHERE group_id = $1 AND users_id = $2 AND status = 'pending' 
            RETURNING *`, [groupId, userId]);

        if (result.rowCount === 0) {
            return res.status(404).json({ message: 'Join request not found or already processed.' });
        }

        // Check if the user is already in the group
        const existingMember = await pool.query(`
            SELECT * FROM groupMembers 
            WHERE group_id = $1 AND users_id = $2`, [groupId, userId]);

        if (existingMember.rows.length === 0) {
            // Assign role (admin for the owner, member for others)
            const role = (userId === group.rows[0].owners_id) ? 'admin' : 'member';

            // Add user to groupMembers table with their role
            await pool.query(`
                INSERT INTO groupMembers (group_id, users_id, status, role) 
                VALUES ($1, $2, $3, $4)`, [groupId, userId, 'accepted', role]);
        }

        res.status(200).json({ message: 'Join request accepted successfully.' });
    } catch (error) {
        console.error('Error accepting join request:', error);
        res.status(500).json({ message: 'Internal server error.' });
    }
};





// Reject a join request
export const rejectJoinRequest = async (req, res) => {
    const { groupId, userId, currentUserId } = req.body;

    try {
        // Fetch the group and join request details
        const joinRequest = await pool.query(
            `SELECT gm.*, g.owners_id 
            FROM groupMembers gm
            JOIN groups g ON gm.group_id = g.id
            WHERE gm.group_id = $1 AND gm.users_id = $2 AND gm.status = $3`,
            [groupId, userId, 'pending'] // Check for 'pending' status
        );

        if (joinRequest.rowCount === 0) {
            return res.status(404).json({ message: 'Join request not found or already processed.' });
        }

        const { owners_id } = joinRequest.rows[0];

        // Validate if the current user is the owner of the group
        if (owners_id !== currentUserId) {
            return res.status(403).json({ message: 'Only the group owner can reject requests.' });
        }

        // Update the member status to 'rejected'
        await pool.query(
            `UPDATE groupMembers SET status = $1 
            WHERE group_id = $2 AND users_id = $3`,
            ['rejected', groupId, userId]
        );

        res.status(200).json({ message: 'Join request rejected successfully.' });
    } catch (error) {
        console.error('Error rejecting join request:', error);
        res.status(500).json({ message: 'Internal server error.' });
    }
};




// Delete a group
export const deleteGroup = async (req, res) => {
    const groupId = req.params.groupId;
    const userId = req.query.userId;  // Extract userId from the query parameter

    console.log('Received delete request for group:', groupId, 'by user:', userId);

    try {
        // Check if the user is the owner of the group
        const groupResult = await pool.query('SELECT * FROM groups WHERE id = $1 AND owners_id = $2', [groupId, userId]);
        if (groupResult.rows.length === 0) {
            return res.status(403).json({ message: 'Only the owner can delete the group.' });
        }
        // Delete any content associated with the group (messages, posts, etc.)
        await pool.query('DELETE FROM groupContent WHERE group_id = $1', [groupId]);

        // Delete all members of the group
        await pool.query('DELETE FROM groupMembers WHERE group_id = $1', [groupId]);

        // Now delete the group
        await pool.query('DELETE FROM groups WHERE id = $1', [groupId]);
        res.status(200).json({ message: 'Group deleted .' });
    } catch (error) {
        console.error('Error deleting group:', error.message);
        res.status(500).json({ message: 'Internal server error.' });
    }
};





// Remove member from group (Only for owners)
export const removeMember = async (req, res) => {
    const { groupId, userId, currentUserId } = req.body; // Current user is the admin/owner

    try {
        // Fetch the group to check if it exists and get owner info
        const groupResult = await pool.query('SELECT * FROM groups WHERE id = $1', [groupId]);
        if (groupResult.rows.length === 0) {
            return res.status(404).json({ message: 'Group not found' });
        }

        const group = groupResult.rows[0];
        // Ensure the current user is the owner (admin) of the group
        if (group.owners_id !== currentUserId) {
            return res.status(403).json({ message: 'Only the owner can remove members.' });
        }

        // Remove the user from the groupMembers table
        await pool.query('DELETE FROM groupMembers WHERE group_id = $1 AND users_id = $2', [groupId, userId]);

        res.status(200).json({ message: 'Member removed from the group.' });
    } catch (error) {
        console.error('Error removing member:', error.message);
        res.status(500).json({ message: 'Internal server error.' });
    }
};


export const leaveGroup = async (req, res) => {
    const { groupId } = req.params;  // Access groupId from URL parameters
    const { userId } = req.body;     // Access userId from the body

    try {
        // Check if the member exists in the group
        const memberResult = await pool.query('SELECT * FROM groupMembers WHERE group_id = $1 AND users_id = $2', [groupId, userId]);
        if (memberResult.rowCount === 0) {
            return res.status(404).json({ message: 'Member not found in the group' });
        }

        // Remove the member from the group
        await pool.query('DELETE FROM groupMembers WHERE group_id = $1 AND users_id = $2', [groupId, userId]);

        res.status(200).json({ message: 'Successfully left the group.' });
    } catch (error) {
        console.error('Error leaving group:', error.message);
        res.status(500).json({ message: 'Internal server error.' });
    }
};




export const addMovieToGroup = async (req, res) => {
    const { groupId } = req.params; // Extract groupId from the URL params
    const { userId, movieId, title, description, posterPath } = req.body; // Extract movie details from the request body

    // Validate the required fields
    if (!title || !userId || !posterPath) {
        return res.status(400).json({
            success: false,
            message: 'Title, userId, and posterPath are required.',
        });
    }

    try {
        // Check if the group exists
        const groupResult = await pool.query('SELECT * FROM groups WHERE id = $1', [groupId]);
        if (groupResult.rowCount === 0) {
            return res.status(404).json({ success: false, message: 'Group not found.' });
        }

        // Insert the new movie into the groupContent table
        // const { users_id, movie_id, movie_title, description, movie_poster_path } = req.body;
        const insertQuery = `
            INSERT INTO groupContent (group_id, users_id,movie_id, movie_title, movie_poster_path,post_content)
            VALUES ($1, $2, $3, $4, $5,$6  )
            RETURNING *;
        `;
        const values = [groupId, userId, movieId, title, posterPath, description];
        const result = await pool.query(insertQuery, values);

        // Return success response with the new movie details
        res.status(201).json({
            success: true,
            message: 'Movie added successfully!',
            movie: result.rows[0],
        });
    } catch (error) {
        console.error('Error adding movie:', error.message);
        res.status(500).json({
            success: false,
            message: 'Internal server error.',
            error: error.message, // Log error message for debugging
        });
    }
};

// // for get all the data fro the group 
export const displayMovieToGroup = async (req, res) => {
    const { groupId } = req.params; // Extract groupId from the URL params

    try {
        // Query to fetch all movies in the specified group
        const result = await pool.query('SELECT * FROM groupContent WHERE group_id = $1', [groupId]);

        // Check if any movies were found
        if (result.rowCount === 0) {
            return res.status(404).json({
                success: false,
                message: 'No movies found for this group.',
            });
        }

        // Return the movies in the response
        res.status(200).json({
            success: true,
            message: 'Movies fetched successfully!',
            movies: result.rows, // Array of movies
        });
    } catch (error) {
        console.error('Error fetching movies:', error.message);
        res.status(500).json({
            success: false,
            message: 'Internal server error.',
            error: error.message, // Log error message for debugging
        });
    }
};

// for the delete movie for group:
export const deleteMovieFromGroup = async (req, res) => {
    console.log('DELETE request received:', req.params, req.body);
    const { groupId, movieId } = req.params; // Extract groupId and movieId from URL params
    const { userId } = req.body; // Extract userId from the request body

    // Validate required fields
    if (!groupId || !movieId || !userId) {
        return res.status(400).json({
            success: false,
            message: 'Group ID, Movie ID, and User ID are required.',
        });
    }

    try {
        // Check if the group exists
        const groupResult = await pool.query('SELECT * FROM groups WHERE id = $1', [groupId]);
        if (groupResult.rowCount === 0) {
            return res.status(404).json({ success: false, message: 'Group not found.' });
        }

        // Check if the movie exists in the group
        const movieResult = await pool.query(
            'SELECT * FROM groupContent WHERE group_id = $1 AND movie_id = $2',
            [groupId, movieId]
        );
        if (movieResult.rowCount === 0) {
            return res.status(404).json({ success: false, message: 'Movie not found in the group.' });
        }

        // Delete the movie from the groupContent table
        const deleteQuery = 'DELETE FROM groupContent WHERE group_id = $1 AND movie_id = $2 AND users_id = $3';
        await pool.query(deleteQuery, [groupId, movieId, userId]);

        res.status(200).json({
            success: true,
            message: 'Movie deleted successfully from the group.',
        });
    } catch (error) {
        console.error('Error deleting movie:', error.message);
        res.status(500).json({
            success: false,
            message: 'Internal server error.',
            error: error.message, // Log error message for debugging
        });
    }
};
