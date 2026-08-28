import express from "express";

import { authenticate } from "../middleware/auth.middleware.js";
import { createNoteValidation, noteIdValidation, updateNoteValidaion } from "../middleware/note.validation.js";
import { createNote, getNote, getNotes, updateNote, deleteNote, toggleFavorite } from "../controllers/notes.controller.js";
import { validateRequest } from "../middleware/validation.middleware.js";

const router = express.Router();

router.post("/", authenticate, createNoteValidation, validateRequest, createNote);
router.get("/", authenticate,  getNotes);
router.get("/:id", authenticate, noteIdValidation, validateRequest, getNote);
router.put("/:id", authenticate, updateNoteValidaion, validateRequest, updateNote);
router.delete("/:id", authenticate, noteIdValidation, validateRequest, deleteNote);
router.patch("/:id/favorite", authenticate, noteIdValidation, validateRequest, toggleFavorite);

export default router;