import express from "express";
import {
  registerUser,
  loginUser,
  toggleAvailabilityController,
  getAvailabilityController,
  getUserByIdController,
  getUsersByRoleController,
  getPendingActivationsController,
  updateUserActivationController,
  rejectUserController
} from "../controllers/user.controller.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/by/:id', getUserByIdController);
router.get('/role/:role', verifyToken, getUsersByRoleController);
router.patch('/toggle-availability', verifyToken, toggleAvailabilityController);
router.get('/availability', verifyToken, getAvailabilityController);
router.get("/pending-activations", verifyToken, getPendingActivationsController);
router.post("/activate-user", verifyToken, updateUserActivationController);
router.post("/reject-user", verifyToken, rejectUserController);

export default router;
