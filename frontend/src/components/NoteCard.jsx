import { Link } from "react-router-dom";
import { useState } from "react";
import Button from "./Button";
import Spinner from "./ui/Spinner";
import Icon from "./Icon";
import { formatRelativeDate } from "../utils/formatRelativeDate";
import {
  FilePencilOutlined,
  Trash3Outlined,
} from "@lineiconshq/free-icons";

const TAG_STYLES = {
  work: { label: "Work", color: "var(--color-accent)" },
  personal: { label: "Personal", color: "var(--color-ink-muted)" },
  idea: { label: "Idea", color: "var(--color-success)" },
  none: null,
};

function NoteCard({ note, onDelete, onToggleFavorite, deleting }) {
  const [togglingFav, setTogglingFav] = useState(false);

  const rawContent = note.content;
  let preview = "";
  if (typeof rawContent === "string") {
    preview =
      rawContent.length > 120 ? `${rawContent.slice(0, 120)}…` : rawContent;
  } else if (rawContent?.content) {
    const getText = (nodes = []) =>
      nodes
        .map((n) => (n.text ? n.text : getText(n.content || [])))
        .join(" ");
    const fullText = getText(rawContent.content);
    preview = fullText.length > 120 ? `${fullText.slice(0, 120)}…` : fullText;
  }

  const updatedDate = note.updatedAt ? formatRelativeDate(note.updatedAt) : "";
  const tagStyle = TAG_STYLES[note.tag] || null;

  async function handleFavoriteClick(e) {
    e.preventDefault();
    e.stopPropagation();
    if (!onToggleFavorite || togglingFav) return;
    setTogglingFav(true);
    try {
      await onToggleFavorite(note._id);
    } finally {
      setTogglingFav(false);
    }
  }

  function handleDeleteClick(e) {
    e.preventDefault();
    e.stopPropagation();
    onDelete(note._id);
  }

  return (
    <article
      className="group relative flex flex-col rounded-xl border transition-all hover:-translate-y-0.5"
      style={{
        backgroundColor: "var(--color-paper-3)",
        borderColor: "var(--color-border)",
        boxShadow: "var(--shadow-sm)",
      }}
    >
      <button
        type="button"
        onClick={handleFavoriteClick}
        disabled={togglingFav}
        aria-label={
          note.isFavorite ? "Remove from favorites" : "Add to favorites"
        }
        title={
          note.isFavorite ? "Remove from favorites" : "Add to favorites"
        }
        className="absolute top-3 right-3 shrink-0 rounded-full p-1.5 transition-transform hover:scale-110 focus-ring disabled:opacity-50 z-10"
        style={{ 
          backgroundColor: note.isFavorite ? "var(--color-accent-soft)" : "var(--color-paper-2)", 
          boxShadow: "var(--shadow-sm)" 
        }}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill={note.isFavorite ? "#1a1a1a" : "none"} stroke={note.isFavorite ? "#1a1a1a" : "#6b7280"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
        </svg>
      </button>

      <Link
        to={`/notes/${note._id}/edit`}
        className="flex flex-1 flex-col p-5 focus-ring rounded-xl pt-6"
      >
        <div className="mb-3 pr-8">
          <h2
            className="font-display text-lg font-semibold leading-snug line-clamp-2 min-w-0"
            style={{ color: "var(--color-ink)" }}
          >
            {note.title}
          </h2>
        </div>

        {tagStyle && (
          <span
            className="mb-3 inline-flex w-fit items-center rounded-full px-2.5 py-0.5 text-[0.6875rem] font-semibold uppercase tracking-wide"
            style={{
              color: tagStyle.color,
              backgroundColor: "var(--color-paper-2)",
            }}
          >
            {tagStyle.label}
          </span>
        )}

        {preview && (
          <p
            className="mb-4 flex-1 text-sm leading-relaxed line-clamp-3"
            style={{ color: "var(--color-ink-muted)" }}
          >
            {preview}
          </p>
        )}

        {updatedDate && (
          <time
            className="font-mono text-xs"
            style={{ color: "var(--color-ink-faint)" }}
            dateTime={note.updatedAt}
          >
            {updatedDate}
          </time>
        )}
      </Link>

      <div
        className="flex items-center gap-1 border-t px-3 py-2 opacity-0 transition-opacity group-hover:opacity-100 group-focus-within:opacity-100"
        style={{ borderColor: "var(--color-border)" }}
      >
        <Link
          to={`/notes/${note._id}/edit`}
          className="btn-ghost flex-1 text-xs"
        >
          <Icon icon={FilePencilOutlined} size={16} />
          Edit
        </Link>
        <Button
          type="button"
          variant="ghost"
          onClick={handleDeleteClick}
          disabled={deleting}
          className="flex-1 text-xs"
          style={{ color: "var(--color-danger)" }}
        >
          {deleting ? (
            <Spinner size="sm" />
          ) : (
            <>
              <Icon icon={Trash3Outlined} size={16} color="var(--color-danger)" />
              Delete
            </>
          )}
        </Button>
      </div>
    </article>
  );
}

export default NoteCard;
