"use client";

import { useEffect, useRef } from "react";

const steps = [
  {
    number: "01",
    title: "Pick a Style",
    description:
      "Paste a website you like the look of, or choose from our tradie templates. We\u2019ll match the style to your business.",
    icon: (
      <svg
        width="32"
        height="32"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect x="3" y="3" width="7" height="7" />
        <rect x="14" y="3" width="7" height="7" />
        <rect x="14" y="14" width="7" height="7" />
        <rect x="3" y="14" width="7" height="7" />
      </svg>
    ),
  },
  {
    number: "02",
    title: "Tell Us About Your Business",
    description:
      "Answer a few simple questions \u2014 your trade, location, services, contact details. Takes about 2 minutes.",
    icon: (
      <svg
        width="32"
        height="32"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
        <polyline points="10 9 9 9 8 9" />
      </svg>
    ),
  },
  {
    number: "03",
    title: "Get Your Website",
    description:
      "AI builds your custom website in minutes. Preview it for free. Love it? Pay $500 and it\u2019s yours \u2014 live and ready to share.",
    icon: (
      <svg
        width="32"
        height="32"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
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
      className="py-24 md:py-32 bg-white relative"
    >
      <div className="max-w-7xl mx-auto px-5">
        {/* Section header */}
        <div className="text-center mb-16 reveal">
          <span className="inline-block text-[var(--accent)] font-semibold text-sm uppercase tracking-widest mb-3">
            How It Works
          </span>
          <h2
            className="font-[var(--font-heading)] font-black tracking-tight text-[var(--text-primary)]"
            style={{ fontSize: "clamp(2rem, 4vw, 3rem)" }}
          >
            Three Steps. That&apos;s It.
          </h2>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 relative">
          {/* Connecting line (desktop) */}
          <div className="hidden md:block absolute top-16 left-[16%] right-[16%] h-px bg-[var(--border)]" />

          {steps.map((step, i) => (
            <div
              key={step.number}
              className={`reveal reveal-delay-${i + 1} text-center relative`}
            >
              {/* Step number circle */}
              <div className="w-32 h-32 mx-auto mb-6 rounded-full bg-[var(--bg-secondary)] flex items-center justify-center relative">
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-[var(--accent)] rounded-full flex items-center justify-center text-white text-xs font-bold">
                  {step.number}
                </div>
                <div className="text-[var(--text-primary)]">{step.icon}</div>
              </div>

              <h3 className="font-[var(--font-heading)] font-black text-xl mb-3 text-[var(--text-primary)]">
                {step.title}
              </h3>
              <p className="text-[var(--text-secondary)] leading-relaxed max-w-xs mx-auto">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
