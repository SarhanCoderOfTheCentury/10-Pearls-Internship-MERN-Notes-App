import { body } from 'express-validator'

// recieves fields from req.body sent by the api route
// and access it by body("fieldName")
// runs validation checks and if finds any error populates error object
// which then we catch in validation result middleware

export const registerValidation = [
    body("name")
        .trim()
        .notEmpty()
        .withMessage("Enter name"),
    body("email")
        .trim()
        .isEmail()
        .withMessage("Enter a valid email"),
    body("password")
        .isLength({ min: 8 })
        .withMessage("Password must be atleast 8 characters")
];

export const loginValidation = [    
    body("email")
        .trim()
        .isEmail()
        .withMessage("Enter a valid email"),
    body("password")
        .isLength({min:8})
        .withMessage("Password must be atleast 8 characters")
];
// how to add multiple checks to the password