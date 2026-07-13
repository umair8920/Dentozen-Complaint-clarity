import logo from "../assets/logo_1.svg";

export function Logo({
  className = "",
  compact = false,
}: {
  className?: string;
  compact?: boolean;
}) {
  return (
    <img
      src={logo}
      alt="Compliant Clarity"
      className={`${compact ? "h-8 w-auto" : "h-10 w-auto"} ${className}`}
      draggable={false}
    />
  );
}
