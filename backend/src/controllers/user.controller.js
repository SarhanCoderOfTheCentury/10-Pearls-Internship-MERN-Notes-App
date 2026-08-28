//this controller would only run after the req.user parameter is filled with id which we need to find the user
import { getCurrentUserService, updateCurrentUserService } from "../services/userService.js"
import { asyncHandler } from "../utils/asyncHandler.js";
import { logger } from "../utils/logger.js";

export const getCurrentUser = asyncHandler(async (req, res, next) => {
    //calling the service to find the user by id
    const currentUser = await getCurrentUserService(req.user.id); //getting user by id provided by jwt middleware, not by req.params(frontend doesn't send id in req.params)

    logger.info("User found successfully", currentUser);

    return res.status(200).json({
        success: currentUser.success,
        message: currentUser.message,
        data: currentUser.data
    })
})

//controller to update current user profile
export const updateCurrentUser = asyncHandler(async (req, res, next) => {
    // calling the service to update the user
    const updatedUser = await updateCurrentUserService(req.user.id, req.body); //getting user by id provided by jwt middleware, not by req.params(frontend doesn't send id in req.params)

    logger.info("User updated successfully", updatedUser);

    return res.status(200).json({
        success: updatedUser.success,
        message: updatedUser.message,
        data: updatedUser.data
    })
})