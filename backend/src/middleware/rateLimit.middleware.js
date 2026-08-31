import rateLimit from "express-rate-limit";
import { logger } from "../utils/logger.js";
import MongoStore from 'rate-limit-mongo';

export const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 20,
    message: "Too many requests, please try again later",
    // skip the rate limiting in test mode or if the test mongodb uri is set to allow the tests to run
    skip: () => process.env.NODE_ENV === "test" || (Boolean(process.env.TEST_MONGODB_URI) && process.env.NODE_ENV !== "production"),
    // Return rate limit info in the `RateLimit-*` headers
    standardHeaders: true,
    // Disable the `X-RateLimit-*` headers
    legacyHeaders: false,
    // this will store keys in our mongo database with the ip
    store: new MongoStore({
        uri: process.env.MONGODB_URI || process.env.MONGO_URI,
        collectionName: "rateLimit",//would store ip addresses along with request count and expiry time in a collection named rateLimit in the mongodb, its advantage would be that it would persist even if the server restarts, for example if the server restarts, the ip addresses and request counts would not be lost and would continue to be tracked.
        expireTimeMs: 15 * 60 * 1000,
    }),
    //this will be called when the rate limit is exceeded
    handler: (req, res, next, options) => {
        logger.error(`Too many requests from ${req.ip}`);
        res.status(429).json({
            status: "error",
            message: options.message,
        });
    },
});