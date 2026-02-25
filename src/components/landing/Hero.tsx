"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";

const trades = [
  "builders",
  "electricians",
  "plumbers",
  "drainlayers",
  "painters",
  "roofers",
  "landscapers",
  "concreters",
];

export default function Hero() {
  const [url, setUrl] = useState("");

  return (
    <section
      id="hero"
      className="relative min-h-[100vh] flex items-center justify-center overflow-hidden pt-24 pb-16"
    >
      {/* Background — warm gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-[var(--bg-primary)] to-[var(--bg-warm)]" />

      {/* Subtle grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage: `
            linear-gradient(var(--text-primary) 1px, transparent 1px),
            linear-gradient(90deg, var(--text-primary) 1px, transparent 1px)
          `,
          backgroundSize: "80px 80px",
        }}
      />

      <div className="relative z-10 max-w-4xl mx-auto px-5 text-center">
        {/* Small label */}
        <p className="text-[var(--text-muted)] text-sm uppercase tracking-widest mb-8">
          Built for New Zealand tradies
        </p>

        {/* Headline */}
        <h1
          className="font-[var(--font-heading)] leading-[1.1] tracking-tight mb-6"
          style={{
            fontSize: "clamp(2.5rem, 6vw, 4.5rem)",
          }}
        >
          Your Trade Business
          <br />
          Deserves a{" "}
          <em className="text-[var(--accent)]">Professional Website</em>
        </h1>

        {/* Subheading */}
        <p
          className="text-[var(--text-secondary)] max-w-2xl mx-auto mb-12 leading-relaxed"
          style={{ fontSize: "clamp(1.05rem, 2vw, 1.25rem)" }}
        >
          No tech skills needed. Show us a website you like, answer a few
          questions about your business, and get a live website.{" "}
          <strong className="text-[var(--text-primary)]">From $500.</strong>
        </p>

        {/* URL Input */}
        <div className="max-w-2xl mx-auto mb-6">
          <div className="relative flex items-center bg-white border border-[var(--border)] p-2 transition-all duration-300 focus-within:border-[var(--accent)] rounded-[var(--radius-sm)]">
            <div className="pl-4 pr-3 text-[var(--text-muted)]">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10" />
                <path d="M2 12h20" />
                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
              </svg>
            </div>
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Paste a website you like the look of..."
              className="flex-1 text-base py-3.5 outline-none bg-transparent text-[var(--text-primary)] placeholder:text-[var(--text-muted)]"
            />
            <Button size="md" className="shrink-0 hidden sm:inline-flex">
              Build My Website
            </Button>
          </div>
          <Button size="md" className="sm:hidden w-full mt-3">
            Build My Website
          </Button>
        </div>

        {/* Or browse templates */}
        <p className="text-[var(--text-muted)] text-sm mb-16">
          or{" "}
          <a
            href="#templates"
            className="text-[var(--accent)] font-medium hover:underline"
          >
            browse our tradie templates
          </a>
        </p>

        {/* Trade tags — subtle with dot separators */}
        <div className="flex flex-wrap justify-center items-center gap-x-2 gap-y-1">
          {trades.map((trade, i) => (
            <span key={trade} className="flex items-center gap-2">
              <span className="text-[var(--text-muted)] text-sm">
                {trade}
              </span>
              {i < trades.length - 1 && (
                <span className="w-1 h-1 rounded-full bg-[var(--text-muted)] opacity-40" />
              )}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
