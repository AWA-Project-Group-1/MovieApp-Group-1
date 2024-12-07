import { pool } from '../helpers/db.js';
import { Router } from 'express';
import { auth } from '../helpers/auth.js';
import { getTasks, postTask } from '../controllers/TaskController.js';

const router = Router();

router.get('/', getTasks);

router.post('/create', postTask);

router.delete('/delete/:id',auth,(req, res, next) => {
    const id = parseInt(req.params.id)
    console.log(`Attempting to delete task with ID: ${id}`);

    pool.query('DELETE FROM task WHERE id = $1', [id], (error, result) => {
            if (error) {
                console.error("Database error: ", error);
                return next(error);
            }

            if (result.rowCount === 0) {
                console.error("Task not found for ID:", id);
                return res.status(404).json({ message: "Task not found" });
            }
    
            console.log("Task deleted successfully with ID:", id);
            return res.status(200).json({ message: "Task deleted successfully", id: id });
    });
});

export default router;