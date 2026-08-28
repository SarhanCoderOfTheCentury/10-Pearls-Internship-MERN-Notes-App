import { useEffect, useState, useRef, useCallback } from "react";
import RichTextEditor from "../components/RichTextEditor";
import { useNavigate, useParams, Link } from "react-router-dom";
import { createNote, getNote, updateNote } from "../services/note.service";
import useToast from "../hooks/useToast";
import useUnsavedChanges from "../hooks/useUnsavedChanges";
import ConfirmDialog from "../components/ui/ConfirmDialog";
import ErrorState from "../components/ui/ErrorState";
import Button from "../components/Button";
import Icon from "../components/Icon";
import Spinner from "../components/ui/Spinner";
import { ArrowLeftOutlined, PlusSolid } from "@lineiconshq/free-icons";

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
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const initialDataRef = useRef({ title: "", content: emptyContent, tag: "none" });
  const [showDiscardDialog, setShowDiscardDialog] = useState(false);

  const isDirty =
    title !== initialDataRef.current.title ||
    tag !== initialDataRef.current.tag ||
    JSON.stringify({ title, content, tag }) !==
      JSON.stringify(initialDataRef.current);

  useUnsavedChanges(isDirty);

  const loadNote = useCallback(async () => {
    if (!isEditing) {
      initialDataRef.current = { title: "", content: emptyContent, tag: "none" };
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

        setTitle(loadedTitle);
        setContent(loadedContent);
        setTag(loadedTag);
        initialDataRef.current = {
          title: loadedTitle,
          content: loadedContent,
          tag: loadedTag,
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
        initialDataRef.current = { title: title.trim(), content, tag };
        if (toast) toast("Note updated successfully", "success");
      } else {
        await createNote(notePayload);
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
