import express from "express";
import { registerUser, loginUser } from "../controllers/auth.controller.js";
import { validateRequest } from "../middleware/validation.middleware.js";
import { registerValidation, loginValidation } from "../middleware/auth.validation.js";
import { authLimiter } from "../middleware/rateLimit.middleware.js";

const router = express.Router();

router.post("/register", authLimiter, registerValidation, validateRequest, registerUser); //=>first run validation check, validateRequest validates isn't there any error then call the registerUser controller
router.post("/login", authLimiter, loginValidation, validateRequest, loginUser);

export default router;
