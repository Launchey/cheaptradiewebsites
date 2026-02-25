"use client";

import { useEffect, useRef } from "react";

const templates = [
  {
    name: "Solid Ground",
    trade: "Builder / Construction",
    color: "#8B7355",
    accent: "#D4A574",
    description: "Bold, professional look for builders and construction crews.",
  },
  {
    name: "Bright Spark",
    trade: "Electrician",
    color: "#2D5A87",
    accent: "#F5C842",
    description: "Clean, modern design for electrical businesses.",
  },
  {
    name: "Clear Flow",
    trade: "Plumber / Drainlayer",
    color: "#1B6B93",
    accent: "#58B4D1",
    description: "Fresh, trustworthy look for plumbing and drainage.",
  },
  {
    name: "True Level",
    trade: "Painter / Decorator",
    color: "#6B5B73",
    accent: "#E8A87C",
    description: "Creative, polished design for painters and decorators.",
  },
  {
    name: "Iron Edge",
    trade: "Roofer / Steel",
    color: "#4A4A4A",
    accent: "#C4553E",
    description: "Strong, industrial feel for roofing and steel work.",
  },
  {
    name: "Green Acres",
    trade: "Landscaper",
    color: "#2D6A4F",
    accent: "#95D5B2",
    description: "Natural, earthy design for landscaping businesses.",
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
      className="py-24 md:py-32 bg-[var(--bg-secondary)] relative"
    >
      <div className="max-w-7xl mx-auto px-5">
        {/* Section header */}
        <div className="text-center mb-16 reveal">
          <span className="inline-block text-[var(--accent)] font-semibold text-sm uppercase tracking-widest mb-3">
            Templates
          </span>
          <h2
            className="font-[var(--font-heading)] font-black tracking-tight text-[var(--text-primary)] mb-4"
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {templates.map((template, i) => (
            <div
              key={template.name}
              className={`reveal reveal-delay-${(i % 4) + 1} group cursor-pointer`}
            >
              <div className="bg-white rounded-[var(--radius-lg)] overflow-hidden shadow-[var(--shadow-sm)] border border-[var(--border)] transition-all duration-300 hover:shadow-[var(--shadow-lg)] hover:-translate-y-1">
                {/* Template preview placeholder */}
                <div
                  className="h-48 relative overflow-hidden"
                  style={{ backgroundColor: template.color }}
                >
                  {/* Fake website preview */}
                  <div className="absolute inset-3 bg-white/10 backdrop-blur-sm rounded-lg p-4 flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-6 h-6 rounded"
                        style={{ backgroundColor: template.accent }}
                      />
                      <div className="h-2 w-20 bg-white/30 rounded" />
                      <div className="ml-auto flex gap-1">
                        <div className="h-2 w-8 bg-white/20 rounded" />
                        <div className="h-2 w-8 bg-white/20 rounded" />
                        <div className="h-2 w-8 bg-white/20 rounded" />
                      </div>
                    </div>
                    <div className="flex-1 flex flex-col justify-center items-center gap-2">
                      <div className="h-3 w-32 bg-white/40 rounded" />
                      <div className="h-2 w-24 bg-white/20 rounded" />
                      <div
                        className="h-6 w-20 rounded mt-1"
                        style={{ backgroundColor: template.accent }}
                      />
                    </div>
                    <div className="flex gap-2">
                      <div className="h-8 flex-1 bg-white/10 rounded" />
                      <div className="h-8 flex-1 bg-white/10 rounded" />
                      <div className="h-8 flex-1 bg-white/10 rounded" />
                    </div>
                  </div>

                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-[var(--accent)]/0 group-hover:bg-[var(--accent)]/90 transition-all duration-300 flex items-center justify-center">
                    <span className="text-white font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-lg">
                      Use This Template
                    </span>
                  </div>
                </div>

                {/* Template info */}
                <div className="p-5">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-[var(--font-heading)] font-black text-lg text-[var(--text-primary)]">
                      {template.name}
                    </h3>
                    <span
                      className="text-xs font-semibold px-2 py-1 rounded-full"
                      style={{
                        backgroundColor: template.accent + "20",
                        color: template.color,
                      }}
                    >
                      {template.trade}
                    </span>
                  </div>
                  <p className="text-sm text-[var(--text-secondary)]">
                    {template.description}
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
