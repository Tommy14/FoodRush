import {
  registerUserService,
  loginUserService,
  toggleAvailabilityService,
  getAvailabilityService,
  getUserByIdService,
  getUsersByRoleService
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

// @desc Get user by ID
export const getUserByIdController = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await getUserByIdService(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (err) {
    console.error('❌ Error fetching user by ID:', err.message);
    res.status(500).json({ message: 'Server error while fetching user' });
  }
};

export const getUsersByRoleController = async (req, res) => {
  try {
    const role = req.params.role;
    const users = await getUsersByRoleService(role);

    if (!users || users.length === 0) {
      return res.status(404).json({ message: 'No users found' });
    }

    res.json(users);
  } catch (err) {
    console.error('❌ Error fetching users by role:', err.message);
    res.status(500).json({ message: 'Server error while fetching users' });
  }
}

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
