import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Build Your Website — CheapTradieWebsites",
  description:
    "Build a professional website for your trade business in minutes. Free preview, $500 to keep.",
};

export default function BuilderLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      {/* Simplified header — logo only */}
      <header className="border-b border-[var(--border)] bg-white/80 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <a
            href="/"
            className="font-[var(--font-heading)] text-xl text-[var(--text-primary)] hover:text-[var(--accent)] transition-colors"
          >
            CheapTradie<span className="text-[var(--accent)]">Websites</span>
          </a>
          <a
            href="/"
            className="text-sm text-[var(--text-muted)] hover:text-[var(--text-secondary)] transition-colors"
          >
            Back to home
          </a>
        </div>
      </header>

      {/* Builder content */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        {children}
      </div>
    </div>
  );
}
