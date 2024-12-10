// index.js
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import favoriteRouter from './routers/favoriteRouter.js';
import reviewsRouter from './routers/reviewRouter.js'
import authRouter from './routers/authRouter.js';
import { pool } from './helpers/db.js'; // Optional: test database connection on startup
import groupRoutes from './routers/groupRouter.js';

dotenv.config();
console.log('DB_USER:', process.env.DB_USER);
console.log('DB_HOST:', process.env.DB_HOST);
console.log('DB_NAME:', process.env.DB_NAME);
console.log('TEST_DB_NAME:', process.env.TEST_DB_NAME);
console.log('DB_PASSWORD:', process.env.DB_PASSWORD);
console.log('DB_PORT:', process.env.DB_PORT);

const app = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Test database connection
// Middleware
app.use(cors());
app.use(express.json());

// Test database connection
console.log('Attempting to connect to the database...');
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('Error connecting to the database:');
    console.error('Error message:', err.message);
    console.error('Error stack:', err.stack);
    console.log('Check your database credentials and configuration.');
  } else {
    console.log('Database connected successfully:');
    console.log('Current time from the database:', res.rows[0]);
  }
});

// Routes
app.use("/api/auth", authRouter);
app.use('/api/favorites', favoriteRouter);
// Use the reviews router for /reviews endpoint
app.use('/api/reviews', reviewsRouter);

app.use('/api/groups', groupRoutes);
// Fallback route for 404 errors
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Start server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});