import { getNotes, deleteNote, toggleFavorite } from "../services/note.service";
import { useState, useEffect, useCallback } from "react";
import { Link, useSearchParams } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import useToast from "../hooks/useToast";
import NoteCard from "../components/NoteCard";
import EmptyNotePage from "../components/EmptyNotePage";
import ConfirmDialog from "../components/ui/ConfirmDialog";
import ErrorState from "../components/ui/ErrorState";
import Spinner from "../components/ui/Spinner";
import useDebounce from "../hooks/useDebounce";
import Pagination from "../components/Pagination";
import Icon from "../components/Icon";
import Button from "../components/Button";
import {
  Search1Outlined,
  StarFatOutlined,
  StarFatSolid,
  PlusSolid,
} from "@lineiconshq/free-icons";

const PAGE_TITLES = {
  all: "All Notes",
  favorites: "Favorites",
  work: "Work",
  personal: "Personal",
  idea: "Ideas",
};

function DashboardPage() {
  const [searchParams] = useSearchParams();
  const tagParam = searchParams.get("tag") || "all";
  const favoritesParam = searchParams.get("favorites") === "true";

  const [notes, setNotes] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("updatedAt_desc");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(12);
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(favoritesParam);
  const [tag, setTag] = useState(tagParam);

  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    total: 0,
    totalPages: 0,
  });

  const { user } = useAuth();
  const { toast } = useToast();
  const debouncedSearch = useDebounce(search, 300);

  // Sync URL params to state
  useEffect(() => {
    setShowFavoritesOnly(favoritesParam);
    setTag(tagParam);
    setPage(1);
  }, [favoritesParam, tagParam]);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, sort, limit, tag, showFavoritesOnly]);

  const pageTitle = showFavoritesOnly
    ? PAGE_TITLES.favorites
    : tag !== "all"
      ? PAGE_TITLES[tag] || "Notes"
      : PAGE_TITLES.all;

  const fetchNotes = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const notesData = await getNotes({
        search: debouncedSearch,
        limit,
        page,
        sort,
        tag,
        favorites: String(showFavoritesOnly),
      });
      const notesList = Array.isArray(notesData?.notes) ? notesData.notes : [];
      setNotes(notesList);
      setPagination({
        page: notesData?.page || 1,
        limit: notesData?.limit || 12,
        total: notesData?.totalNotes || 0,
        totalPages: notesData?.totalPages || 0,
      });
    } catch (err) {
      console.error("Error fetching notes", err);
      const errMsg = err?.message || "Failed to fetch notes";
      setError(errMsg);
      if (toast) toast(errMsg, "error");
    } finally {
      setLoading(false);
    }
  }, [toast, page, limit, sort, debouncedSearch, tag, showFavoritesOnly]);

  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  function handleDelete(noteId) {
    setIsConfirmDeleteOpen(true);
    setDeletingId(noteId);
  }

  async function handleConfirmDelete() {
    try {
      await deleteNote(deletingId);
      setNotes((prevNotes) => prevNotes.filter((n) => n._id !== deletingId));
      if (toast) toast("Note deleted successfully", "success");
    } catch (err) {
      if (toast) toast(err.message || "Failed to delete note", "error");
    } finally {
      setDeletingId(null);
      setIsConfirmDeleteOpen(false);
    }
  }

  async function handleToggleFavorite(noteId) {
    setNotes((prev) =>
      prev.map((n) =>
        n._id === noteId ? { ...n, isFavorite: !n.isFavorite } : n
      )
    );

    try {
      const updatedNote = await toggleFavorite(noteId);
      setNotes((prev) =>
        prev.map((n) =>
          n._id === noteId ? { ...n, isFavorite: updatedNote.isFavorite } : n
        )
      );
      if (toast) {
        toast(
          updatedNote.isFavorite ? "Added to favorites" : "Removed from favorites",
          "success"
        );
      }
      if (showFavoritesOnly && !updatedNote.isFavorite) {
        setNotes((prev) => prev.filter((n) => n._id !== noteId));
      }
    } catch (err) {
      setNotes((prev) =>
        prev.map((n) =>
          n._id === noteId ? { ...n, isFavorite: !n.isFavorite } : n
        )
      );
      if (toast) toast(err.message || "Failed to update favorite", "error");
    }
  }

  function handleFavoritesToggle() {
    setShowFavoritesOnly((prev) => !prev);
  }

  if (error) {
    return (
      <div className="page-inner">
        <ErrorState
          title="Failed to Load Notes"
          message={typeof error === "string" ? error : error?.message}
          onRetry={fetchNotes}
          retryText="Retry Loading"
        />
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center min-h-[50vh]">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!loading && !error && notes.length === 0) {
    if (debouncedSearch) {
      return (
        <div className="page-inner">
          <PageHeader
            title={pageTitle}
            userName={user?.name}
            search={search}
            onSearchChange={(e) => setSearch(e.target.value)}
            sort={sort}
            onSortChange={(e) => setSort(e.target.value)}
            limit={limit}
            onLimitChange={(e) => setLimit(Number(e.target.value))}
            showFavoritesOnly={showFavoritesOnly}
            onFavoritesToggle={handleFavoritesToggle}
            total={0}
          />
          <EmptyNotePage
            title="No notes found"
            message="Try a different search term"
            showCta={false}
          />
        </div>
      );
    }
    if (showFavoritesOnly) {
      return (
        <div className="page-inner">
          <PageHeader
            title={pageTitle}
            userName={user?.name}
            search={search}
            onSearchChange={(e) => setSearch(e.target.value)}
            sort={sort}
            onSortChange={(e) => setSort(e.target.value)}
            limit={limit}
            onLimitChange={(e) => setLimit(Number(e.target.value))}
            showFavoritesOnly={showFavoritesOnly}
            onFavoritesToggle={handleFavoritesToggle}
            total={0}
          />
          <EmptyNotePage
            title="No favorites yet"
            message="Star a note to add it to your favorites"
            showCta={false}
          />
        </div>
      );
    }
    return (
      <div className="page-inner">
        <EmptyNotePage
          title="You don't have any notes yet."
          message="Create Your First Note"
        />
      </div>
    );
  }

  return (
    <>
      <ConfirmDialog
        open={isConfirmDeleteOpen}
        title="Delete this note?"
        message="This action cannot be undone. The note will be permanently removed."
        confirmText="Delete"
        onConfirm={handleConfirmDelete}
        onCancel={() => {
          setDeletingId(null);
          setIsConfirmDeleteOpen(false);
        }}
      />

      <div className="page-inner">
        <PageHeader
          title={pageTitle}
          userName={user?.name}
          search={search}
          onSearchChange={(e) => setSearch(e.target.value)}
          sort={sort}
          onSortChange={(e) => setSort(e.target.value)}
          limit={limit}
          onLimitChange={(e) => setLimit(Number(e.target.value))}
          showFavoritesOnly={showFavoritesOnly}
          onFavoritesToggle={handleFavoritesToggle}
          total={pagination.total}
        />

        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {notes.map((note) => (
            <NoteCard
              key={note._id}
              note={note}
              onDelete={handleDelete}
              onToggleFavorite={handleToggleFavorite}
              deleting={note._id === deletingId}
            />
          ))}
        </div>

        <div className="mt-8">
          <Pagination
            page={pagination?.page || 1}
            totalPages={pagination?.totalPages || 1}
            onPageChange={setPage}
          />
        </div>
      </div>
    </>
  );
}

function PageHeader({
  title,
  userName,
  search,
  onSearchChange,
  sort,
  onSortChange,
  limit,
  onLimitChange,
  showFavoritesOnly,
  onFavoritesToggle,
  total,
}) {
  return (
    <header className="space-y-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0">
          <h1
            className="font-display text-3xl font-semibold tracking-tight sm:text-4xl"
            style={{ color: "var(--color-ink)" }}
          >
            {title}
          </h1>
          {userName && (
            <p className="mt-1 text-sm" style={{ color: "var(--color-ink-muted)" }}>
              Welcome back, {userName}
            </p>
          )}
        </div>
        <Link to="/notes/new" className="btn-primary shrink-0 self-start sm:self-auto">
          <Icon icon={PlusSolid} size={18} color="var(--color-paper-3)" />
          New Note
        </Link>
      </div>

      <div
        className="flex flex-col gap-3 rounded-xl border p-4 sm:flex-row sm:flex-wrap sm:items-center"
        style={{
          borderColor: "var(--color-border)",
          backgroundColor: "var(--color-paper-3)",
        }}
      >
        <div className="relative flex-1 min-w-[200px]">
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2">
            <Icon icon={Search1Outlined} size={18} color="var(--color-ink-faint)" />
          </span>
          <input
            type="search"
            placeholder="Search notes…"
            value={search}
            onChange={onSearchChange}
            className="input-field pl-10"
          />
        </div>

        <select value={sort} onChange={onSortChange} className="select-field w-full sm:w-auto sm:min-w-[160px]">
          <option value="updatedAt_desc">Recently updated</option>
          <option value="createdAt_desc">Newest</option>
          <option value="createdAt_asc">Oldest</option>
          <option value="title_asc">Title A–Z</option>
          <option value="title_desc">Title Z–A</option>
        </select>

        <select value={limit} onChange={onLimitChange} className="select-field w-full sm:w-auto sm:min-w-[100px]" aria-label="Notes per page">
          <option value="6">6 per page</option>
          <option value="12">12 per page</option>
          <option value="24">24 per page</option>
          <option value="48">48 per page</option>
        </select>

        <button
          type="button"
          onClick={onFavoritesToggle}
          aria-pressed={showFavoritesOnly}
          title={showFavoritesOnly ? "Show all notes" : "Show favorites only"}
          className={`inline-flex items-center gap-2 rounded-lg border px-3.5 py-2.5 text-sm font-medium transition-all focus-ring ${
            showFavoritesOnly ? "" : "hover:bg-paper-2"
          }`}
          style={
            showFavoritesOnly
              ? {
                  backgroundColor: "var(--color-accent-soft)",
                  borderColor: "var(--color-accent)",
                  color: "var(--color-accent)",
                }
              : {
                  backgroundColor: "var(--color-paper-3)",
                  borderColor: "var(--color-border)",
                  color: "var(--color-ink-muted)",
                }
          }
        >
          <Icon
            icon={showFavoritesOnly ? StarFatSolid : StarFatOutlined}
            size={18}
            color={showFavoritesOnly ? "var(--color-accent)" : "currentColor"}
          />
          Favorites
        </button>
      </div>

      {total !== undefined && (
        <p className="font-mono text-xs" style={{ color: "var(--color-ink-faint)" }}>
          {total} {total === 1 ? "note" : "notes"} found
        </p>
      )}
    </header>
  );
}

export default DashboardPage;
