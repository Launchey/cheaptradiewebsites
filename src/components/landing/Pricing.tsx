"use client";

import { useEffect, useRef } from "react";
import Button from "@/components/ui/Button";

const included = [
  "Custom AI-designed website",
  "Mobile-friendly responsive design",
  "Your business name, services & contact info",
  "Hosted on a fast, secure server",
  "Free subdomain (yourname.vercel.app)",
  "Built in minutes, not weeks",
  "One round of revisions included",
];

export default function Pricing() {
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
      id="pricing"
      ref={sectionRef}
      className="py-24 md:py-32 bg-[var(--bg-dark)] relative overflow-hidden"
    >
      {/* Background texture */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: `
            linear-gradient(45deg, #fff 1px, transparent 1px),
            linear-gradient(-45deg, #fff 1px, transparent 1px)
          `,
          backgroundSize: "40px 40px",
        }}
      />

      <div className="max-w-4xl mx-auto px-5 relative z-10">
        {/* Section header */}
        <div className="text-center mb-12 reveal">
          <span className="inline-block text-[var(--accent)] font-semibold text-sm uppercase tracking-widest mb-3">
            Pricing
          </span>
          <h2
            className="font-[var(--font-heading)] font-black tracking-tight text-[var(--text-on-dark)]"
            style={{ fontSize: "clamp(2rem, 4vw, 3rem)" }}
          >
            Simple Pricing. No Surprises.
          </h2>
        </div>

        {/* Pricing card */}
        <div className="reveal reveal-delay-1 max-w-lg mx-auto">
          <div className="bg-white rounded-[var(--radius-xl)] p-8 md:p-10 shadow-[var(--shadow-xl)] relative overflow-hidden">
            {/* Orange accent bar */}
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-[var(--accent)]" />

            {/* Free preview badge */}
            <div className="inline-flex items-center gap-2 bg-[var(--accent-secondary)]/10 text-[var(--accent-secondary)] rounded-full px-3 py-1 text-sm font-semibold mb-6">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
              Free preview — see your site before you pay
            </div>

            {/* Price */}
            <div className="mb-6">
              <div className="flex items-baseline gap-1">
                <span className="text-[var(--text-muted)] text-lg">$</span>
                <span className="font-[var(--font-heading)] font-black text-6xl md:text-7xl text-[var(--text-primary)]">
                  500
                </span>
                <span className="text-[var(--text-muted)] text-lg ml-1">
                  NZD
                </span>
              </div>
              <p className="text-[var(--text-secondary)] mt-1">
                One-time payment. No monthly fees. It&apos;s yours forever.
              </p>
            </div>

            {/* Divider */}
            <div className="h-px bg-[var(--border)] mb-6" />

            {/* What's included */}
            <h4 className="font-semibold text-sm uppercase tracking-widest text-[var(--text-muted)] mb-4">
              What&apos;s Included
            </h4>
            <ul className="space-y-3 mb-8">
              {included.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <svg
                    className="w-5 h-5 text-[var(--accent-secondary)] shrink-0 mt-0.5"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                    <polyline points="22 4 12 14.01 9 11.01" />
                  </svg>
                  <span className="text-[var(--text-primary)]">{item}</span>
                </li>
              ))}
            </ul>

            {/* CTA */}
            <Button href="#hero" size="lg" className="w-full text-center">
              Get Your Free Preview
            </Button>

            <p className="text-center text-xs text-[var(--text-muted)] mt-4">
              No credit card needed for the preview
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
