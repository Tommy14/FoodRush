import {
  registerUserService,
  loginUserService
} from '../services/user.service.js';

// @desc Register a new user
export const registerUser = async (req, res) => {
  const { name, email, password, phone ,role } = req.body;

  try {
    await registerUserService({ name, email, password, phone ,role });
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
