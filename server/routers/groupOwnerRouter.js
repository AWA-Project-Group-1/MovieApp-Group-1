import { pool } from '../helpers/db.js';
import { Router } from 'express';

const router = Router();

  //get the requested list and member list
  router.get("/:groupId/manage", async (req, res) => {
    const { groupId } = req.params;
  
    try {
      const requests = await pool.query(
        "SELECT * FROM groupMembers WHERE group_id = $1 AND status = 0",
        [groupId]
      );
      const members = await pool.query(
        "SELECT * FROM groupMembers WHERE group_id = $1 AND status = 1",
        [groupId]
      );
  
      res.json({ requests: requests.rows, members: members.rows });
    } catch (err) {
      console.error("Error fetching management data:", err);
      res.status(500).json({ error: "Failed to fetch management data." });
    }
  });

// accept or reject the request
router.patch("/:groupId/:userId", async (req, res) => {
    const { groupId, userId } = req.params;
    const { action } = req.body;
  
    try {
      if (action === "accept") {
        await pool.query(
          "UPDATE groupMembers SET status = 1 WHERE group_id = $1 AND users_id = $2",
          [groupId, userId]
        );
        res.status(200).json({ message: "Request accepted." });
      } else if (action === "reject") {
        await pool.query("DELETE FROM groupMembers WHERE group_id = $1 AND users_id = $2", [
          groupId,
          userId,
        ]);
        res.status(200).json({ message: "Request rejected." });
      }
    } catch (err) {
      console.error("Error managing request:", err);
      res.status(500).json({ error: "Failed to process the request." });
    }
  });
  
  //remove a group member
  router.delete("/:groupId/:userId", async (req, res) => {
    const { groupId, userId } = req.params;
  
    try {
      await pool.query("DELETE FROM groupMembers WHERE group_id = $1 AND users_id = $2", [
        groupId,
        userId,
      ]);
      res.status(200).json({ message: "Member removed successfully." });
    } catch (err) {
      console.error("Error removing member:", err);
      res.status(500).json({ error: "Failed to remove member." });
    }
  });

export default router;