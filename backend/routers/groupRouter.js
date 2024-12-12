//this is backend/routes/groupRoutes.js file
import express from 'express';
import { createGroup, getGroups, deleteGroup, getGroupById,deleteMovieFromGroup, displayMovieToGroup,sendJoinRequest,acceptJoinRequest, rejectJoinRequest, removeMember, leaveGroup, getUserGroups , addMovieToGroup} from '../controllers/groupController.js';

import authenticate from '../helpers/auth.js';
const router = express.Router();

// Route for creating a group (POST)
router.post('/create', authenticate, createGroup);

// Route for listing all groups (GET)
router.get('/', getGroups);
router.get('/users/:userId/groups', authenticate, getUserGroups);



// Route for getting a specific group by ID (GET)
router.get('/:id', authenticate, getGroupById);

// Route for deleting a group (DELETE)
// Route for deleting a group
router.delete('/:groupId', authenticate, deleteGroup);


// Route to send a join request
router.post('/join-request', authenticate, sendJoinRequest);

// Route to accept a join request
router.post('/accept-request', authenticate, acceptJoinRequest);

// Route to reject a join request
router.post('/reject-request', authenticate, rejectJoinRequest);

// Route to remove a member (only for the owner)
router.post('/remove-member', authenticate, removeMember);

// Route to leave the group (only for members)
router.post('/:groupId/leave-group', authenticate, leaveGroup);

// Route for adding a movie to a group
router.post('/:groupId/add-movie', authenticate, addMovieToGroup);

// to display the movie fro a grou:
router.get('/:groupId/movies', authenticate, displayMovieToGroup)

router.delete('/:groupId/delete-movies/:movieId', authenticate, deleteMovieFromGroup)


export default router;
