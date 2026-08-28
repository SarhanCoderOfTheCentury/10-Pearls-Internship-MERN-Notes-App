import "dotenv/config";
import mongoose from "mongoose";

// First establish the connection
const uri = process.env.TEST_MONGODB_URI;
await mongoose.connect(uri, { serverSelectionTimeoutMS: 15000 });
console.log("Connected. readyState:", mongoose.connection.readyState);
console.log("DB:", mongoose.connection.db.databaseName);

// Now import app (which triggers env.js, routes, etc.)
const { default: app } = await import("../../src/app.js");
console.log("App imported. readyState after import:", mongoose.connection.readyState);

// Try a raw mongoose operation
const { UserModel } = await import("../../src/models/User.js");
console.log("Attempting findOne...");
const result = await UserModel.findOne({ email: "nobody@test.com" });
console.log("findOne result:", result); // should be null, not timeout

await mongoose.connection.close();
