import User from '../models/User.js';
import jwt from 'jsonwebtoken';

// REGISTER
export async function register(req, res) {
  try {
    const { channelName, userName, email, password, about, profilePic } = req.body;

    // Basic validation
    if (!channelName || !userName || !email || !password || !about || !profilePic) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ $or: [{ email }, { userName }] });
    if (existingUser) {
      return res.status(409).json({ message: 'Email or username already in use' });
    }

    // Create new user
    const newUser = new User({
      channelName,
      userName,
      email,
      password,
      about,
      profilePic,
    });

    await newUser.save();

    res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: newUser._id,
        userName: newUser.userName,
        email: newUser.email,
        role: newUser.role,
        createdAt: newUser.createdAt,
      },
    });
  } catch (err) {
    console.error('Register error:', err);

    // Handle Mongoose validation errors
    if (err.name === 'ValidationError') {
      const validationErrors = {};
      for (const field in err.errors) {
        validationErrors[field] = err.errors[field].message;
      }
      return res.status(400).json({ message: 'Validation failed', errors: validationErrors });
    }

    res.status(500).json({ message: 'Internal Server Error' });
  }
}




export async function login(req, res) {
  try {
    const { email, password } = req.body;

    // Basic validation
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // Find user and include password field
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Compare hashed password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET, // Ensure it's defined in your .env
      { expiresIn: '1h' }
    );

    res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        userName: user.userName,
        email: user.email,
        role: user.role,
        channelName: user.channelName,
      },
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}
