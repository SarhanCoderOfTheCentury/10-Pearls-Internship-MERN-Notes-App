import { expect } from "chai";
import sinon from "sinon";
import { NotesModel } from "../../src/models/Note.js";
import {
    createNoteService,
    getNotesService,
    getNoteService,
    updateNoteService,
    deleteNoteService,
} from "../../src/services/noteService.js";

// NOTE: These are unit tests — they stub the database model so
// no real database connection is required.

describe("Note Service - Unit Tests", () => {
    afterEach(() => {
        sinon.restore();
    });

    // ─── createNoteService ───────────────────────────────────────────────────

    describe("createNoteService", () => {
        it("should create and return a new note", async () => {
            const fakeNote = {
                _id: "note123",
                title: "Test Note",
                content: "<p>Hello world</p>",
                tag: "work",
                user: "user123",
            };

            sinon.stub(NotesModel, "create").resolves(fakeNote);

            const result = await createNoteService("user123", {
                title: "Test Note",
                content: "<p>Hello world</p>",
                tag: "work",
            });

            expect(result).to.deep.equal(fakeNote);
            expect(result.title).to.equal("Test Note");
        });
    });

    // ─── getNotesService ─────────────────────────────────────────────────────

    describe("getNotesService", () => {
        it("should return paginated notes with correct pagination metadata", async () => {
            const fakeNotes = [
                { _id: "n1", title: "Note 1", content: "Content 1", user: "user123" },
                { _id: "n2", title: "Note 2", content: "Content 2", user: "user123" },
            ];

            // find().limit().skip().sort().lean() chain
            const leanStub = sinon.stub().resolves(fakeNotes);
            const sortStub = sinon.stub().returns({ lean: leanStub });
            const skipStub = sinon.stub().returns({ sort: sortStub });
            const limitStub = sinon.stub().returns({ skip: skipStub });
            sinon.stub(NotesModel, "find").returns({ limit: limitStub });
            sinon.stub(NotesModel, "countDocuments").resolves(5);

            const result = await getNotesService({
                userId: "user123",
                search: "",
                sort: "updatedAt_desc",
                page: 1,
                limit: 2,
                tag: "all",
                favorites: false,
            });

            // Notes array
            expect(result.notes).to.have.lengthOf(2);

            // All pagination metadata is now grouped under result.pagination
            expect(result.pagination).to.have.property("total", 5);
            expect(result.pagination).to.have.property("totalPages", 3); // ceil(5/2) = 3
            expect(result.pagination).to.have.property("page", 1);
            expect(result.pagination).to.have.property("limit", 2);
        });

        it("should apply search filter to query", async () => {
            const fakeNotes = [
                { _id: "n1", title: "React Tutorial", content: "useState hook", user: "user123" },
            ];

            const leanStub = sinon.stub().resolves(fakeNotes);
            const sortStub = sinon.stub().returns({ lean: leanStub });
            const skipStub = sinon.stub().returns({ sort: sortStub });
            const limitStub = sinon.stub().returns({ skip: skipStub });
            const findStub = sinon.stub(NotesModel, "find").returns({ limit: limitStub });
            sinon.stub(NotesModel, "countDocuments").resolves(1);

            await getNotesService({
                userId: "user123",
                search: "React",
                sort: "updatedAt_desc",
                page: 1,
                limit: 10,
                tag: "all",
                favorites: false,
            });

            // Verify that find() was called with a $or search filter
            const filterArg = findStub.firstCall.args[0];
            expect(filterArg).to.have.property("$or");
        });
    });

    // ─── getNoteService ──────────────────────────────────────────────────────

    describe("getNoteService", () => {
        it("should return a note that belongs to the user", async () => {
            const fakeNote = { _id: "note123", title: "My note", user: "user123" };
            sinon.stub(NotesModel, "findOne").resolves(fakeNote);

            const result = await getNoteService("user123", "note123");

            expect(result).to.deep.equal(fakeNote);
        });

        it("should throw 'Note not found' if note does not exist or belong to user", async () => {
            sinon.stub(NotesModel, "findOne").resolves(null);

            try {
                await getNoteService("user123", "nonexistent");
                throw new Error("Expected getNoteService to throw");
            } catch (error) {
                expect(error.message).to.equal("Note not found");
            }
        });
    });

    // ─── updateNoteService ───────────────────────────────────────────────────

    describe("updateNoteService", () => {
        it("should return the updated note", async () => {
            const updatedNote = {
                _id: "note123",
                title: "Updated title",
                content: "Updated content",
                user: "user123",
            };
            sinon.stub(NotesModel, "findOneAndUpdate").resolves(updatedNote);

            const result = await updateNoteService("user123", "note123", {
                title: "Updated title",
                content: "Updated content",
            });

            expect(result.title).to.equal("Updated title");
            expect(result.content).to.equal("Updated content");
        });

        it("should throw 'Note not found' if note does not exist", async () => {
            sinon.stub(NotesModel, "findOneAndUpdate").resolves(null);

            try {
                await updateNoteService("user123", "nonexistent", {
                    title: "X",
                    content: "Y",
                });
                throw new Error("Expected updateNoteService to throw");
            } catch (error) {
                expect(error.message).to.equal("Note not found");
            }
        });
    });

    // ─── deleteNoteService ───────────────────────────────────────────────────

    describe("deleteNoteService", () => {
        it("should return the deleted note id", async () => {
            const fakeNote = { _id: "note123", id: "note123", user: "user123" };
            sinon.stub(NotesModel, "findOneAndDelete").resolves(fakeNote);

            const result = await deleteNoteService("user123", "note123");

            expect(result).to.equal("note123");
        });

        it("should throw 'Note not found' if note does not exist", async () => {
            sinon.stub(NotesModel, "findOneAndDelete").resolves(null);

            try {
                await deleteNoteService("user123", "nonexistent");
                throw new Error("Expected deleteNoteService to throw");
            } catch (error) {
                expect(error.message).to.equal("Note not found");
            }
        });
    });
});