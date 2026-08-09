import noteService from "../services/noteService.js"

//only handles http work, business logic is from service
const createNote = async (req, res) => {
    try {
        const note = noteService.createNote(
            req.user.id,
            req.body
        );

        return res.status(201).json({
            success: true,
            data: note,
            message: "Note created successfully"
        })

    } catch (error) {
        return res.status(500).json({ message: "Internal server error" })
    }
}

const getAllNotes = async (req, res) => {
    try {

    } catch (error) {

    }
}

const updateNote = async (req, res) => {
    try {

    } catch (error) {

    }
}

const deleteNote = async (req, res) => {
    try {

    } catch (error) {

    }
}

//getting a specific note by note ID
const getNoteById = async (req, res) => {
    try {

    } catch (error) {

    }
}

export { createNote, getAllNotes, updateNote, deleteNote, getUserNotes }