import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { useLayout } from "../context/LayoutContext";
import Icon from "./Icon";
import { MenuHamburger1Outlined } from "@lineiconshq/free-icons";
import { Notebook1Outlined } from "@lineiconshq/free-icons";

export const Navbar = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toggleSidebar } = useLayout();

  const initials = user?.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "?";

  return (
    <header
      className="flex h-14 shrink-0 items-center justify-between gap-4 border-b px-4 sm:px-6"
      style={{
        borderColor: "var(--color-border)",
        backgroundColor: "var(--color-paper-3)",
        height: "var(--header-height)",
      }}
    >
      <div className="flex items-center gap-3 min-w-0">
        <button
          type="button"
          onClick={toggleSidebar}
          className="btn-ghost p-2 lg:hidden"
          aria-label="Open menu"
        >
          <Icon icon={MenuHamburger1Outlined} size={22} />
        </button>

        <Link
          to="/dashboard"
          className="flex items-center gap-2 font-display text-lg font-semibold tracking-tight lg:hidden"
          style={{ color: "var(--color-ink)" }}
        >
        <img src="/logo.png" alt="Notely Logo" className="h-12 w-auto object-contain" />
        </Link>
      </div>

      <div className="flex items-center gap-2 sm:gap-4">
        <button
          type="button"
          onClick={() => navigate("/profile")}
          className="flex items-center gap-2.5 rounded-lg px-2 py-1.5 transition-colors hover:bg-paper-2 focus-ring"
          aria-label="Open profile"
        >
          <span
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-semibold"
            style={{
              backgroundColor: "var(--color-accent-soft)",
              color: "var(--color-accent)",
            }}
          >
            {initials}
          </span>
          <span
            className="hidden text-sm font-medium sm:block max-w-[120px] truncate"
            style={{ color: "var(--color-ink)" }}
          >
            {user?.name}
          </span>
        </button>
      </div>
    </header>
  );
};
