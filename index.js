import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { UserRoutes } from './routes/userRoutes.js';

// Load environment variables from .env
dotenv.config();

const app = express();
const port = process.env.PORT || 4001;

// Middleware to parse JSON bodies
app.use(express.json());


UserRoutes(app)


// Root route
app.get("/", (req, res) => {
  res.send("✅ Server connected locally");
});

// Connect to MongoDB and start the server
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB connected successfully");

    app.listen(port, () => {
      console.log(`🚀 Server is running at http://localhost:${port}`);
    });
  })
  .catch((error) => {
    console.error("❌ Failed to connect to MongoDB:", error.message);
  });
