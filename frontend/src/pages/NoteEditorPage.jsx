import { useEffect, useState, useRef, useCallback } from "react";
import RichTextEditor from "../components/RichTextEditor";
import { useNavigate, useParams, Link } from "react-router-dom";
import { createNote, getNote, updateNote, toggleFavorite } from "../services/note.service";
import useToast from "../hooks/useToast";
import useUnsavedChanges from "../hooks/useUnsavedChanges";
import ConfirmDialog from "../components/ui/ConfirmDialog";
import ErrorState from "../components/ui/ErrorState";
import Button from "../components/Button";
import Icon from "../components/Icon";
import Spinner from "../components/ui/Spinner";
import { ArrowLeftOutlined, PlusSolid, PlusOutlined } from "@lineiconshq/free-icons";

const emptyContent = {
  type: "doc",
  content: [{ type: "paragraph" }],
};

const TAG_OPTIONS = [
  { value: "none", label: "No tag" },
  { value: "work", label: "Work" },
  { value: "personal", label: "Personal" },
  { value: "idea", label: "Idea" },
];

function NoteEditorPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = Boolean(id);
  const { toast } = useToast();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState(emptyContent);
  const [tag, setTag] = useState("none");
  const [isFavorite, setIsFavorite] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const initialDataRef = useRef({ title: "", content: emptyContent, tag: "none", isFavorite: false });
  const [showDiscardDialog, setShowDiscardDialog] = useState(false);

  const isDirty =
    title !== initialDataRef.current.title ||
    tag !== initialDataRef.current.tag ||
    isFavorite !== initialDataRef.current.isFavorite ||
    JSON.stringify({ title, content, tag }) !==
      JSON.stringify({ title: initialDataRef.current.title, content: initialDataRef.current.content, tag: initialDataRef.current.tag });

  useUnsavedChanges(isDirty);

  const loadNote = useCallback(async () => {
    if (!isEditing) {
      initialDataRef.current = { title: "", content: emptyContent, tag: "none", isFavorite: false };
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await getNote(id);
      const noteData = response?.data || response;
      if (noteData) {
        const loadedTitle = noteData.title || "";
        const loadedContent = noteData.content || emptyContent;
        const loadedTag = noteData.tag || "none";
        const loadedFavorite = noteData.isFavorite || false;

        setTitle(loadedTitle);
        setContent(loadedContent);
        setTag(loadedTag);
        setIsFavorite(loadedFavorite);
        initialDataRef.current = {
          title: loadedTitle,
          content: loadedContent,
          tag: loadedTag,
          isFavorite: loadedFavorite,
        };
      }
    } catch (err) {
      const errMsg = err.message || "Failed to load note";
      setError(errMsg);
      if (toast) toast(errMsg, "error");
    } finally {
      setLoading(false);
    }
  }, [id, isEditing, toast]);

  useEffect(() => {
    loadNote();
  }, [loadNote]);

  function handleCancel() {
    if (isDirty) {
      setShowDiscardDialog(true);
    } else {
      navigate("/dashboard");
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!title.trim()) {
      setError("Please enter a title");
      if (toast) toast("Please enter a title", "error");
      return;
    }

    setSaving(true);
    setError("");
    const notePayload = { title: title.trim(), content, tag };

    try {
      if (isEditing) {
        await updateNote(id, notePayload);
        initialDataRef.current = { title: title.trim(), content, tag, isFavorite };
        if (toast) toast("Note updated successfully", "success");
      } else {
        const response = await createNote(notePayload);
        const newNoteId = response?.data?._id || response?._id;
        if (newNoteId && isFavorite) {
          try {
            await toggleFavorite(newNoteId);
          } catch (e) {
            console.error("Failed to favorite new note");
          }
        }
        if (toast) toast("Note created successfully", "success");
      }
      navigate("/dashboard");
    } catch (err) {
      const errMsg = err.message || "Failed to save note";
      setError(errMsg);
      if (toast) toast(errMsg, "error");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Spinner size="lg" />
      </div>
    );
  }

  if (isEditing && error && !title) {
    return (
      <div className="page-inner">
        <ErrorState
          title="Could not load note"
          message={error}
          onRetry={loadNote}
          retryText="Try Again"
        />
      </div>
    );
  }

  return (
    <div className="page-inner max-w-3xl">
      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        {/* Editor toolbar */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <Link
            to="/dashboard"
            className="btn-ghost self-start -ml-2"
            onClick={(e) => {
              if (isDirty) {
                e.preventDefault();
                setShowDiscardDialog(true);
              }
            }}
          >
            <Icon icon={ArrowLeftOutlined} size={18} />
            Back to notes
          </Link>

          <div className="flex items-center gap-2">
            <Button type="button" variant="secondary" onClick={handleCancel}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" disabled={saving}>
              {!isEditing && !saving && (
                <Icon icon={PlusOutlined} size={18} color="var(--color-paper-3)" />
              )}
              {saving ? "Saving…" : isEditing ? "Save changes" : "Create note"}
            </Button>
          </div>
        </div>

        {error && title && (
          <div
            className="rounded-lg border px-4 py-3 text-sm"
            style={{
              backgroundColor: "var(--color-danger-soft)",
              borderColor: "var(--color-danger)",
              color: "var(--color-danger)",
            }}
          >
            {error}
          </div>
        )}

        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Note title"
          className="w-full border-0 bg-transparent font-display text-3xl font-semibold tracking-tight focus:outline-none focus-ring rounded-lg px-0 py-1"
          style={{ color: "var(--color-ink)" }}
          required
        />

        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3">
            <label
              htmlFor="note-tag"
              className="text-sm font-medium shrink-0"
              style={{ color: "var(--color-ink-muted)" }}
            >
              Tag
            </label>
            <select
              id="note-tag"
              value={tag}
              onChange={(e) => setTag(e.target.value)}
              className="select-field w-auto min-w-[140px]"
            >
              {TAG_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          <button
            type="button"
            onClick={async () => {
              if (isEditing) {
                try {
                  await toggleFavorite(id);
                  setIsFavorite(!isFavorite);
                  initialDataRef.current.isFavorite = !isFavorite;
                  if (toast) toast(isFavorite ? "Removed from favorites" : "Added to favorites", "success");
                } catch (err) {
                  if (toast) toast("Failed to update favorite", "error");
                }
              } else {
                setIsFavorite(!isFavorite);
              }
            }}
            className="flex items-center gap-2 text-sm font-medium focus-ring rounded-md p-1 transition-colors hover:bg-paper-2"
            style={{ color: isFavorite ? "var(--color-accent)" : "var(--color-ink-muted)" }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill={isFavorite ? "#1a1a1a" : "none"} stroke={isFavorite ? "#1a1a1a" : "#6b7280"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
            </svg>
            {isFavorite ? "Favorited" : "Add to favorites"}
          </button>
        </div>

        <RichTextEditor value={content} onChange={setContent} />
      </form>

      <ConfirmDialog
        open={showDiscardDialog}
        title="Discard changes?"
        message="Your unsaved changes will be lost. Are you sure you want to exit?"
        confirmText="Discard changes"
        cancelText="Keep editing"
        onCancel={() => setShowDiscardDialog(false)}
        onConfirm={() => navigate("/dashboard")}
      />
    </div>
  );
}

export default NoteEditorPage;
