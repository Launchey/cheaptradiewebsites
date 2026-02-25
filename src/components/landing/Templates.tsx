"use client";

import { useEffect, useRef } from "react";

const templates = [
  {
    name: "Solid Ground",
    trade: "Builder / Construction",
    color: "#7A6652",
    accent: "#C4A882",
    dark: "#4A3D30",
  },
  {
    name: "Bright Spark",
    trade: "Electrician",
    color: "#3D5A6E",
    accent: "#D4A84B",
    dark: "#2A3E4D",
  },
  {
    name: "Clear Flow",
    trade: "Plumber / Drainlayer",
    color: "#2E6066",
    accent: "#6AABB8",
    dark: "#1D4248",
  },
  {
    name: "True Level",
    trade: "Painter / Decorator",
    color: "#6B5B6E",
    accent: "#D4A07A",
    dark: "#4A3D4D",
  },
  {
    name: "Iron Edge",
    trade: "Roofer / Steel",
    color: "#4F4A47",
    accent: "#B8614E",
    dark: "#332F2D",
  },
  {
    name: "Green Acres",
    trade: "Landscaper",
    color: "#4A6B4F",
    accent: "#8BB88F",
    dark: "#344A37",
  },
];

export default function Templates() {
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
      id="templates"
      ref={sectionRef}
      className="py-24 md:py-32 bg-[var(--bg-warm)] relative"
    >
      <div className="max-w-7xl mx-auto px-5">
        {/* Section header */}
        <div className="text-center mb-20 reveal">
          <span className="inline-block text-[var(--text-muted)] font-medium text-xs uppercase tracking-widest mb-4">
            Templates
          </span>
          <div className="editorial-line mx-auto mb-6" />
          <h2
            className="font-[var(--font-heading)] tracking-tight text-[var(--text-primary)] mb-4"
            style={{ fontSize: "clamp(2rem, 4vw, 3rem)" }}
          >
            Designed for Your Trade
          </h2>
          <p className="text-[var(--text-secondary)] max-w-xl mx-auto">
            Choose a template built for your industry, or paste any website you
            like and we&apos;ll match the style.
          </p>
        </div>

        {/* Template grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {templates.map((template, i) => (
            <div
              key={template.name}
              className={`reveal reveal-delay-${(i % 4) + 1} group cursor-pointer`}
            >
              <div className="bg-[var(--bg-card)] rounded-[var(--radius-md)] overflow-hidden border border-[var(--border)] transition-all duration-300 hover:shadow-[var(--shadow-lg)] hover:-translate-y-1">
                {/* Fake browser chrome */}
                <div
                  className="relative"
                  style={{ backgroundColor: template.dark }}
                >
                  {/* Browser bar */}
                  <div className="flex items-center gap-1.5 px-3 py-2.5 bg-black/20">
                    <div className="w-2 h-2 rounded-full bg-white/30" />
                    <div className="w-2 h-2 rounded-full bg-white/30" />
                    <div className="w-2 h-2 rounded-full bg-white/30" />
                    <div className="ml-3 flex-1 h-4 bg-white/10 rounded-sm" />
                  </div>

                  {/* Mini website preview */}
                  <div className="h-44 p-3 relative overflow-hidden">
                    {/* Nav bar */}
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-1.5">
                        <div
                          className="w-4 h-4 rounded-sm"
                          style={{ backgroundColor: template.accent }}
                        />
                        <div className="h-1.5 w-14 bg-white/30 rounded-full" />
                      </div>
                      <div className="flex gap-3">
                        <div className="h-1.5 w-8 bg-white/20 rounded-full" />
                        <div className="h-1.5 w-8 bg-white/20 rounded-full" />
                        <div className="h-1.5 w-8 bg-white/20 rounded-full" />
                      </div>
                    </div>

                    {/* Hero area */}
                    <div
                      className="rounded-sm p-3 mb-2 flex flex-col items-center justify-center"
                      style={{ backgroundColor: template.color, minHeight: "60px" }}
                    >
                      <div className="h-2 w-28 bg-white/50 rounded-full mb-1.5" />
                      <div className="h-1.5 w-20 bg-white/25 rounded-full mb-2" />
                      <div
                        className="h-4 w-16 rounded-sm"
                        style={{ backgroundColor: template.accent }}
                      />
                    </div>

                    {/* Content cards */}
                    <div className="flex gap-2">
                      <div className="flex-1 h-10 bg-white/8 rounded-sm border border-white/10" />
                      <div className="flex-1 h-10 bg-white/8 rounded-sm border border-white/10" />
                      <div className="flex-1 h-10 bg-white/8 rounded-sm border border-white/10" />
                    </div>
                  </div>

                  {/* Hover overlay */}
                  <div className="absolute inset-0 top-[33px] bg-[var(--accent)]/0 group-hover:bg-[var(--accent)]/90 transition-all duration-300 flex items-center justify-center">
                    <span className="text-white font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-base tracking-wide">
                      Use This Template
                    </span>
                  </div>
                </div>

                {/* Template info */}
                <div className="p-5">
                  <h3 className="font-[var(--font-heading)] text-xl text-[var(--text-primary)] mb-1">
                    {template.name}
                  </h3>
                  <p className="text-sm text-[var(--text-muted)]">
                    {template.trade}
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
