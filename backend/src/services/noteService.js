import NotesModel from '../models/NotesModel'

const createNote = async (userId, noteData) =>{
    const note = await NotesModel.create(noteData)
    return note;
}

export {createNote, getNotes, getNote, updateNote, deleteNote}