import "dotenv/config";
import mongoose from "mongoose";

// Always connect to the dedicated test database, never production
const connectTestDatabase = async () => {
    const uri = process.env.TEST_MONGODB_URI;
    if (!uri) throw new Error("TEST_MONGODB_URI is not defined in .env");

    // Reuse if already open
    if (mongoose.connection.readyState === 1) return;

    // Disable command buffering so operations fail fast if not connected,
    // but first give the connection itself plenty of time to open.
    await mongoose.connect(uri, {
        serverSelectionTimeoutMS: 30000,  // how long to find a server
        socketTimeoutMS: 45000,           // how long a socket op can sit idle
        connectTimeoutMS: 30000,          // initial TCP connect timeout
        bufferCommands: false,            // don't buffer — fail immediately if not connected
    });
};

const clearTestDatabase = async () => {
    const collections = mongoose.connection.collections;
    for (const collectionName of Object.keys(collections)) {
        await collections[collectionName].deleteMany({});
    }
};

const closeTestDatabase = async () => {
    await mongoose.connection.close();
};

export { connectTestDatabase, clearTestDatabase, closeTestDatabase };