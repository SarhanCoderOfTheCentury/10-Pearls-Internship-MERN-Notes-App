import mongoose from "mongoose";
import { config } from "./env.js";
import { logger } from "../utils/logger.js";

const connectDB = async () => {
    // Reuse existing database connection if already connected (Serverless optimization)
    if (mongoose.connection.readyState >= 1) {
        return;
    }
    try {
        const uri = config.mongoURI || process.env.MONGODB_URI;
        await mongoose.connect(uri);
        logger.info({ host: mongoose.connection.host }, "Connected to MongoDB");
    } catch (error) {
        logger.fatal({ message: error.message, stack: error.stack }, "Failed to connect to MongoDB");
        if (process.env.NODE_ENV !== "production") {
            process.exit(1);
        }
        throw error;
    }
}

export default connectDB;