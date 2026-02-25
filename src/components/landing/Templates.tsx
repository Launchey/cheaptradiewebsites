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
      <div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-12">
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {templates.map((template, i) => (
            <div
              key={template.name}
              className={`reveal reveal-delay-${(i % 4) + 1} group cursor-pointer`}
            >
              <div className="bg-[var(--bg-card)] rounded-[var(--radius-lg)] overflow-hidden border border-[var(--border)] transition-all duration-500 hover:shadow-[var(--shadow-xl)] hover:-translate-y-2">
                {/* Fake browser chrome */}
                <div
                  className="relative"
                  style={{ backgroundColor: template.dark }}
                >
                  {/* Browser bar */}
                  <div className="flex items-center gap-1.5 px-3 py-2.5 bg-black/20">
                    <div className="flex gap-1.5">
                      <div className="w-2 h-2 rounded-full bg-white/25" />
                      <div className="w-2 h-2 rounded-full bg-white/25" />
                      <div className="w-2 h-2 rounded-full bg-white/25" />
                    </div>
                    <div className="ml-3 flex-1 h-5 bg-white/10 rounded-sm px-2 flex items-center">
                      <div className="h-1 w-2 rounded-full bg-white/20 mr-1.5" />
                      <div className="h-1.5 w-16 bg-white/15 rounded-full" />
                    </div>
                  </div>

                  {/* Mini website preview */}
                  <div className="h-52 p-3 relative overflow-hidden">
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
                      className="rounded-sm p-4 mb-2.5 flex flex-col items-center justify-center"
                      style={{ backgroundColor: template.color, minHeight: "70px" }}
                    >
                      <div className="h-1 w-16 bg-white/30 rounded-full mb-2" />
                      <div className="h-2.5 w-32 bg-white/50 rounded-full mb-1.5" />
                      <div className="h-1.5 w-24 bg-white/25 rounded-full mb-3" />
                      <div
                        className="h-5 w-20 rounded-sm flex items-center justify-center"
                        style={{ backgroundColor: template.accent }}
                      >
                        <div className="h-1 w-10 bg-white/60 rounded-full" />
                      </div>
                    </div>

                    {/* Content cards */}
                    <div className="flex gap-2">
                      {[0, 1, 2].map((j) => (
                        <div key={j} className="flex-1 bg-white/[0.06] rounded-sm border border-white/[0.08] p-2">
                          <div
                            className="w-5 h-5 rounded-full mx-auto mb-1.5 opacity-40"
                            style={{ backgroundColor: template.accent }}
                          />
                          <div className="h-1 w-10 bg-white/20 rounded-full mx-auto mb-1" />
                          <div className="h-1 w-8 bg-white/10 rounded-full mx-auto" />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Hover overlay */}
                  <div className="absolute inset-0 top-[37px] bg-[var(--accent)]/0 group-hover:bg-[var(--accent)]/90 transition-all duration-300 flex items-center justify-center">
                    <span className="text-white font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-sm uppercase tracking-wider">
                      Use This Template
                    </span>
                  </div>
                </div>

                {/* Template info */}
                <div className="p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-[var(--font-heading)] text-lg text-[var(--text-primary)] mb-0.5">
                        {template.name}
                      </h3>
                      <p className="text-sm text-[var(--text-muted)]">
                        {template.trade}
                      </p>
                    </div>
                    <div
                      className="w-8 h-8 rounded-full opacity-80 group-hover:scale-110 transition-transform duration-300"
                      style={{ background: `linear-gradient(135deg, ${template.color}, ${template.accent})` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
