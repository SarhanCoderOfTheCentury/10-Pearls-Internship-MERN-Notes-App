import express from "express";
import { getHealth, getDatabaseHealth } from "../controllers/health.controller.js";

const router = express.Router();

router.get("/", getHealth);
router.get("/dbHealth", getDatabaseHealth);

export default router;

