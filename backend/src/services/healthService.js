import mongoose from "mongoose"
import { logger } from "../utils/logger.js";

logger.info("Health service is loading");

// getting health status of the API
const getHealthStatus = () => {
    return {
        status: 'OK',
        message: 'API Is running'
    }
}

//checking if database is connected
const getDatabaseHealthStatus = () => {
    const databaseConnected = mongoose.connection.readyState === 1;
    return {
        database: databaseConnected ? "Database running successfully" : "Databsase failed to run"
    }
}
export { getHealthStatus, getDatabaseHealthStatus };

