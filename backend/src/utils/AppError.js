class AppError extends Error {
    constructor(message, statusCode){
        super(message);

        this.statusCode = statusCode;
        this.isOperational = true; //distinguishes between application errors vs unxpedted errors, eg -> Cannot read properties of undefined, these errors dont have status code as they are not intentional, they dont come from user input, our job is to catch and handle them

        Error.captureStackTrace(this, this.constructor);
    }
}

export default AppError;