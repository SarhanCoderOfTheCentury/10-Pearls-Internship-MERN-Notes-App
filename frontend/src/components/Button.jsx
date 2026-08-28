function Button({
  children,
  type = "button",
  variant = "primary",
  className = "",
  disabled = false,
  onClick,
  ...props
}) {
  const variants = {
    primary: "btn-primary",
    secondary: "btn-secondary",
    ghost: "btn-ghost",
    danger: "btn-danger",
  };

  return (
    <button
      type={type}
      className={`${variants[variant] || ""} ${className}`}
      disabled={disabled}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
}

export default Button;
