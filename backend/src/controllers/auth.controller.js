import { registerUserService, loginUserService } from "../services/authService.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const registerUser = asyncHandler(async (req, res) => {
    //sending the req body to the service to process it and add it to database
    const user = await registerUserService(req.body);

    res.status(201).json({
        success: user.success,
        message: user.message,
        data: user.data,
        timestamp: new Date().toISOString(),
    });
})

const loginUser = asyncHandler(async (req, res) => {
    //here we send the body to the service to validate and process the login
    const user = await loginUserService(req.body);

    const status = user.success ? 200 : 400;

    res.status(status).json({
        success: user.success,
        message: user.message,
        data: user.data,
        token: user.token,
        timestamp: new Date().toISOString(),
    });
})
export { registerUser, loginUser }