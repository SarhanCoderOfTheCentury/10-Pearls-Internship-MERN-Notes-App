import { NavLink, Link, useLocation } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { useLayout } from "../context/LayoutContext";
import Icon from "./Icon";
import Button from "./Button";
import {
  Notebook1Outlined,
  PlusOutlined,
  Briefcase1Outlined,
  Briefcase1Solid,
  User4Outlined,
  User4Solid,
  Bulb2Outlined,
  Bulb2Solid,
  ExitOutlined,
  FileMultipleOutlined,
  FileMultipleSolid,
} from "@lineiconshq/free-icons";

function StarIcon({ size = 20, filled = false, color = "currentColor" }) {
  const actualColor = filled ? color : "#6b7280";
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill={filled ? actualColor : "none"} stroke={actualColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
    </svg>
  );
}

const MAIN_NAV = [
  {
    to: "/dashboard",
    label: "All Notes",
    icon: FileMultipleOutlined,
    activeIcon: FileMultipleSolid,
    match: (pathname, params) =>
      pathname === "/dashboard" && !params.get("favorites") && !params.get("tag"),
  },
  {
    to: "/dashboard?favorites=true",
    label: "Favorites",
    renderIcon: (isActive) => (
      <StarIcon size={20} filled={isActive} color={isActive ? "var(--color-accent)" : "currentColor"} />
    ),
    match: (_, params) => params.get("favorites") === "true",
  },
];

const TAG_NAV = [
  {
    to: "/dashboard?tag=work",
    label: "Work",
    icon: Briefcase1Outlined,
    activeIcon: Briefcase1Solid,
    match: (_, params) => params.get("tag") === "work",
  },
  {
    to: "/dashboard?tag=personal",
    label: "Personal",
    icon: User4Outlined,
    activeIcon: User4Solid,
    match: (_, params) => params.get("tag") === "personal",
  },
  {
    to: "/dashboard?tag=idea",
    label: "Ideas",
    icon: Bulb2Outlined,
    activeIcon: Bulb2Solid,
    match: (_, params) => params.get("tag") === "idea",
  },
];

function NavItem({ to, label, icon, activeIcon, renderIcon, match, onNavigate }) {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const isActive = match
    ? match(location.pathname, params)
    : location.pathname === to;

  const currentIcon = isActive ? (activeIcon || icon) : icon;

  return (
    <Link
      to={to}
      onClick={onNavigate}
      className={`group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all focus-ring ${
        isActive
          ? "text-accent"
          : "text-ink-muted hover:text-ink hover:bg-paper-2"
      }`}
      style={
        isActive ? { backgroundColor: "var(--color-accent-soft)" } : undefined
      }
      aria-current={isActive ? "page" : undefined}
    >
      {renderIcon ? (
        renderIcon(isActive)
      ) : (
        <Icon
          icon={currentIcon}
          size={20}
          color={isActive ? "var(--color-accent)" : "currentColor"}
        />
      )}
      <span className="min-w-0 truncate">{label}</span>
    </Link>
  );
}

export const Sidebar = () => {
  const { logoutUser } = useAuth();
  const { sidebarOpen, closeSidebar } = useLayout();
  const location = useLocation();

  async function handleLogout() {
    try {
      await logoutUser();
    } catch (err) {
      console.error("Error logging out", err);
    }
  }

  const isProfileActive = location.pathname === "/profile";

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-40 flex w-[var(--sidebar-width)] flex-col border-r transition-transform duration-200 lg:static lg:translate-x-0 ${
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      }`}
      style={{
        backgroundColor: "var(--color-paper-3)",
        borderColor: "var(--color-border)",
      }}
    >
      <div
        className="flex h-[var(--header-height)] shrink-0 items-center border-b px-5"
        style={{ borderColor: "var(--color-border)" }}
      >
        <Link
          to="/dashboard"
          onClick={closeSidebar}
          className="flex items-center"
        >
          <img src="/logo.png" alt="Notely Logo" className="h-13 w-auto object-contain" />
        </Link>
      </div>

      <div className="p-4">
        <Link to="/notes/new" onClick={closeSidebar} className="block">
          <Button variant="primary" className="w-full">
            <Icon icon={PlusOutlined} size={18} />
            New Note
          </Button>
        </Link>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 pb-4">
        <p
          className="mb-2 px-3 text-[0.6875rem] font-semibold uppercase tracking-widest"
          style={{ color: "var(--color-ink-faint)" }}
        >
          Library
        </p>
        <div className="mb-5 flex flex-col gap-0.5">
          {MAIN_NAV.map((item) => (
            <NavItem key={item.to} {...item} onNavigate={closeSidebar} />
          ))}
        </div>

        <p
          className="mb-2 px-3 text-[0.6875rem] font-semibold uppercase tracking-widest"
          style={{ color: "var(--color-ink-faint)" }}
        >
          Tags
        </p>
        <div className="mb-5 flex flex-col gap-0.5">
          {TAG_NAV.map((item) => (
            <NavItem key={item.to} {...item} onNavigate={closeSidebar} />
          ))}
        </div>

        <p
          className="mb-2 px-3 text-[0.6875rem] font-semibold uppercase tracking-widest"
          style={{ color: "var(--color-ink-faint)" }}
        >
          Account
        </p>
        <div className="flex flex-col gap-0.5">
          <Link
            to="/profile"
            onClick={closeSidebar}
            className={`group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all focus-ring ${
              isProfileActive
                ? "text-accent"
                : "text-ink-muted hover:text-ink hover:bg-paper-2"
            }`}
            style={
              isProfileActive
                ? { backgroundColor: "var(--color-accent-soft)" }
                : undefined
            }
            aria-current={isProfileActive ? "page" : undefined}
          >
            <Icon
              icon={isProfileActive ? User4Solid : User4Outlined}
              size={20}
              color={isProfileActive ? "var(--color-accent)" : "currentColor"}
            />
            <span>Profile</span>
          </Link>
          <button
            type="button"
            onClick={handleLogout}
            className="group flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors focus-ring text-ink-muted hover:text-ink hover:bg-paper-2"
          >
            <Icon icon={ExitOutlined} size={20} />
            <span>Sign out</span>
          </button>
        </div>
      </nav>
    </aside>
  );
};
