import { pool } from '../helpers/db.js';
import { Router } from 'express';

const router = Router();
    // Gửi yêu cầu tham gia nhóm
    router.post("/:groupId/join", async (req, res) => {
        const { groupId } = req.params;
        const { userId } = req.body;
  
    try {
      await pool.query(
        `INSERT INTO groupMembers (group_id, users_id, role, status) 
         VALUES ($1, $2, 'member', 0)`,
        [groupId, userId]
      );
      res.status(201).json({ message: "Join request sent!" });
    } catch (err) {
      console.error("Error sending join request:", err);
      res.status(500).json({ error: "Failed to send join request." });
    }
    });
  
    // Rời khỏi nhóm
    router.delete("/:groupId/:userId", async (req, res) => {
    const { groupId, userId } = req.params;
  
    try {
      await pool.query(
        `DELETE FROM groupMembers WHERE group_id = $1 AND users_id = $2`,
        [groupId, userId]
      );
      res.json({ message: "Left the group successfully!" });
    } catch (err) {
      console.error("Error leaving group:", err);
      res.status(500).json({ error: "Failed to leave group." });
    }
    });
    
export default router;