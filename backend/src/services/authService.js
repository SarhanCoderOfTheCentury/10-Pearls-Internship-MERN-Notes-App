import { UserModel } from "../models/User.js";
import bcrypt from "bcrypt";
import { generateToken, verifyToken } from "../utils/jwt.js";
import AppError from '../utils/AppError.js';
import { logger } from "../utils/logger.js";

const registerUserService = async (user) => {
    const normalizedEmail = user.email.toLowerCase().trim()

    const existingUser = await UserModel.findOne({ email: normalizedEmail });

    if (existingUser) {
        throw new AppError("User already exists", 409);
    }

    const hashedPassword = await bcrypt.hash(user.password, 12);

    const newUser = await UserModel.create({
        name: user.name,
        email: normalizedEmail,
        password: hashedPassword
    });

    logger.info({ userId: newUser._id, email: newUser.email }, "User registered successfully");

    return {
        success: true,
        data: {
            id: newUser._id,
            name: newUser.name,
            email: newUser.email
        },
        message: "user registered successfully",
    };
}

const loginUserService = async (user) => {
    const normalizedEmail = user.email.toLowerCase().trim()

    //finding of the user exists in db, and if yes using it to generate a token, that would protect user data
    const userExist = await UserModel.findOne({ email: normalizedEmail });

    if (!userExist) {
        throw new AppError("Invalid email or password", 401);
    }

    const isPasswordMatching = await bcrypt.compare(user.password, userExist.password);

    if (!isPasswordMatching) {
        throw new AppError("Invalid email or password", 401);    }

    const token = generateToken({ id: userExist._id });

    logger.info({ userId: userExist._id }, "User logged in successfully");

    return {
        success: true,
        data: {
            id: userExist._id,
            name: userExist.name,
            email: userExist.email
        },
        token: token,
        message: "User logged in successfully",
    };
}
export { registerUserService, loginUserService }