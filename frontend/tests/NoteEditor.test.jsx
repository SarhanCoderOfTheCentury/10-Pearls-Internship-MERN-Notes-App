/**
 * NoteEditor.test.jsx
 *
 * Tests for NoteEditorPage.jsx
 */

import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { vi } from 'vitest';

import NoteEditorPage from '../src/pages/NoteEditorPage';

// ─── Hoisted mock refs ────────────────────────────────────────────────────────
const { mockCreateNote, mockGetNote, mockUpdateNote, mockDeleteNote } = vi.hoisted(() => ({
  mockCreateNote: vi.fn(),
  mockGetNote: vi.fn(),
  mockUpdateNote: vi.fn(),
  mockDeleteNote: vi.fn(),
}));

// ─── Mock note service ────────────────────────────────────────────────────────
vi.mock('../src/services/note.service', () => ({
  createNote: mockCreateNote,
  getNote: mockGetNote,
  updateNote: mockUpdateNote,
  deleteNote: mockDeleteNote,
  getNotes: vi.fn(),
  toggleFavorite: vi.fn(),
}));

// ─── Mock useToast ────────────────────────────────────────────────────────────
vi.mock('../src/hooks/useToast', () => ({
  default: () => ({
    toast: Object.assign(vi.fn(), { success: vi.fn(), error: vi.fn() }),
  }),
}));

// ─── Mock useUnsavedChanges ───────────────────────────────────────────────────
vi.mock('../src/hooks/useUnsavedChanges', () => ({
  default: vi.fn(),
}));

// ─── Mock RichTextEditor with a plain textarea ────────────────────────────────
// Tiptap has complex DOM requirements. Replace with a controlled <textarea>.
vi.mock('../src/components/RichTextEditor', () => ({
  default: ({ value, onChange }) => (
    <textarea
      aria-label="Content"
      value={typeof value === 'string' ? value : JSON.stringify(value)}
      onChange={(e) => onChange(e.target.value)}
    />
  ),
}));

// ─── Render helpers ───────────────────────────────────────────────────────────
function renderNewNote() {
  return render(
    <MemoryRouter initialEntries={['/notes/new']}>
      <Routes>
        <Route path="/notes/new" element={<NoteEditorPage />} />
        <Route path="/dashboard" element={<div>Dashboard</div>} />
      </Routes>
    </MemoryRouter>
  );
}

function renderEditNote(noteId = 'note-abc') {
  return render(
    <MemoryRouter initialEntries={[`/notes/${noteId}/edit`]}>
      <Routes>
        <Route path="/notes/:id/edit" element={<NoteEditorPage />} />
        <Route path="/dashboard" element={<div>Dashboard</div>} />
      </Routes>
    </MemoryRouter>
  );
}

// ─── Tests: New Note mode ─────────────────────────────────────────────────────
describe('NoteEditorPage — New Note mode', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  test('renders title input, tag select, content textarea, save and cancel buttons', () => {
    renderNewNote();

    expect(screen.getByPlaceholderText(/note title/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^tag$/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/content/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /create note/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument();
  });

  test('allows user to type a note title', async () => {
    const user = userEvent.setup();
    renderNewNote();

    const titleInput = screen.getByPlaceholderText(/note title/i);
    await user.type(titleInput, 'My new note');
    expect(titleInput).toHaveValue('My new note');
  });

  test('allows user to select a tag', async () => {
    const user = userEvent.setup();
    renderNewNote();

    const tagSelect = screen.getByLabelText(/tag/i);
    await user.selectOptions(tagSelect, 'work');
    expect(tagSelect).toHaveValue('work');
  });

  test('shows "Please enter a title" error when form is submitted with whitespace-only title', async () => {
    // The title input has HTML `required`, so clicking submit with an empty input
    // triggers native browser validation (in jsdom) and may block form submission.
    // We instead type a single space (passes `required` but fails `title.trim()`)
    // to trigger the JavaScript validation path in handleSubmit.
    const user = userEvent.setup();
    renderNewNote();

    const titleInput = screen.getByPlaceholderText(/note title/i);
    await user.type(titleInput, ' '); // space: passes required, fails trim()

    const form = titleInput.closest('form');
    fireEvent.submit(form);

    expect(await screen.findByText(/please enter a title/i)).toBeInTheDocument();
    expect(mockCreateNote).not.toHaveBeenCalled();
  });

  test('calls createNote with correct payload on valid save', async () => {
    mockCreateNote.mockResolvedValue({ _id: 'new-id', title: 'Test Note' });
    const user = userEvent.setup();
    renderNewNote();

    const titleInput = screen.getByPlaceholderText(/note title/i);
    await user.type(titleInput, 'Test Note');

    const form = titleInput.closest('form');
    fireEvent.submit(form);

    await waitFor(() => {
      expect(mockCreateNote).toHaveBeenCalledWith(
        expect.objectContaining({ title: 'Test Note' })
      );
    });
  });

  test('shows "Saving..." while the create request is in flight', async () => {
    mockCreateNote.mockImplementation(() => new Promise(() => {}));
    const user = userEvent.setup();
    renderNewNote();

    const titleInput = screen.getByPlaceholderText(/note title/i);
    await user.type(titleInput, 'Test Note');

    const form = titleInput.closest('form');
    fireEvent.submit(form);

    expect(await screen.findByText(/saving/i)).toBeInTheDocument();
  });

  test('navigates to /dashboard after successful note creation', async () => {
    mockCreateNote.mockResolvedValue({ _id: 'new-id' });
    const user = userEvent.setup();
    renderNewNote();

    const titleInput = screen.getByPlaceholderText(/note title/i);
    await user.type(titleInput, 'Test Note');

    fireEvent.submit(titleInput.closest('form'));

    expect(await screen.findByText('Dashboard')).toBeInTheDocument();
  });

  test('navigates to /dashboard when Cancel is clicked with no changes', async () => {
    const user = userEvent.setup();
    renderNewNote();

    await user.click(screen.getByRole('button', { name: /cancel/i }));

    expect(await screen.findByText('Dashboard')).toBeInTheDocument();
  });

  test('shows discard dialog when Cancel is clicked after making changes', async () => {
    const user = userEvent.setup();
    renderNewNote();

    const titleInput = screen.getByPlaceholderText(/note title/i);
    await user.type(titleInput, 'Draft title');

    await user.click(screen.getByRole('button', { name: /cancel/i }));

    // ConfirmDialog renders via portal into document.body; use waitFor to give it time
    await waitFor(() => {
      // The dialog h2 is "Discard changes?" — match by heading role
      expect(
        screen.getByRole('heading', { name: /discard changes/i })
      ).toBeInTheDocument();
    });
  });

  test('shows error alert when createNote API throws', async () => {
    mockCreateNote.mockRejectedValue(new Error('Server error'));
    const user = userEvent.setup();
    renderNewNote();

    const titleInput = screen.getByPlaceholderText(/note title/i);
    await user.type(titleInput, 'Test Note');

    fireEvent.submit(titleInput.closest('form'));

    expect(await screen.findByText(/server error/i)).toBeInTheDocument();
  });
});

// ─── Tests: Edit Note mode ────────────────────────────────────────────────────
describe('NoteEditorPage — Edit Note mode', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  test('renders loaded note after fetching in edit mode', async () => {
    mockGetNote.mockResolvedValue({
      _id: 'note-abc',
      title: 'Existing Title',
      content: { type: 'doc', content: [] },
      tag: 'work',
    });

    renderEditNote('note-abc');

    expect(await screen.findByPlaceholderText(/note title/i)).toHaveValue('Existing Title');
    expect(screen.getByRole('button', { name: /save changes/i })).toBeInTheDocument();
  });

  test('pre-fills the title input with loaded note data', async () => {
    mockGetNote.mockResolvedValue({
      _id: 'note-abc',
      title: 'Existing Title',
      content: '',
      tag: 'none',
    });

    renderEditNote('note-abc');
    await screen.findByPlaceholderText(/note title/i);

    expect(screen.getByPlaceholderText(/note title/i)).toHaveValue('Existing Title');
  });

  test('pre-fills the tag selector with the loaded note tag', async () => {
    mockGetNote.mockResolvedValue({
      _id: 'note-abc',
      title: 'Existing Title',
      content: '',
      tag: 'personal',
    });

    renderEditNote('note-abc');
    await screen.findByPlaceholderText(/note title/i);

    expect(screen.getByLabelText(/tag/i)).toHaveValue('personal');
  });

  test('calls updateNote with the note id and existing title when saved without changes', async () => {
    mockGetNote.mockResolvedValue({
      _id: 'note-abc',
      title: 'Existing Title',
      content: '',
      tag: 'work',
    });
    mockUpdateNote.mockResolvedValue({ _id: 'note-abc', title: 'Existing Title' });

    renderEditNote('note-abc');
    await screen.findByPlaceholderText(/note title/i);

    const titleInput = screen.getByPlaceholderText(/note title/i);
    // Pre-filled title must be "Existing Title" from getNote response
    expect(titleInput).toHaveValue('Existing Title');

    // Submit form without changing anything
    // The component is in editing mode (isEditing=true) so it calls updateNote
    fireEvent.submit(titleInput.closest('form'));

    await waitFor(() => {
      expect(mockUpdateNote).toHaveBeenCalledWith(
        'note-abc',
        expect.objectContaining({ title: 'Existing Title' })
      );
    });
  });



  test('shows loading spinner while the note is being fetched', async () => {
    mockGetNote.mockImplementation(() => new Promise(() => {}));
    renderEditNote('note-abc');

    expect(await screen.findByRole('status', { name: /loading/i })).toBeInTheDocument();
  });

  test('shows error message when getNote API throws', async () => {
    mockGetNote.mockRejectedValue(new Error('Note not found'));
    renderEditNote('note-abc');

    expect(await screen.findByText(/note not found/i)).toBeInTheDocument();
  });
});