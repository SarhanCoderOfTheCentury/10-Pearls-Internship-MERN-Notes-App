import AppError from "../utils/AppError.js";
import { verifyToken } from "../utils/jwt.js";
import { logger } from "../utils/logger.js";

//this middleware verifies the jwt token extracted from the header and populates the req.user with the decoded user id
export const authenticate = (req, res, next) => {

    // logging the request
    logger.info({ req }, "Request received");

    //intercept the request headers and extract token
    const authHeader = req.headers.authorization;

    //if no token is provided
    if (!authHeader) {
        return next(new AppError("Authentication required", 401));
    }

    const parts = authHeader.split(' ');

    //checking if the header has the correct format which is "Bearer <token>"
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
        return next(new AppError("Invalid Authorization format", 401));
    }

    //extracting token from header
    const token = parts[1]

    //verifying the token using verifyToken util and attaching decoded payload to req.user
    try {
        const decoded = verifyToken(token);

        logger.info({ decoded }, "Token verified successfully");

        //populating user with decoded token
        req.user = decoded;

        //passing control to the next middleware or route handler
        next();
    } catch (error) {
        next(
            new AppError("Invalid or expired token", 401)
        )
    }
}