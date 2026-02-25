import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service — CheapTradieWebsites",
  description: "Terms of service for CheapTradieWebsites. The agreement between you and CheapTradieWebsites.",
};

export default function TermsPage() {
  return (
    <div className="pt-32 pb-24 min-h-screen">
      <div className="max-w-3xl mx-auto px-5">
        <h1
          className="font-[var(--font-heading)] font-black tracking-tight text-[var(--text-primary)] mb-4"
          style={{ fontSize: "clamp(2rem, 4vw, 3rem)" }}
        >
          Terms of Service
        </h1>
        <p className="text-[var(--text-muted)] mb-12">
          Last updated: {new Date().toLocaleDateString("en-NZ", { year: "numeric", month: "long", day: "numeric" })}
        </p>

        <div className="space-y-8 text-[var(--text-secondary)] leading-relaxed">
          <section>
            <h2 className="font-[var(--font-heading)] font-black text-xl text-[var(--text-primary)] mb-3">
              1. Agreement
            </h2>
            <p>
              By using CheapTradieWebsites, you agree to these terms. If you don&apos;t agree,
              please don&apos;t use our service. These terms are governed by New Zealand law.
            </p>
          </section>

          <section>
            <h2 className="font-[var(--font-heading)] font-black text-xl text-[var(--text-primary)] mb-3">
              2. Our Service
            </h2>
            <p>
              CheapTradieWebsites provides AI-generated websites for trade businesses.
              We build, host, and maintain your website based on the information you provide.
            </p>
            <ul className="list-disc pl-6 mt-3 space-y-2">
              <li>Free previews are available at no cost with no obligation</li>
              <li>A one-time payment of $500 NZD is required to keep your website live and transfer hosting rights</li>
              <li>One round of revisions is included in the $500 price</li>
              <li>Additional revisions or major changes may incur extra charges</li>
            </ul>
          </section>

          <section>
            <h2 className="font-[var(--font-heading)] font-black text-xl text-[var(--text-primary)] mb-3">
              3. Your Responsibilities
            </h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>You must provide accurate information about your business</li>
              <li>You must have the right to use any logos, images, or content you provide to us</li>
              <li>You must not use our service for any unlawful purpose</li>
              <li>You are responsible for the content displayed on your website</li>
            </ul>
          </section>

          <section>
            <h2 className="font-[var(--font-heading)] font-black text-xl text-[var(--text-primary)] mb-3">
              4. Ownership
            </h2>
            <p>
              Once you pay the $500 fee, you own the website content and have full hosting rights.
              You may transfer or modify the website as you wish. The underlying technology
              and templates remain the property of CheapTradieWebsites.
            </p>
          </section>

          <section>
            <h2 className="font-[var(--font-heading)] font-black text-xl text-[var(--text-primary)] mb-3">
              5. Hosting
            </h2>
            <p>
              We host your website on Vercel&apos;s infrastructure. While we strive for 100% uptime,
              we cannot guarantee uninterrupted service. We are not liable for any downtime
              caused by our hosting provider or factors outside our control.
            </p>
          </section>

          <section>
            <h2 className="font-[var(--font-heading)] font-black text-xl text-[var(--text-primary)] mb-3">
              6. Free Previews
            </h2>
            <p>
              Free preview websites are temporary and may be removed after 7 days. Previews
              are for evaluation purposes only and should not be shared as your live business website.
            </p>
          </section>

          <section>
            <h2 className="font-[var(--font-heading)] font-black text-xl text-[var(--text-primary)] mb-3">
              7. Refunds
            </h2>
            <p>
              If you are not satisfied with your website after the included revision round,
              we will work with you to resolve the issue. Refunds are considered on a
              case-by-case basis within 14 days of payment, in accordance with the
              New Zealand Consumer Guarantees Act.
            </p>
          </section>

          <section>
            <h2 className="font-[var(--font-heading)] font-black text-xl text-[var(--text-primary)] mb-3">
              8. Limitation of Liability
            </h2>
            <p>
              CheapTradieWebsites is provided &quot;as is.&quot; We are not liable for any indirect,
              incidental, or consequential damages arising from your use of our service,
              to the maximum extent permitted by New Zealand law.
            </p>
          </section>

          <section>
            <h2 className="font-[var(--font-heading)] font-black text-xl text-[var(--text-primary)] mb-3">
              9. Changes to Terms
            </h2>
            <p>
              We may update these terms from time to time. We will notify you of significant
              changes by email or through our website.
            </p>
          </section>

          <section>
            <h2 className="font-[var(--font-heading)] font-black text-xl text-[var(--text-primary)] mb-3">
              10. Contact
            </h2>
            <p>
              Questions about these terms? Contact us at{" "}
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
