import "dotenv/config";
import { expect } from "chai";
import request from "supertest";
import app from "../../src/app.js";
import {
    connectTestDatabase,
    clearTestDatabase,
    closeTestDatabase,
} from "../helpers/testDatabase.js";

describe("Authentication API", () => {
    before(async () => {
        await connectTestDatabase();
    });

    beforeEach(async () => {
        await clearTestDatabase();
    });

    after(async () => {
        await closeTestDatabase();
    });

    // ─── Register ────────────────────────────────────────────────────────────

    it("should register a new user", async () => {
        const response = await request(app).post("/api/auth/register").send({
            name: "test_user",
            email: "testuser123@example.com",
            password: "password123",
        });

        // registerUser controller returns 201
        expect(response.status).to.equal(201);
        expect(response.body.success).to.equal(true);
        // data contains { id, name, email } — no password
        expect(response.body.data).to.have.property("email");
        expect(response.body.data.email).to.equal("testuser123@example.com");
    });

    it("should reject duplicate email", async () => {
        const user = {
            name: "test_user",
            email: "testuser123@example.com",
            password: "password123",
        };

        // First registration succeeds
        await request(app).post("/api/auth/register").send(user);

        // Second registration with same email — registerUserService throws AppError(409)
        const response = await request(app).post("/api/auth/register").send(user);

        expect(response.status).to.equal(409);
        expect(response.body.success).to.equal(false);
    });

    // ─── Login ───────────────────────────────────────────────────────────────

    it("should login an existing user", async () => {
        const user = {
            name: "login_user",
            email: "loginuser123@example.com",
            password: "password123",
        };

        await request(app).post("/api/auth/register").send(user);

        const response = await request(app)
            .post("/api/auth/login")
            .send({ email: user.email, password: user.password });

        expect(response.status).to.equal(200);
        expect(response.body.success).to.equal(true);
        // loginUser controller puts token at root level, not inside data
        expect(response.body).to.have.property("token");
        expect(response.body.token).to.be.a("string");
    });

    it("should reject an invalid password", async () => {
        const user = {
            name: "login_user",
            email: "loginuser123@example.com",
            password: "password123",
        };

        await request(app).post("/api/auth/register").send(user);

        const response = await request(app)
            .post("/api/auth/login")
            .send({ email: user.email, password: "wrongpassword123" });

        // loginUserService throws AppError("Invalid email or password", 401)
        expect(response.status).to.equal(401);
        expect(response.body.success).to.equal(false);
    });
});
