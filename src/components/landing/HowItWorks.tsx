"use client";

import { useEffect, useRef } from "react";

const steps = [
  {
    number: "01",
    title: "Pick a Style",
    description:
      "Paste a website you like the look of, or choose one of our trade templates. We'll match the colours, fonts, and layout.",
    detail: "Takes 30 seconds",
    icon: (
      <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="3" width="20" height="14" rx="2" />
        <path d="M8 21h8" />
        <path d="M12 17v4" />
        <circle cx="12" cy="10" r="2" opacity="0.5" />
        <path d="M7 10h1" opacity="0.3" />
        <path d="M16 10h1" opacity="0.3" />
      </svg>
    ),
  },
  {
    number: "02",
    title: "Tell Us About Your Business",
    description:
      "Answer a few simple questions — your trade, your location, your services. Like filling out a quote form, but for your own website.",
    detail: "Takes 2 minutes",
    icon: (
      <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
      </svg>
    ),
  },
  {
    number: "03",
    title: "Get Your Website",
    description:
      "Your professional website is built in minutes. Preview it for free. Love it? Pay $500 and it goes live straight away.",
    detail: "Live in minutes",
    icon: (
      <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
        <polyline points="22 4 12 14.01 9 11.01" />
      </svg>
    ),
  },
];

export default function HowItWorks() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
    );

    const reveals = sectionRef.current?.querySelectorAll(".reveal");
    reveals?.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="how-it-works"
      ref={sectionRef}
      className="py-24 md:py-32 bg-[var(--bg-primary)] relative overflow-hidden"
    >
      {/* Background decorative circles */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full border border-[var(--border)] opacity-30 pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full border border-[var(--border)] opacity-20 pointer-events-none" />

      <div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-12 relative z-10">
        {/* Section header — asymmetric editorial layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-20">
          <div className="lg:col-span-5 reveal">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-8 h-px bg-[var(--accent)]" />
              <span className="text-[var(--text-muted)] font-medium text-xs uppercase tracking-[0.2em]">
                How It Works
              </span>
            </div>
            <h2
              className="font-[var(--font-heading)] tracking-tight text-[var(--text-primary)]"
              style={{ fontSize: "clamp(2rem, 4vw, 3rem)" }}
            >
              Three Steps.
              <br />
              <span className="text-[var(--accent)]">One Professional Website.</span>
            </h2>
          </div>
          <div className="lg:col-span-5 lg:col-start-8 flex items-end reveal reveal-delay-1">
            <p className="text-[var(--text-secondary)] text-lg leading-relaxed">
              No design skills needed. No meetings with web designers. No waiting weeks for revisions. Just answer a few questions and you&apos;re done.
            </p>
          </div>
        </div>

        {/* Steps — connected cards with the middle one in dark */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-0">
          {steps.map((step, i) => (
            <div
              key={step.number}
              className={`reveal reveal-delay-${i + 1} relative`}
            >
              {/* Connecting line between steps (desktop) */}
              {i < steps.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 right-0 w-6 h-px bg-[var(--border)] z-20 translate-x-3" />
              )}

              <div
                className={`relative h-full p-8 lg:p-10 transition-all duration-500 group ${
                  i === 0
                    ? "lg:rounded-l-[var(--radius-xl)] lg:rounded-r-none rounded-[var(--radius-xl)]"
                    : i === steps.length - 1
                      ? "lg:rounded-r-[var(--radius-xl)] lg:rounded-l-none rounded-[var(--radius-xl)]"
                      : "lg:rounded-none rounded-[var(--radius-xl)]"
                } ${
                  i === 1
                    ? "bg-[var(--bg-dark)] text-[var(--text-on-dark)]"
                    : "bg-[var(--bg-card)] border border-[var(--border)]"
                }`}
              >
                {/* Large faded step number */}
                <span
                  className={`font-[var(--font-heading)] text-7xl leading-none tracking-tighter absolute top-6 right-8 ${
                    i === 1 ? "text-white/[0.06]" : "text-[var(--text-primary)]/[0.04]"
                  }`}
                >
                  {step.number}
                </span>

                {/* Icon */}
                <div
                  className={`w-14 h-14 rounded-[var(--radius-lg)] flex items-center justify-center mb-6 ${
                    i === 1
                      ? "bg-[var(--accent)] text-white"
                      : "bg-[var(--accent-light)] text-[var(--accent)]"
                  }`}
                >
                  {step.icon}
                </div>

                {/* Content */}
                <h3
                  className={`font-[var(--font-heading)] text-xl mb-3 ${
                    i === 1 ? "text-white" : "text-[var(--text-primary)]"
                  }`}
                >
                  {step.title}
                </h3>
                <p
                  className={`leading-relaxed mb-6 ${
                    i === 1 ? "text-[var(--text-on-dark-muted)]" : "text-[var(--text-secondary)]"
                  }`}
                >
                  {step.description}
                </p>

                {/* Time indicator */}
                <div
                  className={`inline-flex items-center gap-2 text-xs font-medium uppercase tracking-wider ${
                    i === 1 ? "text-[var(--accent)]" : "text-[var(--secondary)]"
                  }`}
                >
                  <div className={`w-1.5 h-1.5 rounded-full ${i === 1 ? "bg-[var(--accent)]" : "bg-[var(--secondary)]"}`} />
                  {step.detail}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
