import { UserModel } from "../models/User.js";
import AppError from "../utils/AppError.js";
import { logger } from "../utils/logger.js";

export const getCurrentUserService = async (id) => {
    // logging the user id
    logger.info({ id }, "Fetching current user");

    const currentUser = await UserModel.findById(id).select("-password");

    //if user id is not valid or user not found then return error
    if (!currentUser) {
        throw new AppError("User not found", 400);
    }

    // if user is found, log it
    logger.info({ userId: currentUser._id }, "Current user fetched successfully");

    //if user is found then return the data without password
    return {
        success: true,
        data: {
            id: currentUser._id,
            name: currentUser.name,
            email: currentUser.email,
            bio: currentUser.bio
        },
        message: "user fetched successfully",
    };
}

export const updateCurrentUserService = async(id, userData) =>{
    // update the user
    const updatedUser =  await UserModel.findByIdAndUpdate(id, {...userData})

    // if user not found
    if(!updatedUser){
        throw new AppError("User not found", 404);
    }

    // return updated user data
    return {
        success: true,
        data: {
            id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            bio: updatedUser.bio
        },
        message: "user updated successfully",
    }
}