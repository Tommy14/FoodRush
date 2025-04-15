import express from 'express';
import { registerUser, loginUser, toggleAvailabilityController} from '../controllers/user.controller.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.patch('/toggle-availability', verifyToken, toggleAvailabilityController);

export default router;
