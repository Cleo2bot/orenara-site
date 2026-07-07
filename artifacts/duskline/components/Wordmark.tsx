interface WordmarkProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

export default function Wordmark({ size = "md", className = "" }: WordmarkProps) {
  const sizeClasses = {
    sm: "text-base",
    md: "text-xl",
    lg: "text-3xl",
  };

  return (
    <div className={`inline-block ${className}`}>
      <span
        className={`font-display font-medium uppercase text-bone ${sizeClasses[size]}`}
        style={{ letterSpacing: "0.14em" }}
      >
        ORENARA
      </span>
    </div>
  );
}
