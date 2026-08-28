import { createPortal } from "react-dom";
import Button from "../Button";

function ConfirmDialog({
  isOpen,
  open,
  onClose,
  onCancel,
  onConfirm,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
}) {
  const show = isOpen !== undefined ? isOpen : open;
  const handleClose = onClose || onCancel;

  if (!show) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: "oklch(0.28 0.025 255 / 0.4)" }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="dialog-title"
    >
      <div
        className="w-full max-w-sm rounded-2xl border p-6"
        style={{
          backgroundColor: "var(--color-paper-3)",
          borderColor: "var(--color-border)",
          boxShadow: "var(--shadow-lg)",
        }}
      >
        <h2
          id="dialog-title"
          className="font-display text-xl font-semibold mb-2"
          style={{ color: "var(--color-ink)" }}
        >
          {title}
        </h2>
        <p className="text-sm leading-relaxed mb-6" style={{ color: "var(--color-ink-muted)" }}>
          {message}
        </p>
        <div className="flex justify-end gap-3">
          <Button variant="secondary" onClick={handleClose}>
            {cancelText}
          </Button>
          <Button variant="danger" onClick={onConfirm}>
            {confirmText}
          </Button>
        </div>
      </div>
    </div>,
    document.body
  );
}

export default ConfirmDialog;
