import express from 'express';
import { supabase } from '../helpers/db.js'; // Supabase client
import authenticate from '../helpers/auth.js';

const router = express.Router();

// Route for creating a group (POST)
router.post('/create', authenticate, async (req, res) => {
  const { name, description } = req.body;
  const userId = req.userId;

  if (!name || !description) {
    return res.status(400).json({ error: "Name and description are required." });
  }

  try {
    const { data, error } = await supabase
      .from('groups')
      .insert([{ name, description, owner_id: userId }]);

    if (error) throw error;

    res.status(201).json({ message: 'Group created successfully', group: data[0] });
  } catch (error) {
    console.error('Error creating group:', error.message);
    res.status(500).json({ error: 'Failed to create group' });
  }
});

// Route for listing all groups (GET)
router.get('/', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('groups')
      .select('*');

    if (error) throw error;

    res.status(200).json(data);
  } catch (error) {
    console.error('Error fetching groups:', error.message);
    res.status(500).json({ error: 'Failed to fetch groups' });
  }
});

// Route for getting groups by a specific user (GET)
router.get('/users/:userId/groups', authenticate, async (req, res) => {
  const { userId } = req.params;

  try {
    const { data, error } = await supabase
      .from('groups')
      .select('*')
      .eq('owner_id', userId);

    if (error) throw error;

    res.status(200).json(data);
  } catch (error) {
    console.error('Error fetching user groups:', error.message);
    res.status(500).json({ error: 'Failed to fetch user groups' });
  }
});

// Route for getting a specific group by ID (GET)
router.get('/:id', authenticate, async (req, res) => {
  const { id } = req.params;

  try {
    const { data, error } = await supabase
      .from('groups')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;

    res.status(200).json(data);
  } catch (error) {
    console.error('Error fetching group:', error.message);
    res.status(500).json({ error: 'Failed to fetch group' });
  }
});

// Route for deleting a group (DELETE)
router.delete('/:groupId', authenticate, async (req, res) => {
  const { groupId } = req.params;
  const userId = req.userId;

  try {
    // Ensure the user is the owner of the group
    const { data: group, error: fetchError } = await supabase
      .from('groups')
      .select('owner_id')
      .eq('id', groupId)
      .single();

    if (fetchError) throw fetchError;

    if (group.owner_id !== userId) {
      return res.status(403).json({ error: 'You are not authorized to delete this group' });
    }

    const { error } = await supabase
      .from('groups')
      .delete()
      .eq('id', groupId);

    if (error) throw error;

    res.status(200).json({ message: 'Group deleted successfully' });
  } catch (error) {
    console.error('Error deleting group:', error.message);
    res.status(500).json({ error: 'Failed to delete group' });
  }
});

// Route to send a join request (POST)
router.post('/join-request', authenticate, async (req, res) => {
  const { groupId } = req.body;
  const userId = req.userId;

  try {
    const { error } = await supabase
      .from('join_requests')
      .insert([{ group_id: groupId, user_id: userId }]);

    if (error) throw error;

    res.status(201).json({ message: 'Join request sent successfully' });
  } catch (error) {
    console.error('Error sending join request:', error.message);
    res.status(500).json({ error: 'Failed to send join request' });
  }
});

// Route to accept a join request (POST)
router.post('/accept-request', authenticate, async (req, res) => {
  const { requestId } = req.body;

  try {
    const { data: request, error: fetchError } = await supabase
      .from('join_requests')
      .select('*')
      .eq('id', requestId)
      .single();

    if (fetchError) throw fetchError;

    const { error: insertError } = await supabase
      .from('group_members')
      .insert([{ group_id: request.group_id, user_id: request.user_id }]);

    if (insertError) throw insertError;

    await supabase
      .from('join_requests')
      .delete()
      .eq('id', requestId);

    res.status(200).json({ message: 'Join request accepted' });
  } catch (error) {
    console.error('Error accepting join request:', error.message);
    res.status(500).json({ error: 'Failed to accept join request' });
  }
});

// Route to reject a join request (POST)
router.post('/reject-request', authenticate, async (req, res) => {
  const { requestId } = req.body;

  try {
    const { error } = await supabase
      .from('join_requests')
      .delete()
      .eq('id', requestId);

    if (error) throw error;

    res.status(200).json({ message: 'Join request rejected' });
  } catch (error) {
    console.error('Error rejecting join request:', error.message);
    res.status(500).json({ error: 'Failed to reject join request' });
  }
});

// Route to remove a member (POST)
router.post('/remove-member', authenticate, async (req, res) => {
  const { groupId, memberId } = req.body;
  const userId = req.userId;

  try {
    // Ensure the user is the owner of the group
    const { data: group, error: fetchError } = await supabase
      .from('groups')
      .select('owner_id')
      .eq('id', groupId)
      .single();

    if (fetchError) throw fetchError;

    if (group.owner_id !== userId) {
      return res.status(403).json({ error: 'You are not authorized to remove members' });
    }

    const { error } = await supabase
      .from('group_members')
      .delete()
      .eq('group_id', groupId)
      .eq('user_id', memberId);

    if (error) throw error;

    res.status(200).json({ message: 'Member removed successfully' });
  } catch (error) {
    console.error('Error removing member:', error.message);
    res.status(500).json({ error: 'Failed to remove member' });
  }
});

// Route to leave the group (POST)
router.post('/:groupId/leave-group', authenticate, async (req, res) => {
  const { groupId } = req.params;
  const userId = req.userId;

  try {
    const { error } = await supabase
      .from('group_members')
      .delete()
      .eq('group_id', groupId)
      .eq('user_id', userId);

    if (error) throw error;

    res.status(200).json({ message: 'Left the group successfully' });
  } catch (error) {
    console.error('Error leaving group:', error.message);
    res.status(500).json({ error: 'Failed to leave group' });
  }
});

export default router;
