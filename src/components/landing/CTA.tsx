"use client";

import { useEffect, useRef } from "react";
import Button from "@/components/ui/Button";

export default function CTA() {
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
      { threshold: 0.1 }
    );

    const reveals = sectionRef.current?.querySelectorAll(".reveal");
    reveals?.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="py-24 md:py-32 bg-[var(--bg-dark)] relative overflow-hidden grain-overlay">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[var(--accent)] to-transparent opacity-40" />
      <div className="absolute bottom-0 right-0 w-64 h-64 rounded-full bg-[var(--accent)] opacity-[0.03] blur-3xl" />
      <div className="absolute top-0 left-0 w-48 h-48 rounded-full bg-[var(--secondary)] opacity-[0.04] blur-3xl" />

      <div className="max-w-4xl mx-auto px-6 sm:px-8 lg:px-12 text-center relative z-10">
        <div className="reveal">
          <div className="w-12 h-[2px] bg-[var(--accent)] mx-auto mb-8" />
          <h2
            className="font-[var(--font-heading)] tracking-tight text-[var(--text-on-dark)] mb-6"
            style={{ fontSize: "clamp(2rem, 4vw, 3.5rem)" }}
          >
            Ready to Get Your
            <br />
            Trade Business{" "}
            <span className="text-[var(--accent)]">Online?</span>
          </h2>
          <p className="text-[var(--text-on-dark-muted)] text-lg mb-10 max-w-xl mx-auto leading-relaxed">
            No tech skills. No long waits. No monthly fees. Just a professional
            website that makes your business look as good as your work.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button href="/builder" size="lg" variant="primary">
              Get Your Free Preview
            </Button>
            <Button href="#how-it-works" variant="ghost" size="lg" className="!text-[var(--text-on-dark-muted)] hover:!text-white">
              See How It Works
            </Button>
          </div>

          {/* Trust line */}
          <p className="mt-10 text-sm text-[var(--text-on-dark-muted)] opacity-60">
            Preview is free. Only pay if you love it. $500 one-off, no surprises.
          </p>
        </div>
      </div>
    </section>
  );
}
