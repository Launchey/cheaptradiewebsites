"use client";

import { useState, useEffect } from "react";
import Button from "@/components/ui/Button";

const navLinks = [
  { label: "How It Works", href: "#how-it-works" },
  { label: "Templates", href: "#templates" },
  { label: "Pricing", href: "#pricing" },
  { label: "FAQ", href: "#faq" },
];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-[var(--bg-primary)]/95 backdrop-blur-md border-b border-[var(--border)] py-3"
          : "bg-transparent py-5"
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-12 flex items-center justify-between">
        {/* Logo */}
        <a href="/" className="flex items-center gap-0 group">
          <span className="font-[var(--font-heading)] text-2xl tracking-tight text-[var(--text-primary)]">
            CheapTradie
          </span>
          <span className="font-[var(--font-heading)] text-2xl tracking-tight text-[var(--accent)]">
            Websites
          </span>
        </a>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] uppercase tracking-wider text-xs font-medium transition-colors duration-200"
            >
              {link.label}
            </a>
          ))}
          <Button href="#hero" size="sm" variant="primary">
            Get Your Website
          </Button>
        </nav>

        {/* Mobile Hamburger */}
        <button
          className="lg:hidden flex flex-col gap-1.5 p-2 cursor-pointer"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-expanded={menuOpen}
          aria-label="Toggle menu"
        >
          <span
            className={`w-6 h-0.5 bg-[var(--text-primary)] transition-all duration-300 ${
              menuOpen ? "rotate-45 translate-y-2" : ""
            }`}
          />
          <span
            className={`w-6 h-0.5 bg-[var(--text-primary)] transition-all duration-300 ${
              menuOpen ? "opacity-0" : ""
            }`}
          />
          <span
            className={`w-6 h-0.5 bg-[var(--text-primary)] transition-all duration-300 ${
              menuOpen ? "-rotate-45 -translate-y-2" : ""
            }`}
          />
        </button>
      </div>

      {/* Mobile Menu */}
      <div
        className={`lg:hidden overflow-hidden transition-all duration-300 ${
          menuOpen ? "max-h-80 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <nav className="bg-[var(--bg-primary)] border-t border-[var(--border)] px-6 sm:px-8 lg:px-12 py-4 flex flex-col gap-3">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] uppercase tracking-wider text-xs font-medium py-2"
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </a>
          ))}
          <Button href="#hero" size="md" variant="primary" className="mt-2 w-full text-center">
            Get Your Website
          </Button>
        </nav>
      </div>
    </header>
  );
}
