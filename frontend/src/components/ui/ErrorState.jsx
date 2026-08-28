import Button from "../Button";
import Icon from "../Icon";
import { RefreshCircle1ClockwiseOutlined } from "@lineiconshq/free-icons";

function ErrorState({
  title = "Something went wrong",
  message = "An unexpected error occurred. Please try again.",
  onRetry,
  retryText = "Try Again",
  className = "",
}) {
  return (
    <section
      className={`flex flex-col items-center justify-center min-h-[50vh] p-6 text-center gap-4 ${className}`}
    >
      <div
        className="flex h-16 w-16 items-center justify-center rounded-2xl"
        style={{ backgroundColor: "var(--color-danger-soft)" }}
      >
        <span className="text-2xl font-semibold" style={{ color: "var(--color-danger)" }}>
          !
        </span>
      </div>

      <h2
        className="font-display text-2xl font-semibold tracking-tight"
        style={{ color: "var(--color-ink)" }}
      >
        {title}
      </h2>
      <p
        className="max-w-md text-sm leading-relaxed"
        style={{ color: "var(--color-ink-muted)" }}
      >
        {message}
      </p>

      {onRetry && (
        <Button variant="primary" onClick={onRetry} className="mt-2">
          <Icon icon={RefreshCircle1ClockwiseOutlined} size={16} color="var(--color-paper-3)" />
          {retryText}
        </Button>
      )}
    </section>
  );
}

export default ErrorState;
