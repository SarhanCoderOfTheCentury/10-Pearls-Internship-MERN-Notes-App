import "dotenv/config";
import request from "supertest";
import app from "../../src/app.js";

export const registerAndLogin = async ({ name, email, password }) => {
    // Register the user (201)
    await request(app).post("/api/auth/register").send({ name, email, password });

    // Log in — loginUser controller puts `token` at the root of the response body
    const response = await request(app)
        .post("/api/auth/login")
        .send({ email, password });

    return response.body.token;
};