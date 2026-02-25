import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog — CheapTradieWebsites",
  description: "Tips and advice for NZ tradies on getting online, marketing your trade business, and growing your customer base.",
};

const posts = [
  {
    title: "Why Every Tradie Needs a Website in 2026",
    excerpt:
      "Your mates might find you through word of mouth, but new customers are searching online. Here's why having a website matters for your trade business.",
    date: "Coming soon",
    tag: "Getting Started",
  },
  {
    title: "5 Things Every Tradie Website Needs",
    excerpt:
      "From your phone number to your services — the essential elements that turn website visitors into paying customers.",
    date: "Coming soon",
    tag: "Tips",
  },
  {
    title: "How to Get More Customers Without Spending a Fortune",
    excerpt:
      "Simple, low-cost marketing strategies that actually work for trade businesses in New Zealand.",
    date: "Coming soon",
    tag: "Marketing",
  },
];

export default function BlogPage() {
  return (
    <div className="pt-32 pb-24 min-h-screen bg-[var(--bg-secondary)]">
      <div className="max-w-5xl mx-auto px-5">
        <div className="text-center mb-16">
          <span className="inline-block text-[var(--accent)] font-semibold text-sm uppercase tracking-widest mb-3">
            Blog
          </span>
          <h1
            className="font-[var(--font-heading)] font-black tracking-tight text-[var(--text-primary)]"
            style={{ fontSize: "clamp(2rem, 4vw, 3rem)" }}
          >
            Tips for Tradies Getting Online
          </h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <article
              key={post.title}
              className="bg-white rounded-[var(--radius-lg)] overflow-hidden shadow-[var(--shadow-sm)] border border-[var(--border)] hover:shadow-[var(--shadow-md)] transition-shadow duration-300"
            >
              {/* Placeholder image area */}
              <div className="h-40 bg-gradient-to-br from-[var(--bg-secondary)] to-[var(--border)] flex items-center justify-center">
                <span className="text-[var(--text-muted)] text-sm font-medium">
                  {post.tag}
                </span>
              </div>

              <div className="p-6">
                <span className="inline-block text-xs font-semibold text-[var(--accent)] uppercase tracking-wider mb-2">
                  {post.date}
                </span>
                <h2 className="font-[var(--font-heading)] font-black text-lg text-[var(--text-primary)] mb-2">
                  {post.title}
                </h2>
                <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                  {post.excerpt}
                </p>
              </div>
            </article>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-[var(--text-muted)]">
            More articles coming soon. Check back shortly!
          </p>
        </div>
      </div>
    </div>
  );
}
