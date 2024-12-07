import { pool } from '../helpers/db.js';
import { Router } from 'express';

const router = Router();

router.get("/:groupId", async (req, res) => {
    const { groupId } = req.params;
  
    try {
      const result = await pool.query(
        `SELECT gc.id, gc.timestamp, gc.group_id, g.name AS group_name, gc.users_id, gc.post_content, gc.movie_poster_path, gc.movie_title, gc.show_time_image, gc.show_time_title, gc.show_time_start, gc.show_time_end 
         FROM groupContent gc
         INNER JOIN groups g ON gc.group_id = g.id
         WHERE gc.group_id = $1 
         ORDER BY gc.timestamp DESC`,
        [groupId]
      );
  
      if (result.rowCount === 0) {
        return res.status(404).json({ message: "No content found for this group." });
      }
  
      res.json(result.rows);
    } catch (error) {
      console.error("Error fetching content:", error);
      res.status(500).json({ error: "Failed to fetch content." });
    }
});

router.post('/:groupId/content', async (req, res) => {
    console.log('Request params:', req.params);
    console.log('Request body:', req.body);
    
    const { groupId } = req.params;
    const { userId, postContent, movies = [], showTimes = [] } = req.body;

   
    try {
        const groupResult = await pool.query('SELECT id FROM groups WHERE id = $1', [groupId]);
        if (groupResult.rowCount === 0) {
            return res.status(404).json({ message: 'Group not found' });
        }
        
        // Kiểm tra nếu chỉ một loại nội dung được gửi
    const isPostContent = postContent && !movies.length && !showTimes.length;
    const isMovies = !postContent && movies.length && !showTimes.length;
    const isShowTimes = !postContent && !movies.length && showTimes.length;

    if (!(isPostContent || isMovies || isShowTimes)) {
      return res
        .status(400)
        .json({ message: 'Only one type of content postContent, movies, or show time is allowed per request.' });
    }
        
        // postContent
        if (isPostContent) {
            const result = await pool.query(
                `INSERT INTO groupContent (group_id, users_id, post_content)
                VALUES ($1, $2, $3) RETURNING *`,
                [groupId, userId, postContent]
            );
            return res.status(201).json({ message: 'Post content added successfully!', data: result.rows[0] });
        }
        
        // movies
        if (isMovies) {
            const movieQueries = movies.map((movie) => {
              if (!movie.id || !movie.title || !movie.poster_path) {
                throw new Error('Invalid movie data.');
              }
              return pool.query(
                `INSERT INTO groupContent (group_id, users_id, movie_id, movie_title, movie_poster_path)
                 VALUES ($1, $2, $3, $4, $5)`,
                [groupId, userId, movie.id, movie.title, movie.poster_path]
              );
            });
            await Promise.all(movieQueries);
            return res.status(201).json({ message: 'Movies added successfully!' });
          }

          // showTimes
          if (isShowTimes) {
            const showTimeQueries = showTimes.map((show) => {
              if (!show.id || !show.title || !show.showStart || !show.showEnd || !show.image) {
                throw new Error('Invalid showTime data.');
              }
              return pool.query(
                `INSERT INTO groupContent (group_id, users_id, show_time_id, show_time_title, show_time_start, show_time_end, show_time_image)
                 VALUES ($1, $2, $3, $4, $5, $6, $7)`,
                [groupId, userId, show.id, show.title, show.showStart, show.showEnd, show.image]
              );
            });
            await Promise.all(showTimeQueries);
            return res.status(201).json({ message: 'Show times added successfully!' });
          }
        } catch (err) {
          console.error(err);
          res.status(500).json({ error: err.message || 'Error adding content' });
        }
      });


      router.get("/:groupId/:userId/permissions", async (req, res) => {
        const { groupId, userId } = req.params;
        
        console.log(`Checking permissions for groupId: ${groupId}, userId: ${userId}`);

        try {
          // Kiểm tra nếu người dùng là owner
          const ownerResult = await pool.query(
            "SELECT id FROM groups WHERE id = $1 AND owners_id = $2",
            [groupId, userId]
          );
          console.log("Owner check result:", ownerResult.rows);

          if (ownerResult.rowCount > 0) {
            return res.json({ role: "owner" });
          }
      
          // Kiểm tra nếu người dùng là member
          const memberResult = await pool.query(
            "SELECT id FROM groupMembers WHERE status = 1 AND group_id = $1 AND users_id = $2",
            [groupId, userId]
          );
          
          console.log("Member check result:", memberResult.rows);

          if (memberResult.rowCount > 0) {
            return res.json({ role: "member" });
          }
      
          // Người dùng không có quyền hạn nào
          return res.json({ role: "none" });
        } catch (err) {
          console.error("Error checking permissions:", err);
          res.status(500).json({ message: "Failed to check user permissions" });
        }
      });
      

export default router;


