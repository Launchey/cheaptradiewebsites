"use client";

import { useEffect, useRef } from "react";

const features = [
  {
    title: "Custom Designed for You",
    description:
      "Not a template with your name slapped on. We study the style you like and build a website that fits your trade, your area, and your brand.",
    stat: "100%",
    statLabel: "Custom",
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 19l7-7 3 3-7 7-3-3z" />
        <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z" />
        <path d="M2 2l7.586 7.586" />
        <circle cx="11" cy="11" r="2" />
      </svg>
    ),
  },
  {
    title: "Looks Great on Every Device",
    description:
      "Your customers are searching on their phones. Your website adapts perfectly to any screen — mobile, tablet, or desktop.",
    stat: "70%",
    statLabel: "Mobile traffic",
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="3" width="20" height="14" rx="2" />
        <path d="M8 21h8" />
        <path d="M12 17v4" />
        <rect x="6" y="7" width="4" height="5" rx="0.5" opacity="0.4" />
        <rect x="12" y="7" width="6" height="3" rx="0.5" opacity="0.4" />
        <rect x="12" y="11.5" width="6" height="1.5" rx="0.5" opacity="0.2" />
      </svg>
    ),
  },
  {
    title: "Made for NZ Tradies",
    description:
      "We know the trades. Built with the right language, layout, and features for Kiwi trade businesses — from Northland to Southland.",
    stat: "15+",
    statLabel: "Trade types",
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
      </svg>
    ),
  },
  {
    title: "Live in Minutes, Not Months",
    description:
      "No waiting around for a web designer to get back to you. Your site is built and ready to go while you're still on your smoko.",
    stat: "~2",
    statLabel: "Minutes to build",
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
      </svg>
    ),
  },
  {
    title: "Free Preview — No Risk",
    description:
      "See your actual finished website before you spend a dollar. Love it? Pay $500 and it's yours. Not keen? Walk away, no charge.",
    stat: "$0",
    statLabel: "To preview",
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
        <circle cx="12" cy="12" r="3" />
      </svg>
    ),
  },
  {
    title: "Hosted & Sorted",
    description:
      "We handle the hosting, the security, the technical stuff. Your website is fast, always online, and you never have to think about it.",
    stat: "99.9%",
    statLabel: "Uptime",
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        <path d="M9 12l2 2 4-4" />
      </svg>
    ),
  },
];

export default function Features() {
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
    <section ref={sectionRef} className="py-24 md:py-32 bg-white relative overflow-hidden">
      {/* Subtle diagonal line decoration */}
      <div className="absolute top-0 right-0 w-px h-40 bg-gradient-to-b from-[var(--accent)] to-transparent opacity-20 translate-x-[-120px]" />
      <div className="absolute bottom-0 left-0 w-px h-40 bg-gradient-to-t from-[var(--secondary)] to-transparent opacity-20 translate-x-[80px]" />

      <div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-12">
        {/* Section header */}
        <div className="max-w-2xl mb-20 reveal">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-8 h-px bg-[var(--accent)]" />
            <span className="text-[var(--text-muted)] font-medium text-xs uppercase tracking-[0.2em]">
              Why Tradies Choose Us
            </span>
          </div>
          <h2
            className="font-[var(--font-heading)] tracking-tight text-[var(--text-primary)] mb-4"
            style={{ fontSize: "clamp(2rem, 4vw, 3rem)" }}
          >
            Everything You Need.
            <br />
            <span className="text-[var(--text-muted)]">Nothing You Don&apos;t.</span>
          </h2>
          <p className="text-[var(--text-secondary)] text-lg leading-relaxed max-w-lg">
            No contracts, no monthly fees, no tech headaches. Just a professional website that gets you more work.
          </p>
        </div>

        {/* Feature grid — 3 columns on desktop, alternating visual weight */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {features.map((feature, i) => (
            <div
              key={feature.title}
              className={`reveal reveal-delay-${(i % 4) + 1} group`}
            >
              <div className="h-full p-6 lg:p-8 rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--bg-card)] hover:border-[var(--accent)]/30 hover:shadow-[var(--shadow-lg)] transition-all duration-500 relative overflow-hidden">
                {/* Subtle background gradient on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-[var(--accent-light)] to-transparent opacity-0 group-hover:opacity-40 transition-opacity duration-500" />

                <div className="relative z-10">
                  {/* Icon */}
                  <div className="w-12 h-12 rounded-[var(--radius-md)] bg-[var(--bg-warm)] flex items-center justify-center text-[var(--accent)] mb-5 group-hover:bg-[var(--accent)] group-hover:text-white transition-colors duration-300">
                    {feature.icon}
                  </div>

                  {/* Stat callout */}
                  <div className="flex items-baseline gap-1.5 mb-3">
                    <span className="font-[var(--font-heading)] text-2xl text-[var(--accent)]">
                      {feature.stat}
                    </span>
                    <span className="text-xs text-[var(--text-muted)] uppercase tracking-wider">
                      {feature.statLabel}
                    </span>
                  </div>

                  {/* Content */}
                  <h3 className="font-[var(--font-heading)] text-lg mb-2 text-[var(--text-primary)]">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
