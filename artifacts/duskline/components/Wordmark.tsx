interface WordmarkProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizeClasses = {
  sm: "wordmark-nav",
  md: "wordmark-md",
  lg: "wordmark-lg",
};

export default function Wordmark({ size = "md", className = "" }: WordmarkProps) {
  return (
    <span className={`wordmark ${sizeClasses[size]} ${className}`}>ORENARA</span>
  );
}
