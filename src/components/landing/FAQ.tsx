"use client";

import { useState, useEffect, useRef } from "react";

const faqs = [
  {
    question: "How long does it take to get my website?",
    answer:
      "Your website is built in minutes, not weeks. Once you\u2019ve picked a style and answered a few questions, our AI gets to work immediately. You\u2019ll have a live preview to look at within about 5 minutes.",
  },
  {
    question: "Do I need any tech skills?",
    answer:
      "Not at all. If you can browse the internet and answer a few questions about your business, you can get a website. We handle all the technical stuff \u2014 hosting, design, everything.",
  },
  {
    question: "What if I already have a website?",
    answer:
      "That\u2019s fine! You can share your current website with us and we\u2019ll pull your business information from it. Or you can start fresh \u2014 whatever you prefer.",
  },
  {
    question: "Can I make changes after it\u2019s built?",
    answer:
      "Yes. One round of revisions is included in the $500 price. If you want to change text, photos, or layout after it\u2019s live, just let us know and we\u2019ll sort it.",
  },
  {
    question: "What\u2019s included in the $500?",
    answer:
      "Everything you need: a custom AI-designed website, mobile-friendly design, your business info and services, fast and secure hosting, a free web address (yourname.vercel.app), and one round of revisions. No monthly fees, no hidden costs.",
  },
  {
    question: "Do I need to pay anything monthly?",
    answer:
      "No. The $500 is a one-time payment. Your hosting is included at no extra cost. If you want a custom domain name (like yourbusiness.co.nz), that\u2019s about $15/year from a domain provider, but it\u2019s totally optional.",
  },
];

function FAQItem({
  question,
  answer,
  isOpen,
  onClick,
}: {
  question: string;
  answer: string;
  isOpen: boolean;
  onClick: () => void;
}) {
  return (
    <div className="border-b border-[var(--border)] last:border-b-0">
      <button
        className="w-full text-left py-6 flex items-center justify-between gap-4 cursor-pointer group"
        onClick={onClick}
        aria-expanded={isOpen}
      >
        <span className="font-[var(--font-heading)] text-[var(--text-primary)] text-lg group-hover:text-[var(--accent)] transition-colors duration-200">
          {question}
        </span>
        <span
          className={`shrink-0 w-8 h-8 flex items-center justify-center transition-all duration-300 text-[var(--text-muted)]`}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={`transition-transform duration-300 ${isOpen ? "rotate-45" : ""}`}
          >
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
        </span>
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ${
          isOpen ? "max-h-48 pb-6" : "max-h-0"
        }`}
      >
        <p className="text-[var(--text-secondary)] leading-relaxed pr-12">
          {answer}
        </p>
      </div>
    </div>
  );
}

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
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
      id="faq"
      ref={sectionRef}
      className="py-24 md:py-32 bg-[var(--bg-warm)]"
    >
      <div className="max-w-3xl mx-auto px-5">
        {/* Section header */}
        <div className="text-center mb-16 reveal">
          <span className="inline-block text-[var(--text-muted)] font-medium text-xs uppercase tracking-widest mb-4">
            FAQ
          </span>
          <div className="editorial-line mx-auto mb-6" />
          <h2
            className="font-[var(--font-heading)] tracking-tight text-[var(--text-primary)]"
            style={{ fontSize: "clamp(2rem, 4vw, 3rem)" }}
          >
            Got Questions?
          </h2>
        </div>

        {/* FAQ list */}
        <div className="reveal reveal-delay-1 bg-white rounded-[var(--radius-md)] p-6 md:p-10 shadow-[var(--shadow-sm)] border border-[var(--border)]">
          {faqs.map((faq, i) => (
            <FAQItem
              key={i}
              question={faq.question}
              answer={faq.answer}
              isOpen={openIndex === i}
              onClick={() => setOpenIndex(openIndex === i ? null : i)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
