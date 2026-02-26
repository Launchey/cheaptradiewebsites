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
      className="relative min-h-[90vh] flex items-center overflow-hidden pt-28 pb-20"
    >
      {/* Background layers */}
      <div className="absolute inset-0 bg-[var(--bg-warm)]" />

      {/* Large decorative text watermark — positioned right to avoid overlap with copy */}
      <div className="absolute inset-0 flex items-center justify-end pointer-events-none select-none overflow-hidden pr-[5%]">
        <span
          className="font-[var(--font-heading)] text-[var(--text-primary)] opacity-[0.015] whitespace-nowrap"
          style={{ fontSize: "clamp(10rem, 18vw, 20rem)" }}
        >
          BUILD
        </span>
      </div>

      {/* Accent line decoration */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-24 bg-gradient-to-b from-transparent to-[var(--accent)] opacity-30" />

      <div className="relative z-10 max-w-6xl mx-auto px-6 sm:px-8 lg:px-12 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left — copy and CTA */}
          <div>
            {/* Small label with line */}
            <div className="flex items-center gap-4 mb-6">
              <div className="w-8 h-px bg-[var(--accent)]" />
              <p className="text-[var(--text-muted)] text-xs uppercase tracking-[0.2em] font-medium">
                Built for NZ tradies
              </p>
            </div>

            {/* Headline */}
            <h1
              className="font-[var(--font-heading)] leading-[1.05] tracking-tight mb-6"
              style={{ fontSize: "clamp(2.5rem, 5vw, 4rem)" }}
            >
              Your Trade Business Deserves a{" "}
              <em className="text-[var(--accent)] not-italic relative">
                Professional
                <span className="absolute -bottom-1 left-0 right-0 h-[3px] bg-[var(--accent)] opacity-30 rounded-full" />
              </em>{" "}
              Website
            </h1>

            {/* Subheading */}
            <p className="text-[var(--text-secondary)] text-lg leading-relaxed mb-8 max-w-lg">
              Show us a website you like, answer a few questions about your
              business, and get a live website.{" "}
              <strong className="text-[var(--text-primary)] font-semibold">
                From $500. No tech skills needed.
              </strong>
            </p>

            {/* URL Input — the centrepiece */}
            <div className="mb-4">
              <div className="relative flex items-center bg-white border-2 border-[var(--border)] p-1.5 transition-all duration-300 focus-within:border-[var(--accent)] focus-within:shadow-[0_4px_20px_rgba(181,117,58,0.15)] rounded-[var(--radius-md)] shadow-[var(--shadow-md)]">
                <div className="pl-4 pr-2 text-[var(--text-muted)]">
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
                  className="flex-1 text-base py-3 outline-none bg-transparent text-[var(--text-primary)] placeholder:text-[var(--text-muted)]"
                />
                <Button
                  size="md"
                  className="shrink-0 hidden sm:inline-flex"
                  href={url ? `/builder?url=${encodeURIComponent(url.trim().startsWith("http") ? url.trim() : "https://" + url.trim())}` : "/builder"}
                >
                  Build My Site
                </Button>
              </div>
              <Button
                size="md"
                className="sm:hidden w-full mt-3"
                href={url ? `/builder?url=${encodeURIComponent(url.trim().startsWith("http") ? url.trim() : "https://" + url.trim())}` : "/builder"}
              >
                Build My Site
              </Button>
            </div>

            <p className="text-[var(--text-muted)] text-sm mb-8">
              or{" "}
              <a
                href="#templates"
                className="text-[var(--accent)] font-medium hover:underline underline-offset-4"
              >
                browse our tradie templates below
              </a>
            </p>

            {/* Trade tags */}
            <div className="flex flex-wrap gap-2">
              {trades.map((trade) => (
                <span
                  key={trade}
                  className="px-3 py-1 text-xs font-medium text-[var(--text-secondary)] bg-[var(--bg-primary)] border border-[var(--border)] rounded-full"
                >
                  {trade}
                </span>
              ))}
            </div>
          </div>

          {/* Right — visual mockup showing a sample tradie website */}
          <div className="hidden lg:block relative">
            {/* Browser chrome mockup */}
            <div className="bg-white rounded-[var(--radius-lg)] shadow-[var(--shadow-xl)] border border-[var(--border)] overflow-hidden transform rotate-1 hover:rotate-0 transition-transform duration-500">
              {/* Browser bar */}
              <div className="flex items-center gap-2 px-4 py-3 border-b border-[var(--border)] bg-[var(--bg-primary)]">
                <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#E5DFD6]" />
                  <div className="w-2.5 h-2.5 rounded-full bg-[#E5DFD6]" />
                  <div className="w-2.5 h-2.5 rounded-full bg-[#E5DFD6]" />
                </div>
                <div className="flex-1 mx-3">
                  <div className="bg-white rounded-sm px-3 py-1 text-xs text-[var(--text-muted)] border border-[var(--border)]">
                    solidgroundbuilders.co.nz
                  </div>
                </div>
              </div>

              {/* Fake website preview */}
              <div className="p-0">
                {/* Hero image area */}
                <div className="h-44 bg-gradient-to-br from-[#7A6652] to-[#5C4A39] relative flex items-center justify-center">
                  <div className="text-center px-6">
                    <p className="text-white/60 text-[10px] uppercase tracking-widest mb-2">
                      Construction & Building
                    </p>
                    <p className="text-white font-[var(--font-heading)] text-2xl leading-tight">
                      Excellence Built on
                      <br />
                      Solid Ground
                    </p>
                    <div className="mt-3 inline-block bg-[var(--accent)] text-white text-[10px] px-4 py-1.5 rounded-sm font-medium">
                      Get a Free Quote
                    </div>
                  </div>
                </div>

                {/* Services section */}
                <div className="p-5 bg-white">
                  <p className="text-[10px] text-[var(--text-muted)] uppercase tracking-widest mb-3">
                    Our Services
                  </p>
                  <div className="grid grid-cols-3 gap-2">
                    {["Renovations", "New Builds", "Extensions"].map((s) => (
                      <div
                        key={s}
                        className="bg-[var(--bg-warm)] rounded-sm p-3 text-center"
                      >
                        <div className="w-6 h-6 mx-auto mb-2 rounded-full bg-[var(--accent)] opacity-20" />
                        <p className="text-[9px] font-medium text-[var(--text-primary)]">
                          {s}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Contact bar */}
                <div className="flex items-center justify-between px-5 py-3 bg-[var(--bg-dark)]">
                  <p className="text-white text-[9px]">
                    027 555 1234
                  </p>
                  <div className="bg-[var(--accent)] text-white text-[9px] px-3 py-1 rounded-sm">
                    Contact Us
                  </div>
                </div>
              </div>
            </div>

            {/* Second card peeking behind */}
            <div className="absolute -bottom-6 -left-6 w-48 bg-white rounded-[var(--radius-md)] shadow-[var(--shadow-lg)] border border-[var(--border)] overflow-hidden -rotate-3 -z-10">
              <div className="h-20 bg-gradient-to-br from-[#2D5A6B] to-[#1B4250]" />
              <div className="p-3">
                <div className="h-2 w-20 bg-[var(--bg-warm)] rounded mb-1.5" />
                <div className="h-2 w-14 bg-[var(--bg-warm)] rounded" />
              </div>
            </div>

            {/* Floating badge */}
            <div className="absolute -top-3 -right-3 bg-[var(--secondary)] text-white text-xs font-medium px-3 py-1.5 rounded-full shadow-[var(--shadow-md)] z-10">
              Built in minutes
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
