import { createContext, useContext, useState } from "react";

export const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [showToast, setShowToast] = useState(null);

  function toast(message, type = "success") {
    setShowToast({ message, type });
    setTimeout(() => setShowToast(null), 3000);
  }

  toast.success = (message) => toast(message, "success");
  toast.error = (message) => toast(message, "error");
  toast.warning = (message) => toast(message, "warning");
  toast.info = (message) => toast(message, "info");

  const toastStyles = {
    success: {
      backgroundColor: "var(--color-success)",
      color: "white",
    },
    error: {
      backgroundColor: "var(--color-danger)",
      color: "white",
    },
    warning: {
      backgroundColor: "var(--color-accent)",
      color: "white",
    },
    info: {
      backgroundColor: "var(--color-ink)",
      color: "white",
    },
  };

  return (
    <ToastContext.Provider value={{ toast, showToast }}>
      {children}

      {showToast && (
        <div
          className="fixed bottom-5 right-5 z-50 flex max-w-sm items-center gap-2 rounded-xl px-4 py-3 text-sm font-medium shadow-lg"
          style={toastStyles[showToast.type] || toastStyles.success}
          role="status"
        >
          <p>{showToast.message}</p>
        </div>
      )}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}
