//this is the env configuration file which will have all the environment variables

const mongoURI = process.env.MONGODB_URI || process.env.MONGO_URI;

const requiredEnvironmentVariables = ["NODE_ENV", "PORT", "JWT_SECRET", "JWT_EXPIRES_IN"];

//checking if all the required environment variables are present
for (const variable of requiredEnvironmentVariables) {
    if (!process.env[variable]) {
        throw new Error(`Missing required environment variable: ${variable}`);
    }
}
if (!mongoURI) {
    throw new Error("Missing required environment variable: MONGODB_URI");
}

//exporting the config object
export const config = {
    nodeEnv: process.env.NODE_ENV || "development",
    port: process.env.PORT || 5000,
    mongoURI: mongoURI,
    MONGODB_URI: mongoURI,
    jwtSecret: process.env.JWT_SECRET,
    jwtExpiresIn: process.env.JWT_EXPIRES_IN
};


//this is the error class
class AppError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
        this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
        this.isOperational = true;
    }
}
