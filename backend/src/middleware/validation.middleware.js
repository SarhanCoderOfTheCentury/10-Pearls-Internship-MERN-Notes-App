import { validationResult } from "express-validator";

import AppError from "../utils/AppError.js";
import { logger } from "../utils/logger.js";


export const validateRequest = (req, res, next) => {
    //collecting errors in req object into errors
    const errors = validationResult(req);

    logger.error("All errors are collected from req into errors", errors);

    if (!errors.isEmpty()) {
        //passing errors along with the error object to global error handler
        const error = new AppError("Validation failed", 400);

        //populating error.details with validation errors array
        error.details = errors.array();

        //if error occured pass the error object to global error handler
        return next(error);
    }
    //if request doesnt fail call the next middleware or controller in the chain
    next();
}