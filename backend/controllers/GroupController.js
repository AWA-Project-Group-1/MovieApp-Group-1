import { emptyOrRows } from '../helpers/utils.js';
import { selectAllGroups, insertGroup } from '../models/Group.js';
import { pool } from '../helpers/db.js';

const getGroups = async (req, res, next) => {
    try {
        const result = await selectAllGroups();
        return res.status(200).json(emptyOrRows(result));
    } catch (error) {
        return next(error);
    }
}

const checkUserExists = async (owners_id) => {
    const result = await pool.query('SELECT * FROM users WHERE id = $1', [owners_id]);
    return result.rowCount > 0;
};

const postGroup = async (req, res, next) => {
    try {
        const { name, description, owners_id } = req.body;
        if (!name || name.length === 0) {
            const error = new Error('Invalid group name');
            error.statusCode = 400;
            return next(error);
        }
        const userExists = await checkUserExists(owners_id);
        if (!userExists) {
            const error = new Error('User does not exist');
            error.statusCode = 400;
            return next(error);
        }
        
        const result = await insertGroup(name, description, owners_id);
        return res.status(200).json({id: result.rows[0].id});
    } catch (error) {
        return next(error);
    }
}
export { getGroups, postGroup };