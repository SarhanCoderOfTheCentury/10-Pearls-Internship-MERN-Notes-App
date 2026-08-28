import express from "express";
import cors from "cors";
import helmet from "helmet";
import { notFound } from "./middleware/notFound.middleware.js";
import { errorHandler } from "./middleware/error.middleware.js";
import { httpLogger } from "./middleware/logger.middleware.js";
import healthRoutes from "./routes/health.routes.js";
import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js"
import noteRoutes from "./routes/notes.routes.js"

const app = express();

// MIDDLEWARES (Must be before routes!)
//cors is not authentication it is security implementation to control which browser is allowed to access your backend server.
//if you do not provide an origin it is allowed for all origins which is not recommended for production
app.use(cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
}));

//helmet is a collection of 14 small security middlewares
app.use(helmet());

//this middleware is used to parse incoming JSON requests
app.use(express.json({ limit: "10mb" })); 

//this middleware is used to parse incoming URL-encoded requests
app.use(express.urlencoded({ limit: "10mb", extended: true }));

//this middleware is used to log HTTP requests
app.use(httpLogger);

// ROUTES
app.use("/api/health", healthRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/notes", noteRoutes)

// 404 handler (must be placed after all other routes)
app.use(notFound);

//global error handler - should be registered after all routes
app.use(errorHandler); 

export default app;


// i want you to create me a detailed http request file having all requests testing all the pino implementation of the app, with proper comments and reasoning