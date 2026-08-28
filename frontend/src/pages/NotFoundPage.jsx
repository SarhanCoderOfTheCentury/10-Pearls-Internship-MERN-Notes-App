import { Link } from "react-router-dom";
import Icon from "../components/Icon";
import { Home2Outlined } from "@lineiconshq/free-icons";

const NotFoundPage = () => {
  return (
    <div
      className="flex min-h-screen flex-col items-center justify-center px-6 text-center"
      style={{ backgroundColor: "var(--color-paper)" }}
    >
      <p
        className="font-display text-8xl font-semibold tracking-tighter"
        style={{ color: "var(--color-accent)" }}
      >
        404
      </p>
      <h1
        className="font-display mt-2 text-2xl font-semibold"
        style={{ color: "var(--color-ink)" }}
      >
        Page not found
      </h1>
      <p className="mt-3 max-w-sm text-sm leading-relaxed" style={{ color: "var(--color-ink-muted)" }}>
        The page you are looking for does not exist or has been moved.
      </p>
      <Link to="/dashboard" className="btn-primary mt-8">
        <Icon icon={Home2Outlined} size={18} color="var(--color-paper-3)" />
        Back to notes
      </Link>
    </div>
  );
};

export default NotFoundPage;
