const footerLinks = {
  Product: [
    { label: "How It Works", href: "#how-it-works" },
    { label: "Templates", href: "#templates" },
    { label: "Pricing", href: "#pricing" },
    { label: "FAQ", href: "#faq" },
  ],
  Company: [
    { label: "Blog", href: "/blog" },
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Service", href: "/terms" },
  ],
};

export default function Footer() {
  return (
    <footer className="bg-[var(--bg-dark)] text-[var(--text-on-dark)] relative overflow-hidden">
      {/* Thin editorial line top accent */}
      <div className="h-px w-full bg-[var(--accent)]" />

      <div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-12 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-0 mb-4">
              <span className="font-[var(--font-heading)] text-xl tracking-tight">
                CheapTradie
              </span>
              <span className="font-[var(--font-heading)] text-xl tracking-tight text-[var(--accent)]">
                Websites
              </span>
            </div>
            <p className="text-[var(--text-on-dark-muted)] max-w-sm leading-relaxed">
              Professional websites for NZ tradies. No tech skills needed. Pick
              a style, answer a few questions, get a live website. From $500.
            </p>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([heading, links]) => (
            <div key={heading}>
              <h4 className="font-medium text-xs uppercase tracking-widest text-[var(--text-on-dark-muted)] mb-4">
                {heading}
              </h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      className="text-[var(--text-on-dark)] hover:text-[var(--accent)] transition-colors duration-200 text-sm"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="border-t border-[var(--border-dark)] mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-[var(--text-on-dark-muted)] text-sm">
            &copy; {new Date().getFullYear()} CheapTradieWebsites. Built in New
            Zealand.
          </p>
          <p className="text-[var(--text-on-dark-muted)] text-xs">
            Websites built with AI, designed for tradies.
          </p>
        </div>
      </div>
    </footer>
  );
}
