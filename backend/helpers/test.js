import fs from 'fs';
import path from 'path';
import { pool } from './db.js';
import { hash } from 'bcrypt';
import pkg from 'jsonwebtoken';
const { sign } = pkg;
import dotenv from 'dotenv';

dotenv.config();

const __dirname = import.meta.dirname;

// Initialize the test database with the provided SQL file
const initializeTestDb = async () => {
    const sql = fs.readFileSync(path.resolve(__dirname, "../test_db.sql"), "utf-8");
    pool.query(sql);
}

if (process.env.NODE_ENV === 'test') {
    initializeTestDb();
}

const insertTestUser = async (email, password) => {
    const hashedPassword = await hash(password, 10);
    const result = await pool.query(
        'INSERT INTO users (email, password) VALUES ($1, $2) RETURNING id',
        [email, hashedPassword]
    );
    const userId = result.rows[0].id;
    console.log(`User inserted: ${email} with ID: ${userId}`);
    return userId;
};


const getToken = (email, userId) => {
    return sign({ email, userId }, process.env.JWT_SECRET);
};

// Addition: Helper for resetting the test database
const resetTestDb = async () => {
    const sql = fs.readFileSync(
      path.resolve(__dirname, "../test_db.sql"),
      "utf-8"
    );
    await pool.query(sql);
  };

export { initializeTestDb, insertTestUser, getToken, resetTestDb };