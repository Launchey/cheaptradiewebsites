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
    <section ref={sectionRef} className="py-24 md:py-32 bg-white relative">
      <div className="max-w-4xl mx-auto px-5 text-center">
        <div className="reveal">
          <h2
            className="font-[var(--font-heading)] font-black tracking-tight text-[var(--text-primary)] mb-6"
            style={{ fontSize: "clamp(2rem, 4vw, 3rem)" }}
          >
            Ready to Get Your
            <br />
            Trade Business Online?
          </h2>
          <p className="text-[var(--text-secondary)] text-lg mb-8 max-w-xl mx-auto">
            No tech skills. No long waits. No monthly fees. Just a professional
            website that makes your business look as good as your work.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button href="#hero" size="lg">
              Get Your Free Preview
            </Button>
            <Button href="#how-it-works" variant="outline" size="lg">
              See How It Works
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
