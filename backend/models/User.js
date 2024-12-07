import { pool } from '../helpers/db.js';

const insertUser = async(email, hashedPassword) => {
    return await pool.query('INSERT INTO users (email, password) VALUES ($1, $2) RETURNING *', [email, hashedPassword]);
}

const selectUserByEmail = async(email) => {
    return await pool.query('SELECT * FROM users WHERE email = $1', [email]);
}

export { insertUser, selectUserByEmail };