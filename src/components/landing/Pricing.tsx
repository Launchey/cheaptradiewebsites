"use client";

import { useEffect, useRef } from "react";
import Button from "@/components/ui/Button";

const included = [
  "Custom designed website",
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
      className="py-24 md:py-32 bg-[var(--bg-warm)] relative overflow-hidden"
    >
      <div className="max-w-4xl mx-auto px-6 sm:px-8 lg:px-12 relative z-10">
        {/* Section header */}
        <div className="text-center mb-16 reveal">
          <span className="inline-block text-[var(--text-muted)] font-medium text-xs uppercase tracking-widest mb-4">
            Pricing
          </span>
          <div className="editorial-line mx-auto mb-6" />
          <h2
            className="font-[var(--font-heading)] tracking-tight text-[var(--text-primary)]"
            style={{ fontSize: "clamp(2rem, 4vw, 3rem)" }}
          >
            Simple Pricing. No Surprises.
          </h2>
        </div>

        {/* Pricing card */}
        <div className="reveal reveal-delay-1 max-w-lg mx-auto">
          <div className="bg-white rounded-[var(--radius-md)] p-8 md:p-12 shadow-[var(--shadow-md)] relative overflow-hidden border border-[var(--border)]">
            {/* Thin accent top border */}
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-[var(--accent)]" />

            {/* Free preview badge */}
            <div className="inline-flex items-center gap-2 bg-[var(--secondary)]/10 text-[var(--secondary)] rounded-[var(--radius-sm)] px-3 py-1.5 text-sm font-medium mb-8">
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
            <div className="mb-8">
              <div className="flex items-baseline gap-1">
                <span className="text-[var(--text-muted)] text-xl font-light">$</span>
                <span className="font-[var(--font-heading)] text-6xl md:text-7xl text-[var(--text-primary)] leading-none">
                  500
                </span>
                <span className="text-[var(--text-muted)] text-sm ml-2 self-end mb-2">
                  NZD
                </span>
              </div>
              <p className="text-[var(--text-secondary)] mt-3">
                One-time payment. No monthly fees. It&apos;s yours forever.
              </p>
            </div>

            {/* Divider */}
            <div className="h-px bg-[var(--border)] mb-8" />

            {/* What's included */}
            <h4 className="font-medium text-xs uppercase tracking-widest text-[var(--text-muted)] mb-5">
              What&apos;s Included
            </h4>
            <ul className="space-y-4 mb-10">
              {included.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <svg
                    className="w-5 h-5 text-[var(--secondary)] shrink-0 mt-0.5"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  <span className="text-[var(--text-primary)]">{item}</span>
                </li>
              ))}
            </ul>

            {/* CTA */}
            <Button href="/builder" size="lg" className="w-full text-center">
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
