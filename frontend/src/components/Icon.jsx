import { Lineicons } from "@lineiconshq/react-lineicons";

function Icon({ icon, size = 20, color = "currentColor", strokeWidth = 1.75, className = "" }) {
  if (!icon) return null;
  return (
    <Lineicons
      icon={icon}
      size={size}
      color={color}
      strokeWidth={strokeWidth}
      className={className}
    />
  );
}

export default Icon;
