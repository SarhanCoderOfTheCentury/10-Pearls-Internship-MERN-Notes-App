import "dotenv/config";
import { expect } from "chai";
import request from "supertest";
import app from "../../src/app.js";
import { registerAndLogin } from "../helpers/auth.js";
import {
    connectTestDatabase,
    clearTestDatabase,
    closeTestDatabase,
} from "../helpers/testDatabase.js";

// Response shape reference (from noteService + notes.controller.js):
//
//  GET /api/notes  →  { success, data: { notes: [], pagination: { page, limit, total, totalPages } }, message }
//  POST /api/notes →  { success, data: <note>, message }          (201)
//  PUT  /api/notes/:id → { success, data: <note>, message }       (200)
//  DEL  /api/notes/:id → { success, data: <deletedId>, message }  (200)
//  GET  /api/notes/:id → { success, data: <note>, message }       (200)

describe("Notes API", () => {
    let token;

    before(async () => {
        await connectTestDatabase();
    });

    beforeEach(async () => {
        await clearTestDatabase();
        // Fresh token before every test
        token = await registerAndLogin({
            name: "Note user",
            email: "notes@example.com",
            password: "password123",
        });
    });

    after(async () => {
        await closeTestDatabase();
    });

    // ─── Create ──────────────────────────────────────────────────────────────

    it("should create a note", async () => {
        const response = await request(app)
            .post("/api/notes")
            .set("Authorization", `Bearer ${token}`)
            .send({
                title: "My first test note",
                content: "<p>Hello world</p>",
            });

        expect(response.status).to.equal(201);
        expect(response.body.success).to.equal(true);
        expect(response.body.data.title).to.equal("My first test note");
        expect(response.body.data.content).to.equal("<p>Hello world</p>");
    });

    // ─── Update ──────────────────────────────────────────────────────────────

    it("should update a note", async () => {
        const createResponse = await request(app)
            .post("/api/notes")
            .set("Authorization", `Bearer ${token}`)
            .send({ title: "Original title", content: "Original content" });

        const noteId = createResponse.body.data._id;

        const response = await request(app)
            .put(`/api/notes/${noteId}`)
            .set("Authorization", `Bearer ${token}`)
            .send({ title: "Updated note", content: "Updated content" });

        expect(response.status).to.equal(200);
        expect(response.body.success).to.equal(true);
        expect(response.body.data.title).to.equal("Updated note");
        expect(response.body.data.content).to.equal("Updated content");
    });

    // ─── Delete ──────────────────────────────────────────────────────────────

    it("should delete a note", async () => {
        const createResponse = await request(app)
            .post("/api/notes")
            .set("Authorization", `Bearer ${token}`)
            .send({ title: "Note to delete", content: "Bye" });

        const noteId = createResponse.body.data._id;

        const deleteResponse = await request(app)
            .delete(`/api/notes/${noteId}`)
            .set("Authorization", `Bearer ${token}`);

        expect(deleteResponse.status).to.equal(200);
        expect(deleteResponse.body.success).to.equal(true);

        // Fetching the deleted note should now return 404
        const getResponse = await request(app)
            .get(`/api/notes/${noteId}`)
            .set("Authorization", `Bearer ${token}`);

        expect(getResponse.status).to.equal(404);
    });

    // ─── Pagination ──────────────────────────────────────────────────────────

    it("should return paginated notes with a pagination object", async () => {
        // Create 3 notes
        for (let i = 1; i <= 3; i++) {
            await request(app)
                .post("/api/notes")
                .set("Authorization", `Bearer ${token}`)
                .send({ title: `Title ${i}`, content: `Content ${i}` });
        }

        const response = await request(app)
            .get("/api/notes?page=1&limit=2")
            .set("Authorization", `Bearer ${token}`);

        expect(response.status).to.equal(200);

        const { notes, pagination } = response.body.data;

        // Current page should have 2 notes (limit=2)
        expect(notes).to.have.lengthOf(2);

        // Pagination object should carry all metadata
        expect(pagination).to.have.property("page", 1);
        expect(pagination).to.have.property("limit", 2);
        expect(pagination).to.have.property("total", 3);
        expect(pagination).to.have.property("totalPages", 2); // ceil(3/2) = 2
    });

    // ─── Search ──────────────────────────────────────────────────────────────

    it("should search notes by title", async () => {
        await request(app)
            .post("/api/notes")
            .set("Authorization", `Bearer ${token}`)
            .send({ title: "React tutorial", content: "<p>useState hook</p>" });

        await request(app)
            .post("/api/notes")
            .set("Authorization", `Bearer ${token}`)
            .send({ title: "MongoDB guide", content: "<p>Database notes</p>" });

        const response = await request(app)
            .get("/api/notes?search=React")
            .set("Authorization", `Bearer ${token}`);

        expect(response.status).to.equal(200);
        expect(response.body.data.notes).to.have.lengthOf(1);
        expect(response.body.data.notes[0].title).to.equal("React tutorial");
    });

    it("should search notes by content", async () => {
        await request(app)
            .post("/api/notes")
            .set("Authorization", `Bearer ${token}`)
            .send({ title: "React tutorial", content: "<p>Today we learn useState</p>" });

        await request(app)
            .post("/api/notes")
            .set("Authorization", `Bearer ${token}`)
            .send({ title: "MongoDB guide", content: "<p>Database notes</p>" });

        const response = await request(app)
            .get("/api/notes?search=useState")
            .set("Authorization", `Bearer ${token}`);

        expect(response.status).to.equal(200);
        expect(response.body.data.notes).to.have.lengthOf(1);
    });

    // ─── Sorting ─────────────────────────────────────────────────────────────

    it("should sort notes by title ascending", async () => {
        await request(app)
            .post("/api/notes")
            .set("Authorization", `Bearer ${token}`)
            .send({ title: "React tutorial", content: "useState" });

        await request(app)
            .post("/api/notes")
            .set("Authorization", `Bearer ${token}`)
            .send({ title: "MongoDB guide", content: "Database" });

        const response = await request(app)
            .get("/api/notes?sort=title_asc")
            .set("Authorization", `Bearer ${token}`);

        expect(response.status).to.equal(200);
        // "MongoDB guide" < "React tutorial" alphabetically
        expect(response.body.data.notes[0].title).to.equal("MongoDB guide");
    });

    // ─── Authorization ───────────────────────────────────────────────────────

    it("should reject request if no token is provided", async () => {
        const response = await request(app).get("/api/notes");
        // No Authorization header → auth middleware returns 401
        expect(response.status).to.equal(401);
        expect(response.body.success).to.equal(false);
    });

    it("should not allow user B to access user A's note", async () => {
        // Create note as User A (uses the shared `token`)
        const createResponse = await request(app)
            .post("/api/notes")
            .set("Authorization", `Bearer ${token}`)
            .send({ title: "User A private note", content: "secret" });

        const noteId = createResponse.body.data.note._id;

        // Register and login as User B
        const tokenB = await registerAndLogin({
            name: "User B",
            email: "userb@example.com",
            password: "password123",
        });

        // User B tries to fetch User A's note — getNoteService matches {_id, user} so returns 404
        const response = await request(app)
            .get(`/api/notes/${noteId}`)
            .set("Authorization", `Bearer ${tokenB}`);

        expect(response.status).to.equal(404);
    });
});
