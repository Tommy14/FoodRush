import {
  registerUserService,
  loginUserService,
  toggleAvailabilityService,
  getAvailabilityService
} from '../services/user.service.js';

// @desc Register a new user
export const registerUser = async (req, res) => {
  const { name, email, password, phone ,role, gender, dob } = req.body;

  try {
    await registerUserService({ name, email, password, phone ,role, gender, dob });
    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    const status = err.statusCode || 500;
    res.status(status).json({ message: err.message || 'Server error during registration' });
  }
};

// @desc Login a user
export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const loginData = await loginUserService({ email, password });
    res.status(200).json(loginData);
  } catch (err) {
    const status = err.statusCode || 500;
    res.status(status).json({ message: err.message || 'Server error during login' });
  }
};

export const getAvailabilityController = async (req, res) => {
  try {
    const userId = req.user.userId; // assuming middleware attaches this
    const isAvailable = await getAvailabilityService(userId);

    res.json({
      message: 'Availability fetched',
      isAvailable
    });
  } catch (err) {
    const status = err.message === 'Unauthorized' ? 403 : 500;
    res.status(status).json({ message: err.message });
  }
};

export const toggleAvailabilityController = async (req, res) => {
  try {
    const userId = req.user.userId; // assuming middleware attaches this
    const updatedStatus = await toggleAvailabilityService(userId);

    res.json({
      message: 'Availability updated',
      isAvailable: updatedStatus
    });
  } catch (err) {
    const status = err.message === 'Unauthorized' ? 403 : 500;
    res.status(status).json({ message: err.message });
  }
};
