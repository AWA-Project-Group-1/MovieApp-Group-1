import { pool } from '../helpers/db.js';
import { Router } from 'express';
import authenticate from '../helpers/authenticate.js';
import { getGroups, postGroup } from '../controllers/GroupController.js';

const router = Router();

router.get('/', getGroups);

router.post('/create', postGroup);

router.delete('/delete/:groupId', authenticate, async(req, res) => {
  const { groupId } = req.params;
  const {id: userId} = req.user;
    
  console.log("User in request:", req.user);
    
    try {
      const groupResult = await pool.query(
        "SELECT owners_id FROM groups WHERE id = $1",
        [groupId]
      );
      const group = groupResult.rows[0];
  
      if (!group) {
        return res.status(404).json({ error: "Group not found" });
      }
  
      if (group.owners_id !== userId) {
        return res.status(403).json({ error: "You are not authorized to delete this group" });
      }
  

      await pool.query('DELETE FROM groupContent WHERE group_id = $1', [groupId]);
      await pool.query('DELETE FROM groupMembers WHERE group_id = $1', [groupId]);
      await pool.query("DELETE FROM groups WHERE id = $1", [groupId]);

      res.status(200).json({ message: "Group deleted successfully" });
    } catch (error) {
      console.error("Error deleting group:", error);
      res.status(500).json({ error: "An error occurred while deleting the group" });
    }
});


export default router;


