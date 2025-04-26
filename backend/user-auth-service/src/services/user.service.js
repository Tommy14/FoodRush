import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import axios from "axios";


import {NOTIFICATION_SERVICE_URL, INTERNAL_SERVICE_API_KEY} from '../config/index.js'
import e from "express";

export const registerUserService = async ({ name, email, password, phone ,role, gender, dob }) => {
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
    phone,
    role: role || 'customer',
    gender,
    dateOfBirth: dob ? new Date(dob) : undefined,
    isActive: role === 'customer' ? true : false,
  });

  const user = await newUser.save();
  if (!user) {
    const error = new Error('Failed to create user');
    error.statusCode = 500;
    throw error;
  }

  try {
    await sendWelcomeEmail(user);
    await sendWhatsAppMessage(user);
    console.log('User Created and Welcome email sent successfully');
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

  if (!user.isActive) {
    const error = new Error('Account not yet activated. Please contact admin.');
    error.statusCode = 403;
    throw error;
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    const error = new Error('Invalid credentials');
    error.statusCode = 400;
    throw error;
  }

  const token = jwt.sign(
    { userId: user._id, role: user.role, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  );

  return {
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone,
    }
  };
};

//get by id
export const getUserByIdService = async (userId) => {
  const user = await User.findById(userId);
  if (!user) {
    const error = new Error('User not found');
    error.statusCode = 404;
    throw error;
  }

  return {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    phone: user.phone,
  };
}

//get user by role
export const getUsersByRoleService = async (role) => {
  const users = await User.find({ role });
  if (!users) {
    const error = new Error('No users found');
    error.statusCode = 404;
    throw error;
  }

  return users.map(user => ({
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    phone: user.phone,
    isAvailable: user.isAvailable,
  }));
}

export const getAvailabilityService = async (userId) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new Error('User not found');
  }

  return user.isAvailable;
}

export const toggleAvailabilityService = async (userId) => {
  const user = await User.findById(userId);

  if (!user || user.role !== 'delivery_person') {
    throw new Error('Unauthorized');
  }

  user.isAvailable = !user.isAvailable;
  await user.save();

  return user.isAvailable;
};

// Function to send a welcome email to the user
async function sendWelcomeEmail(user) {
  await axios.post(`${NOTIFICATION_SERVICE_URL}/api/notify/email`, {
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
  }, {
    headers: {
      'X-Internal-API-Key': INTERNAL_SERVICE_API_KEY
    }
  });
}

// Function to send a WhatsApp message to the user
// please refere the postman payload and adjust the your functions as neccessary
async function sendWhatsAppMessage(user) {
  await axios.post(`${NOTIFICATION_SERVICE_URL}/api/notify/whatsapp`, {
    phone: user.phone,
    template: 'account_created',
    params: {
      body: [
        user.name,
        user.email,
        new Date().toLocaleString('en-US', {
          timeZone: 'Asia/Colombo',
          dateStyle: 'long',
          timeStyle: 'short'
        })
      ]
    }
  },
  {
    headers: {
      'X-Internal-API-Key': INTERNAL_SERVICE_API_KEY
    }
  });
}


// Get all users pending activation
export const getPendingActivationsService = async () => {
  const pendingUsers = await User.find({ isActive: false });

  return pendingUsers.map((user) => ({
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    phone: user.phone,
    createdAt: user.createdAt,
    status: user.rejectionReason ? 'rejected' : 'pending',
    rejectionReason: user.rejectionReason || null
  }));
};

// Approve or reject a user
export const updateUserActivationService = async (userId, activate) => {
  const user = await User.findById(userId);

  if (!user) {
    const error = new Error("User not found");
    error.statusCode = 404;
    throw error;
  }

  user.isActive = activate;
  await user.save();

  // Send notification to user about account activation
  if (activate) {
    try {
      await axios.post(
        `${NOTIFICATION_SERVICE_URL}/api/notify/email`,
        {
          recipient: {
            email: user.email,
          },
          subject: "Your FoodRush Account has been Activated",
          type: "accountActivated",
          data: {
            name: user.name,
            role: user.role,
          },
        },
        {
          headers: {
            "X-Internal-API-Key": INTERNAL_SERVICE_API_KEY,
          },
        }
      );
    } catch (error) {
      console.error("Failed to send activation email:", error.message);
    }
  }

  return {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    isActive: user.isActive,
  };
};

// Reject a user
export const rejectUserService = async (userId, reason) => {
  const user = await User.findById(userId);

  if (!user) {
    const error = new Error("User not found");
    error.statusCode = 404;
    throw error;
  }

  user.isActive = false;
  user.rejectionReason = reason || "Application rejected by administrator"; // You'll need to add this field to User model
  await user.save();

  // Send rejection notification to user
  try {
    await axios.post(
      `${NOTIFICATION_SERVICE_URL}/api/notify/email`,
      {
        recipient: {
          email: user.email,
        },
        subject: "Your FoodRush Account Request was Declined",
        type: "accountRejected",
        data: {
          name: user.name,
          role: user.role,
          reason:
            reason ||
            "Your application does not meet our current requirements.",
        },
      },
      {
        headers: {
          "X-Internal-API-Key": INTERNAL_SERVICE_API_KEY,
        },
      }
    );
  } catch (error) {
    console.error("Failed to send rejection email:", error.message);
  }

  return {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    isActive: user.isActive,
    rejectionReason: user.rejectionReason,
  };
};

// Get all users (for admin management)
export const getAllUsersService = async () => {
  const users = await User.find({});
  
  return users.map((user) => ({
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    phone: user.phone,
    createdAt: user.createdAt,
    isActive: user.isActive,
    status: user.isActive ? 'active' : (user.rejectionReason ? 'rejected' : 'pending'),
    rejectionReason: user.rejectionReason || null
  }));
};

// update user availability
export const updateUserAvailabilityService = async (userId, isAvailable) => {
  const user = await User.findById(userId);

  if (!user) {
    const error = new Error("User not found");
    error.statusCode = 404;
    throw error;
  }

  user.isAvailable = isAvailable;
  await user.save();

  return user.isAvailable;
}
