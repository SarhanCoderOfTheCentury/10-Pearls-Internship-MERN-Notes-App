function Spinner({ size = "md" }) {
  const sizes = {
    sm: "w-4 h-4",
    md: "w-6 h-6",
    lg: "w-8 h-8",
  };

  return (
    <div className="flex items-center justify-center" role="status" aria-label="Loading">
      <div
        className={`animate-spin rounded-full border-2 border-t-transparent ${sizes[size] || sizes.md}`}
        style={{ borderColor: "var(--color-border)", borderTopColor: "var(--color-accent)" }}
      />
    </div>
  );
}

export default Spinner;
