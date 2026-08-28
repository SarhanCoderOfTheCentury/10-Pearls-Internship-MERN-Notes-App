import { Navbar } from "./Navbar";
import { Sidebar } from "./Sidebar";
import { Outlet } from "react-router-dom";
import { LayoutProvider, useLayout } from "../context/LayoutContext";

function AppLayoutShell() {
  const { sidebarOpen, closeSidebar } = useLayout();

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-paper">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <button
          type="button"
          className="fixed inset-0 z-30 bg-ink/30 backdrop-blur-[2px] lg:hidden"
          onClick={closeSidebar}
          aria-label="Close sidebar"
        />
      )}

      <Sidebar />

      <div className="flex flex-1 flex-col min-w-0 overflow-hidden">
        <Navbar />
        <main className="page-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

const AppLayout = () => (
  <LayoutProvider>
    <AppLayoutShell />
  </LayoutProvider>
);

export default AppLayout;
