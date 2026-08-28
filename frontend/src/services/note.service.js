import apiRequest from "./api";

const getNotes = async ({
  search = "",
  limit = "10",
  page = "1",
  sort = "updatedAt_desc",
  tag = "all",
  favorites = "false",
}) => {
  // handles making url query parameters
  // by using it we dont have to manually make url with parameters
  // it is just a cleaner way to make url parameters
  const params = new URLSearchParams();

  params.set("page", page);
  params.set("limit", limit);
  params.set("sort", sort);
  params.set("search", search?.trim() || "");
  params.set("tag", tag);
  params.set("favorites", favorites);

  const queryString = params.toString();

  const res = await apiRequest(`/notes?${queryString}`, {
    method: "GET",
  });
  return res.data;
};

const getNote = async (noteId) => {
  const res = await apiRequest(`/notes/${noteId}`, {
    method: "GET",
  });
  return res.data;
};

const createNote = async (noteData) => {
  const res = await apiRequest("/notes", {
    method: "POST",
    body: JSON.stringify(noteData),
  });
  return res.data;
};

const updateNote = async (noteId, noteData) => {
  const res = await apiRequest(`/notes/${noteId}`, {
    method: "PUT",
    body: JSON.stringify(noteData),
  });
  return res.data;
};

const deleteNote = async (noteId) => {
  const res = await apiRequest(`/notes/${noteId}`, {
    method: "DELETE",
  });
  return res.data;
};

const toggleFavorite = async (noteId) => {
  const res = await apiRequest(`/notes/${noteId}/favorite`, {
    method: "PATCH",
  });
  return res.data;
};

export { getNotes, getNote, createNote, updateNote, deleteNote, toggleFavorite };

