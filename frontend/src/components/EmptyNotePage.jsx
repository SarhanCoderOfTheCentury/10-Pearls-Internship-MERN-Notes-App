import { Link } from "react-router-dom";
import Icon from "./Icon";
import { PlusOutlined, Notebook1Outlined } from "@lineiconshq/free-icons";

function EmptyNotePage({
  title = "No notes yet",
  message = "Create your first note to get started",
  showCta = true,
}) {
  return (
    <section className="flex flex-col items-center justify-center gap-5 px-6 py-20 text-center">
      <div
        className="flex h-16 w-16 items-center justify-center rounded-2xl"
        style={{ backgroundColor: "var(--color-accent-soft)" }}
      >
        <Icon icon={Notebook1Outlined} size={32} color="var(--color-accent)" />
      </div>
      <div className="max-w-sm">
        <h2
          className="font-display text-2xl font-semibold mb-2"
          style={{ color: "var(--color-ink)" }}
        >
          {title}
        </h2>
        <p className="text-sm leading-relaxed" style={{ color: "var(--color-ink-muted)" }}>
          {message}
        </p>
      </div>
      {showCta && (
        <Link to="/notes/new" className="btn-primary">
          <Icon icon={PlusOutlined} size={18} color="var(--color-paper-3)" />
          Create Your First Note
        </Link>
      )}
    </section>
  );
}

export default EmptyNotePage;
