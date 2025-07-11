import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors'

// Load environment variables
dotenv.config();

import userRoutes from './routes/userRoutes.js';
import videoRoutes from './routes/videoRoutes.js';
import commentRoutes from './routes/commentRoutes.js';
import channelRoutes from './routes/channelRoutes.js'


const app = express();
const port = process.env.PORT || 4001;

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: 'you-tube-1-iota.vercel.app',
  credentials: true
} 
))

// Routes
app.use('/api/users', userRoutes);   
app.use('/api/videos', videoRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/channels', channelRoutes)


// Health check route
app.get('/', (req, res) => {
  res.send('✅ Server connected locally');
});

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB connected successfully');

    app.listen(port, () => {
      console.log(`🚀 Server is running at http://localhost:${port}`);
    });
  })
  .catch((error) => {
    console.error('❌ Failed to connect to MongoDB:', error.message);
  });
