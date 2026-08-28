import express from "express"
import { getCurrentUser, updateCurrentUser } from "../controllers/user.controller.js"
import { authenticate } from "../middleware/auth.middleware.js"
import { validateRequest } from "../middleware/validation.middleware.js"

const router = express.Router();

//protected route - the route will first passes to authenticate handler then getCurrentUser is called which extracts _id from jwt to verify if user is valid and has access to requested data
router.get("/me", authenticate, validateRequest, getCurrentUser);
//protected route - the route will first passes to authenticate handler then updateCurrentUser is called which extracts _id from jwt to verify if user is valid and has access to requested data
router.put("/me/:id", authenticate, validateRequest, updateCurrentUser);

export default router;