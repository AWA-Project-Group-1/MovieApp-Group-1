import { pool } from '../helpers/db.js';

const selectAllGroups = async() => {
    return await pool.query('SELECT * FROM groups');
}

const insertGroup = async(name, description, owners_id) => {
    return await pool.query('INSERT INTO groups(name, description, owners_id) VALUES ($1, $2, $3) RETURNING *',[name, description, owners_id]);
}

export { selectAllGroups, insertGroup };
