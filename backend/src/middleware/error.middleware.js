import { logger } from "../utils/logger.js";

//global error handler
export const errorHandler = (err, req, res, next) => {

    //setting status code for error response
    let statusCode = err.statusCode || 500;
    const isProduction = process.env.NODE_ENV === 'production';

    //constructing error response
    const response = {
        success: false,
        message: statusCode === 500 && isProduction ? "Internal server error" : err.message,
        error: !isProduction ? err.stack : null
    };

    //database errors - handling different types of errors from mongoose

    //receiving validation errors from validation.middleware
    if (err.name === 'ValidationError') {
        statusCode = 400;
        response.message = "Invalid data";
        response.error = err.message;
        response.details = err.details;
    }

    //used to handle duplicate key errors, which happens when trying to create a note with the same title as an existing note, would run for fields with unique constraint eg email, title, etc
    if (err.code === 11000) {
        statusCode = 400;
        response.message = "Already exists";
        response.error = err.message;
    }

    // handling invalid data errors from mongoose queries for example, if i try to delete a note with invalid id, it would run this and return an error
    if (err.name === 'CastError') {
        statusCode = 400;
        response.message = "Invalid data";
        response.error = err.message;
    }

    //if there are validation errors, add them to the response
    if (err.details) {
        response.details = err.details;
    }

    logger.error({ err, method: req.method, url: req.url }, err.message);
    
    // send the error response
    res.status(statusCode).json(response);
};