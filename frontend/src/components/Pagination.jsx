import Icon from "./Icon";
import { ArrowLeftOutlined, ArrowRightOutlined } from "@lineiconshq/free-icons";

function Pagination({ page, totalPages, onPageChange }) {
  if (totalPages <= 1) {
    return null;
  }

  return (
    <nav
      className="flex items-center justify-between gap-4 rounded-xl border px-4 py-3"
      style={{
        borderColor: "var(--color-border)",
        backgroundColor: "var(--color-paper-3)",
      }}
      aria-label="Pagination"
    >
      <button
        type="button"
        disabled={page === 1}
        onClick={() => onPageChange(page - 1)}
        className="btn-secondary text-sm py-2"
      >
        <Icon icon={ArrowLeftOutlined} size={16} />
        Previous
      </button>

      <span
        className="font-mono text-sm tabular-nums"
        style={{ color: "var(--color-ink-muted)" }}
      >
        Page {page} of {totalPages}
      </span>

      <button
        type="button"
        disabled={page === totalPages}
        onClick={() => onPageChange(page + 1)}
        className="btn-secondary text-sm py-2"
      >
        Next
        <Icon icon={ArrowRightOutlined} size={16} />
      </button>
    </nav>
  );
}

export default Pagination;
