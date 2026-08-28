import mongoose from "mongoose";
import { config } from "./env.js";
import { logger } from "../utils/logger.js";

const connectDB = async () => {
    try {
        const uri = config.mongoURI || process.env.MONGODB_URI;
        await mongoose.connect(uri);
        logger.info({ host: mongoose.connection.host }, "Connected to MongoDB");
    } catch (error) {
        logger.fatal({ message: error.message, stack: error.stack }, "Failed to connect to MongoDB");
        //stopping application if database connection fails
        process.exit(1);
    }
}

export default connectDB;