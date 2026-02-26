interface LoadingSpinnerProps {
  message?: string;
  size?: "sm" | "md" | "lg";
}

const sizes = {
  sm: "w-5 h-5 border-2",
  md: "w-8 h-8 border-[3px]",
  lg: "w-12 h-12 border-4",
};

export default function LoadingSpinner({ message, size = "md" }: LoadingSpinnerProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-3">
      <div
        className={`${sizes[size]} border-[var(--border)] border-t-[var(--accent)] rounded-full animate-spin`}
      />
      {message && (
        <p className="text-sm text-[var(--text-secondary)] font-[var(--font-body)] animate-pulse">
          {message}
        </p>
      )}
    </div>
  );
}
