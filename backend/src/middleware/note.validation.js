import { body, param } from "express-validator"

const VALID_TAGS = ["work", "personal", "idea", "none"];

const createNoteValidation = [
    body("title")
        .trim()
        .notEmpty()
        .withMessage("Please enter title")
        .isLength({ min: 6, max: 50 })
        .withMessage("Title must be between 6 and 50 characters"),
    body("content")
        .isObject()
        .withMessage("Content must be a valid JSON object"),
    body("tag")
        .optional()
        .isIn(VALID_TAGS)
        .withMessage(`Tag must be one of: ${VALID_TAGS.join(", ")}`),
]

const updateNoteValidaion = [
    param("id")
        .isMongoId()
        .withMessage("Invalid id"),
    body("title")
        .trim()
        .notEmpty()
        .withMessage("Please enter title")
        .isLength({ min: 6, max: 50 })
        .withMessage("Title must be between 6 and 50 characters"),
    body("content")
        .isObject()
        .withMessage("Content must be a valid JSON object"),
    body("tag")
        .optional()
        .isIn(VALID_TAGS)
        .withMessage(`Tag must be one of: ${VALID_TAGS.join(", ")}`),
]

const noteIdValidation = [
    param("id")
        .isMongoId()
        .withMessage("Invalid id")
]

export { createNoteValidation, updateNoteValidaion, noteIdValidation }