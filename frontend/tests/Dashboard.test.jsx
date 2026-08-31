/**
 * Dashboard.test.jsx
 *
 * Tests for DashboardPage.jsx
 */

import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { vi } from 'vitest';

import DashboardPage from '../src/pages/DashboardPage';

// ─── Hoisted mock refs ────────────────────────────────────────────────────────
const { mockGetNotes, mockDeleteNote, mockToggleFavorite } = vi.hoisted(() => ({
  mockGetNotes: vi.fn(),
  mockDeleteNote: vi.fn(),
  mockToggleFavorite: vi.fn(),
}));

// ─── Mock note service ────────────────────────────────────────────────────────
vi.mock('../src/services/note.service', () => ({
  getNotes: mockGetNotes,
  deleteNote: mockDeleteNote,
  toggleFavorite: mockToggleFavorite,
  getNote: vi.fn(),
  createNote: vi.fn(),
  updateNote: vi.fn(),
}));

// ─── Mock useAuth ─────────────────────────────────────────────────────────────
const mockAuthReturn = {
  user: { name: 'Test User', _id: 'u1' },
  loading: false,
  isAuthenticated: true,
  loginUser: vi.fn(),
  logoutUser: vi.fn(),
};

vi.mock('../src/hooks/useAuth', () => ({
  default: () => mockAuthReturn,
}));

// ─── Mock useToast ────────────────────────────────────────────────────────────
const mockToastFn = Object.assign(vi.fn(), { success: vi.fn(), error: vi.fn() });
const mockToastReturn = {
  toast: mockToastFn,
  showToast: null,
};

vi.mock('../src/hooks/useToast', () => ({
  default: () => mockToastReturn,
}));

// ─── Shared note data ─────────────────────────────────────────────────────────
const NOTE_1 = {
  _id: '1',
  title: 'Note 1',
  content: 'Content 1',
  createdAt: '2022-01-01',
  updatedAt: '2022-01-01',
  isFavorite: false,
};
const NOTE_2 = {
  _id: '2',
  title: 'Note 2',
  content: 'Content 2',
  createdAt: '2022-01-02',
  updatedAt: '2022-01-02',
  isFavorite: false,
};

/**
 * DashboardPage calls `getNotes()` (from note.service.js) which returns the
 * raw data object containing notes and pagination metadata.
 */
function makeNotesResponse(notes = [], pageOverrides = {}) {
  const page = pageOverrides.page || 1;
  const limit = pageOverrides.limit || 10;
  const total = pageOverrides.total !== undefined
    ? pageOverrides.total
    : (pageOverrides.totalNotes !== undefined ? pageOverrides.totalNotes : notes.length);
  const totalPages = pageOverrides.totalPages !== undefined
    ? pageOverrides.totalPages
    : (Math.ceil(total / limit) || 1);

  return {
    notes,
    page,
    limit,
    totalPages,
    totalNotes: total,
    pagination: {
      page,
      limit,
      total,
      totalPages,
    },
    ...pageOverrides,
  };
}

function renderDashboard() {
  return render(
    <MemoryRouter>
      <DashboardPage />
    </MemoryRouter>
  );
}

// ─── Tests ───────────────────────────────────────────────────────────────────
describe('DashboardPage', () => {
  beforeEach(() => {
    // resetAllMocks clears both call records AND mock implementations
    // preventing mock state from leaking between tests
    vi.resetAllMocks();
  });

  // ── Rendering ──────────────────────────────────────────────────────────────
  test('renders "All Notes" heading when notes are loaded', async () => {
    mockGetNotes.mockResolvedValue(makeNotesResponse([NOTE_1, NOTE_2]));
    renderDashboard();
    await screen.findByText('Note 1');
    expect(screen.getByRole('heading', { name: /all notes/i })).toBeInTheDocument();
  });

  // ── Fetches and displays notes ─────────────────────────────────────────────
  test('fetches and displays a list of notes', async () => {
    mockGetNotes.mockResolvedValue(makeNotesResponse([NOTE_1, NOTE_2]));
    renderDashboard();

    expect(await screen.findByText('Note 1')).toBeInTheDocument();
    expect(await screen.findByText('Note 2')).toBeInTheDocument();
  });

  // ── Empty state (no notes) ─────────────────────────────────────────────────
  test("shows empty state with correct text when there are no notes", async () => {
    mockGetNotes.mockResolvedValue(makeNotesResponse([]));
    renderDashboard();

    // DashboardPage renders <EmptyNotePage title="You don't have any notes yet." message="Create Your First Note">
    expect(await screen.findByText("You don't have any notes yet.")).toBeInTheDocument();
    // EmptyNotePage renders a Link with "Create Your First Note"
    expect(await screen.findByRole('link', { name: /create your first note/i })).toBeInTheDocument();
  });

  // ── Error state ────────────────────────────────────────────────────────────
  test('shows error message when the API throws', async () => {
    mockGetNotes.mockRejectedValue(new Error('Network error'));
    renderDashboard();

    expect(await screen.findByText(/network error/i)).toBeInTheDocument();
  });

  test('shows the specific error message from the API', async () => {
    mockGetNotes.mockRejectedValue(new Error('Failed to fetch notes'));
    renderDashboard();

    expect(await screen.findByText(/failed to fetch notes/i)).toBeInTheDocument();
  });

  // ── Search input ───────────────────────────────────────────────────────────
  test('renders the search input after notes load', async () => {
    mockGetNotes.mockResolvedValue(makeNotesResponse([NOTE_1]));
    renderDashboard();

    // Wait for loading to resolve
    await screen.findByText('Note 1');
    expect(screen.getByPlaceholderText(/search notes/i)).toBeInTheDocument();
  });

  test('calls getNotes again when user types in the search box', async () => {
    const user = userEvent.setup();
    mockGetNotes.mockResolvedValue(makeNotesResponse([NOTE_1]));
    renderDashboard();

    await screen.findByText('Note 1');

    const searchInput = screen.getByPlaceholderText(/search notes/i);
    await user.type(searchInput, 'Note');

    // useDebounce fires after 300ms; wait for re-fetch call
    await waitFor(
      () => expect(mockGetNotes.mock.calls.length).toBeGreaterThan(1),
      { timeout: 1500 }
    );
  });

  // ── Sorting ────────────────────────────────────────────────────────────────
  test('renders sort and limit dropdowns after notes load', async () => {
    mockGetNotes.mockResolvedValue(makeNotesResponse([NOTE_1]));
    renderDashboard();

    await screen.findByText('Note 1');
    expect(screen.getAllByRole('combobox').length).toBeGreaterThanOrEqual(2);
  });

  test('re-fetches with new sort order when user changes the sort dropdown', async () => {
    const user = userEvent.setup();
    mockGetNotes.mockResolvedValue(makeNotesResponse([NOTE_1, NOTE_2]));
    renderDashboard();

    await screen.findByText('Note 1');

    // First combobox is the sort select
    const sortSelect = screen.getAllByRole('combobox')[0];
    await user.selectOptions(sortSelect, 'title_asc');

    await waitFor(() => {
      expect(mockGetNotes).toHaveBeenCalledWith(
        expect.objectContaining({ sort: 'title_asc' })
      );
    });
  });

  // ── Pagination ─────────────────────────────────────────────────────────────
  test('renders Next and Previous buttons when there are multiple pages', async () => {
    mockGetNotes.mockResolvedValue(
      makeNotesResponse([NOTE_1, NOTE_2], { totalPages: 2 })
    );
    renderDashboard();

    expect(await screen.findByRole('button', { name: /next/i })).toBeInTheDocument();
    expect(await screen.findByRole('button', { name: /previous/i })).toBeInTheDocument();
  });

  test('Previous button is disabled when on the first page', async () => {
    mockGetNotes.mockResolvedValue(
      makeNotesResponse([NOTE_1, NOTE_2], { totalPages: 2, page: 1 })
    );
    renderDashboard();

    const prevBtn = await screen.findByRole('button', { name: /previous/i });
    expect(prevBtn).toBeDisabled();
  });

  test('clicking Next advances the page indicator to page 2', async () => {
    const user = userEvent.setup();
    // First call resolves with page 1 data; subsequent calls resolve with page 2 data
    mockGetNotes
      .mockResolvedValueOnce(
        makeNotesResponse([NOTE_1, NOTE_2], { totalPages: 2, page: 1 })
      )
      .mockResolvedValue(
        makeNotesResponse([NOTE_1, NOTE_2], { totalPages: 2, page: 2 })
      );

    renderDashboard();

    const nextBtn = await screen.findByRole('button', { name: /next/i });
    await user.click(nextBtn);

    // Pagination renders: "Page X of Y" — after clicking Next, page becomes 2
    await waitFor(() => {
      expect(screen.getByText(/page 2 of 2/i)).toBeInTheDocument();
    });
  });

  test('does not render pagination when totalPages is 1', async () => {
    mockGetNotes.mockResolvedValue(makeNotesResponse([NOTE_1], { totalPages: 1 }));
    renderDashboard();

    await screen.findByText('Note 1');
    expect(screen.queryByRole('button', { name: /next/i })).not.toBeInTheDocument();
  });

  // ── Tag filter (via URL param) ─────────────────────────────────────────────
  test('fetches notes with tag from URL search params', async () => {
    render(
      <MemoryRouter initialEntries={['/dashboard?tag=work']}>
        <DashboardPage />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(mockGetNotes).toHaveBeenCalledWith(
        expect.objectContaining({ tag: 'work' })
      );
    });
  });

  // ── Favorites toggle ───────────────────────────────────────────────────────
  test('renders the Favorites toggle button after notes load', async () => {
    mockGetNotes.mockResolvedValue(makeNotesResponse([NOTE_1]));
    renderDashboard();

    await screen.findByText('Note 1');

    // The button has title "Show favorites only" and contains the text "Favorites"
    // Match by title attribute to avoid emoji matching issues
    expect(
      screen.getByTitle(/show favorites only/i)
    ).toBeInTheDocument();
  });

  test('re-fetches with favorites=true when favorites toggle is clicked', async () => {
    const user = userEvent.setup();
    mockGetNotes.mockResolvedValue(makeNotesResponse([NOTE_1]));
    renderDashboard();

    await screen.findByText('Note 1');

    const favBtn = screen.getByTitle(/show favorites only/i);
    await user.click(favBtn);

    await waitFor(() => {
      expect(mockGetNotes).toHaveBeenCalledWith(
        expect.objectContaining({ favorites: 'true' })
      );
    });
  });
});