import { asyncHandler } from "../utils/asyncHandler.js";
import {
  createNoteService,
  getNotesService,
  getNoteService,
  updateNoteService,
  toggleFavoriteService,
  deleteNoteService,
} from "../services/noteService.js";
//only handles http work, business logic is from service, we send req.body and req.user.id to service


const createNote = asyncHandler(async (req, res) => {
  const { title, content, tag } = req.body;
  //we have to send this to ensure the right user is creating note, which is made possible because of our auth middleware
  const note = await createNoteService(
    //this is where the user enters the notes in postman
    req.user.id,
    { title, content, tag },
  );

  //once note is created we send a response
  return res.status(201).json({
    success: true,
    data: note,
    message: "Note created successfully",
  });
});

const getNotes = asyncHandler(async (req, res) => {
  const { search, limit, page, sort, tag, favorites } = req.query;
  //setting default values for the parameters
  const notes = await getNotesService({
    userId: req.user.id,
    search: search || "",
    limit: Number(limit) || 10,
    page: Number(page) || 1,
    sort: sort || "updatedAt_desc",
    tag: tag || "all",
    favorites: favorites || "false",
  });

  return res.status(200).json({
    success: true,
    data: notes,
    message: "All notes fetched successfully",
  });
});

const updateNote = asyncHandler(async (req, res) => {
  const { title, content, tag } = req.body;
  const updatedNote = await updateNoteService(
    req.user.id, //id for which user to update the note
    req.params.id, //id for which note to update
    { title, content, tag },
  );

  return res.status(200).json({
    success: true,
    data: updatedNote,
    message: "Note updated successfully",
  });
});

const deleteNote = asyncHandler(async (req, res) => {
  const deletedNoteId = await deleteNoteService(
    req.user.id, //id for which user to delete the note
    req.params.id, //id for which note to delete
  );
  return res.status(200).json({
    success: true,
    data: deletedNoteId,
    message: "Note deleted successfully",
  });
});

//getting a specific note by note ID
const getNote = asyncHandler(async (req, res) => {
  const note = await getNoteService(
    req.user.id, //id for which user to get the note
    req.params.id, //id for which note to get
  );
  return res.status(200).json({
    success: true,
    data: note,
    message: "Note fetched successfully",
  });
});

// Toggle the isFavorite boolean on a specific note
const toggleFavorite = asyncHandler(async (req, res) => {
  const updatedNote = await toggleFavoriteService(
    req.user.id,
    req.params.id,
  );
  return res.status(200).json({
    success: true,
    data: updatedNote,
    message: `Note ${updatedNote.isFavorite ? "added to" : "removed from"} favorites`,
  });
});

export { createNote, getNotes, updateNote, deleteNote, getNote, toggleFavorite };

