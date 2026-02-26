interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "accent" | "secondary" | "outline";
  className?: string;
}

const variants = {
  default: "bg-[var(--bg-warm)] text-[var(--text-secondary)]",
  accent: "bg-[var(--accent-light)] text-[var(--accent)]",
  secondary: "bg-[var(--secondary)]/10 text-[var(--secondary)]",
  outline: "border border-[var(--border)] text-[var(--text-secondary)]",
};

export default function Badge({ children, variant = "default", className = "" }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium font-[var(--font-body)] ${variants[variant]} ${className}`}
    >
      {children}
    </span>
  );
}
