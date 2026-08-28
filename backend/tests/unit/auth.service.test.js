import "dotenv/config"; // load JWT_SECRET etc. before any service is imported
import { expect } from "chai";
import sinon from "sinon";
import bcrypt from "bcrypt";
import { UserModel } from "../../src/models/User.js";
import { loginUserService } from "../../src/services/authService.js";

// NOTE: Because authService.js imports generateToken directly from jwt.js
// (not as a property on an object), we stub UserModel.findOne and bcrypt.compare
// directly. The token returned is whatever generateToken actually produces —
// which is fine for a unit test (we still assert the shape of the result).

describe("Auth Service - loginUserService", () => {
    afterEach(() => {
        sinon.restore();
    });

    it("should return a token and user data for a valid login", async () => {
        const fakeUser = {
            _id: "user123",
            name: "Test User",
            email: "test@example.com",
            password: "hashed-password",
        };

        // Simulate finding the user in the database
        sinon.stub(UserModel, "findOne").resolves(fakeUser);

        // Simulate bcrypt returning true (password matches)
        sinon.stub(bcrypt, "compare").resolves(true);

        const result = await loginUserService({
            email: "test@example.com",
            password: "Password123",
        });

        // The service should return success with a token
        expect(result.success).to.equal(true);
        expect(result).to.have.property("token");
        expect(result.token).to.be.a("string");
        expect(result.data.email).to.equal("test@example.com");
    });

    it("should throw 'Invalid email or password' when user is not found", async () => {
        // Simulate no user found in the database
        sinon.stub(UserModel, "findOne").resolves(null);

        try {
            await loginUserService({
                email: "nonexistent@example.com",
                password: "Password123",
            });
            throw new Error("Expected loginUserService to throw");
        } catch (error) {
            expect(error.message).to.equal("Invalid email or password");
        }
    });

    it("should throw 'Invalid email or password' when password is wrong", async () => {
        const fakeUser = {
            _id: "user123",
            email: "test@example.com",
            password: "hashed-password",
        };

        // Simulate finding the user in the database
        sinon.stub(UserModel, "findOne").resolves(fakeUser);

        // Simulate bcrypt returning false (password does NOT match)
        sinon.stub(bcrypt, "compare").resolves(false);

        try {
            await loginUserService({
                email: "test@example.com",
                password: "WrongPassword",
            });
            throw new Error("Expected loginUserService to throw");
        } catch (error) {
            expect(error.message).to.equal("Invalid email or password");
        }
    });
});