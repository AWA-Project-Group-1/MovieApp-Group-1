import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import favoriteRouter from './routers/favoriteRouter.js';
import reviewsRouter from './routers/reviewRouter.js';
import authRouter from './routers/authRouter.js';
import groupRoutes from './routers/groupRouter.js';
import { supabase } from './helpers/db.js'; // Supabase client

dotenv.config();
console.log("Supabase URL:", process.env.SUPABASE_URL);

// Initialize the Express app
const app = express();
const port = process.env.PORT || 3001;

// Middleware

// CORS Configuration
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

app.options('*', cors(corsOptions)); // Enable preflight for all routes
app.use(cors(corsOptions)); // Use CORS middleware
app.use(express.json()); // Enable JSON parsing for incoming requests

// Test Supabase Connection
(async () => {
  try {
    const { data, error } = await supabase.from('users').select('id').limit(1);
    if (error) {
      throw error;
    }
    console.log('Supabase connected successfully:', data);
  } catch (error) {
    console.error('Error connecting to Supabase:', error.message);
  }
})();

// Routes
app.use('/api/auth', authRouter);
app.use('/api/favorites', favoriteRouter);
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
