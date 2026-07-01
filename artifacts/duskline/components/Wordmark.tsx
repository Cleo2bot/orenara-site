interface WordmarkProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

export default function Wordmark({ size = "md", className = "" }: WordmarkProps) {
  const sizeClasses = {
    sm: "text-xl tracking-tight",
    md: "text-2xl tracking-tight",
    lg: "text-4xl tracking-tight",
  };

  return (
    <div className={`inline-block wordmark-line ${className}`}>
      <span
        className={`font-black ${sizeClasses[size]}`}
        style={{ color: "#F4F1EA", letterSpacing: "-0.04em" }}
      >
        duskline
      </span>
    </div>
  );
}
