import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy — CheapTradieWebsites",
  description: "Privacy policy for CheapTradieWebsites. How we collect, use, and protect your information.",
};

export default function PrivacyPage() {
  return (
    <div className="pt-32 pb-24 min-h-screen">
      <div className="max-w-3xl mx-auto px-5">
        <h1
          className="font-[var(--font-heading)] font-black tracking-tight text-[var(--text-primary)] mb-4"
          style={{ fontSize: "clamp(2rem, 4vw, 3rem)" }}
        >
          Privacy Policy
        </h1>
        <p className="text-[var(--text-muted)] mb-12">
          Last updated: {new Date().toLocaleDateString("en-NZ", { year: "numeric", month: "long", day: "numeric" })}
        </p>

        <div className="prose-custom space-y-8 text-[var(--text-secondary)] leading-relaxed">
          <section>
            <h2 className="font-[var(--font-heading)] font-black text-xl text-[var(--text-primary)] mb-3">
              1. Information We Collect
            </h2>
            <p>
              When you use CheapTradieWebsites, we collect information you provide directly to us, including:
            </p>
            <ul className="list-disc pl-6 mt-3 space-y-2">
              <li>Your business name, trade type, and location</li>
              <li>Contact information (email address, phone number)</li>
              <li>Details about your services</li>
              <li>Any website URLs you share with us for reference or data import</li>
              <li>Payment information (processed securely by our payment provider)</li>
            </ul>
          </section>

          <section>
            <h2 className="font-[var(--font-heading)] font-black text-xl text-[var(--text-primary)] mb-3">
              2. How We Use Your Information
            </h2>
            <p>We use the information we collect to:</p>
            <ul className="list-disc pl-6 mt-3 space-y-2">
              <li>Build and host your custom website</li>
              <li>Communicate with you about your website and our services</li>
              <li>Process payments</li>
              <li>Improve our service and develop new features</li>
              <li>Comply with legal obligations</li>
            </ul>
          </section>

          <section>
            <h2 className="font-[var(--font-heading)] font-black text-xl text-[var(--text-primary)] mb-3">
              3. Information Sharing
            </h2>
            <p>
              We do not sell your personal information. We may share your information with:
            </p>
            <ul className="list-disc pl-6 mt-3 space-y-2">
              <li>Service providers who help us operate our business (hosting, payment processing)</li>
              <li>Law enforcement or government agencies when required by law</li>
            </ul>
          </section>

          <section>
            <h2 className="font-[var(--font-heading)] font-black text-xl text-[var(--text-primary)] mb-3">
              4. Data Security
            </h2>
            <p>
              We take reasonable measures to protect your information from unauthorised access,
              alteration, or destruction. Your website data is hosted on secure servers provided
              by Vercel, a leading cloud platform.
            </p>
          </section>

          <section>
            <h2 className="font-[var(--font-heading)] font-black text-xl text-[var(--text-primary)] mb-3">
              5. Your Rights Under NZ Privacy Act 2020
            </h2>
            <p>
              Under the New Zealand Privacy Act 2020, you have the right to:
            </p>
            <ul className="list-disc pl-6 mt-3 space-y-2">
              <li>Access the personal information we hold about you</li>
              <li>Request correction of inaccurate information</li>
              <li>Request deletion of your information</li>
              <li>Complain to the Office of the Privacy Commissioner if you believe we have breached the Privacy Act</li>
            </ul>
          </section>

          <section>
            <h2 className="font-[var(--font-heading)] font-black text-xl text-[var(--text-primary)] mb-3">
              6. Cookies
            </h2>
            <p>
              We use essential cookies to make our website work properly. We do not use
              tracking cookies or share cookie data with third parties.
            </p>
          </section>

          <section>
            <h2 className="font-[var(--font-heading)] font-black text-xl text-[var(--text-primary)] mb-3">
              7. Contact Us
            </h2>
            <p>
              If you have questions about this privacy policy or your personal information,
              please contact us at{" "}
              <a href="mailto:hello@cheaptradiewebsites.co.nz" className="text-[var(--accent)] hover:underline">
                hello@cheaptradiewebsites.co.nz
              </a>
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
