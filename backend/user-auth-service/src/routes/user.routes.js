import express from 'express';
import { registerUser, loginUser, toggleAvailabilityController, getAvailabilityController} from '../controllers/user.controller.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.patch('/toggle-availability', verifyToken, toggleAvailabilityController);
router.get('/availability', verifyToken, getAvailabilityController);

export default router;
