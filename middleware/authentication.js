import jwt from 'jsonwebtoken';
import User from '../models/User.js'; 

export const authentication = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    // Check if Authorization header is present and properly formatted
    if (!authHeader || !authHeader.startsWith('JWT ')) {
      return res.status(401).json({ error: 'Access denied. No token provided.' });
    }

    const token = authHeader.split(' ')[1];

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secretKey');

    // Look up the user
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }

    // Attach user to the request object
    req.user = user;
    next();

  } catch (err) {
    console.error('Token verification failed:', err.message);
    res.status(400).json({ error: 'Invalid token' });
  }
};