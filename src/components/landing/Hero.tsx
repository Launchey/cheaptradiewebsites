"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";

const trades = [
  "Builders",
  "Electricians",
  "Plumbers",
  "Drainlayers",
  "Painters",
  "Roofers",
  "Landscapers",
  "Concreters",
];

export default function Hero() {
  const [url, setUrl] = useState("");

  return (
    <section
      id="hero"
      className="relative min-h-[100vh] flex items-center justify-center overflow-hidden pt-24 pb-16"
    >
      {/* Background — warm gradient with construction feel */}
      <div className="absolute inset-0 bg-gradient-to-br from-[var(--bg-primary)] via-[var(--bg-secondary)] to-[#E8E2D6]" />

      {/* Geometric grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `
            linear-gradient(var(--text-primary) 1px, transparent 1px),
            linear-gradient(90deg, var(--text-primary) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
        }}
      />

      {/* Accent diagonal stripe in corner */}
      <div className="absolute top-0 right-0 w-64 h-64 stripe-accent rotate-12 translate-x-16 -translate-y-16" />

      <div className="relative z-10 max-w-4xl mx-auto px-5 text-center">
        {/* Trade badge */}
        <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm border border-[var(--border)] rounded-full px-4 py-2 mb-8 shadow-[var(--shadow-sm)]">
          <div className="w-2 h-2 bg-[var(--accent-secondary)] rounded-full animate-pulse" />
          <span className="text-sm font-medium text-[var(--text-secondary)]">
            Built for New Zealand tradies
          </span>
        </div>

        {/* Headline */}
        <h1
          className="font-[var(--font-heading)] font-black leading-[0.95] tracking-tight mb-6"
          style={{
            fontSize: "clamp(2.5rem, 6vw, 4.5rem)",
          }}
        >
          Your Trade Business
          <br />
          Deserves a{" "}
          <span className="relative inline-block">
            <span className="relative z-10 text-[var(--accent)]">
              Professional Website
            </span>
            <span className="absolute bottom-1 left-0 right-0 h-3 bg-[var(--accent)]/15 -rotate-1" />
          </span>
        </h1>

        {/* Subheading */}
        <p
          className="text-[var(--text-secondary)] max-w-2xl mx-auto mb-10 leading-relaxed"
          style={{ fontSize: "clamp(1.1rem, 2vw, 1.35rem)" }}
        >
          No tech skills needed. Show us a website you like, answer a few
          questions about your business, and get a live website.{" "}
          <strong className="text-[var(--text-primary)]">From $500.</strong>
        </p>

        {/* URL Input — the main CTA */}
        <div className="max-w-2xl mx-auto mb-6">
          <div className="relative flex items-center bg-white rounded-[var(--radius-lg)] shadow-[var(--shadow-lg)] border border-[var(--border)] p-2 transition-shadow duration-300 focus-within:shadow-[var(--shadow-xl)] focus-within:border-[var(--accent)]/30">
            <div className="pl-4 pr-3 text-[var(--text-muted)]">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
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
              className="flex-1 text-base py-3 outline-none bg-transparent text-[var(--text-primary)] placeholder:text-[var(--text-muted)]"
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
        <p className="text-[var(--text-muted)] text-sm mb-12">
          or{" "}
          <a
            href="#templates"
            className="text-[var(--accent)] font-semibold hover:underline"
          >
            browse our tradie templates
          </a>
        </p>

        {/* Social proof — trades served */}
        <div className="flex flex-wrap justify-center gap-3">
          {trades.map((trade) => (
            <span
              key={trade}
              className="px-3 py-1.5 bg-white/70 backdrop-blur-sm border border-[var(--border)] rounded-full text-xs font-medium text-[var(--text-secondary)]"
            >
              {trade}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
