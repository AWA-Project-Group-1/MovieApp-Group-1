import fs from 'fs';
import path from 'path';
import { pool } from './db.js';
import { createHash } from 'crypto';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const initializeTestDb = () => {
    const sql = fs.readFileSync(path.resolve(__dirname, '../MovieDb.sql'), 'utf8');
    pool.query(sql, (err) => {
        if (err) {
            console.error("Error initializing test database:", err);
        } else {
            console.log("Test database initialized successfully.");
        }
    });
};

const insertTestUser = (email, password) => {
    bcrypt.hash(password, 10, (error, hashedPassword) => {
        if (error) {
            console.error("Error hashing password:", error);
            return;
        }
        pool.query('INSERT INTO users (email, password) VALUES ($1, $2)', [email, hashedPassword], (err) => {
            if (err) {
                console.error("Database error:", err);
            } else {
                console.log("User inserted successfully");
            }
        });
    });
};

const getToken = (email) => {
    return jwt.sign({ email }, process.env.JWT_SECRET_KEY);
};

export { initializeTestDb, insertTestUser, getToken };
