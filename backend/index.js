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
console.log(process.env.DATABASE_URL);


const app = express();
const port = process.env.PORT || 3001;

// Middleware

const allowedOrigins = [
  'http://localhost:3000', // Local development
  'https://your-frontend.onrender.com', // Production frontend
];

const corsOptions = {
  origin: (origin, callback) => {
    if (allowedOrigins.includes(origin) || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  allowedHeaders: ['Authorization', 'Content-Type'],
  credentials: true,
};

app.use(cors(corsOptions));

app.use(express.json());

// Test database connection
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('Error connecting to the database:', err);
  } else {
    console.log('Database connected:', res.rows[0]);
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
  console.log(`Server running on Port: ${port}`);
});