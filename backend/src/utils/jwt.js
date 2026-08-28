import jwt from "jsonwebtoken";

//function to generate token
const generateToken = (payload) => {
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || "1h" });
    return token;
}

//function to verify token
const verifyToken = (token) => {
    const verifiedToken = jwt.verify(token, process.env.JWT_SECRET);

    //returning the payload with id which we can access later as userId in controller
    return {id: verifiedToken.id};  
}

export { generateToken, verifyToken };