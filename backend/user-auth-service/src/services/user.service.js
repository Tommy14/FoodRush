import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import axios from 'axios';

import {NOTIFICATION_SERVICE_URL} from '../config/index.js'

export const registerUserService = async ({ name, email, password, role }) => {
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    const error = new Error('User already exists');
    error.statusCode = 400;
    throw error;
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = new User({
    name,
    email,
    password: hashedPassword,
    role: role || 'customer'
  });

  const user = await newUser.save();
  if (!user) {
    const error = new Error('Failed to create user');
    error.statusCode = 500;
    throw error;
  }

  try {
    await sendWelcomeEmail(user);
  } catch (error) {
    console.error('User Created But Failed to send welcome email:', error.message);
  }
  return;
};

export const loginUserService = async ({ email, password }) => {
  const user = await User.findOne({ email });
  if (!user) {
    const error = new Error('Invalid credentials');
    error.statusCode = 400;
    throw error;
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    const error = new Error('Invalid credentials');
    error.statusCode = 400;
    throw error;
  }

  const token = jwt.sign(
    { userId: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  );

  return {
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role
    }
  };
};

// Function to send a welcome email to the user
async function sendWelcomeEmail(user) {
  await axios.post(`${NOTIFICATION_SERVICE_URL}/notify/email`, {
    recipient: {
      email: user.email,
    },
    subject: 'Welcome to FoodRush!',
    type: 'userAccountCreated', // type should be the key of the templateMap in notification-service -> src -> layouts -> templateMap.js
    data: {
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: new Date().toLocaleString('en-US', {
        timeZone: 'Asia/Colombo',
        dateStyle: 'long',
        timeStyle: 'short'
      })
    }
  });
}