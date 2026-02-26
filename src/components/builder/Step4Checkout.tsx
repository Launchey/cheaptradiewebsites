"use client";

import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import type { BusinessInfo } from "@/lib/types";

interface Step4Props {
  businessInfo: BusinessInfo;
  siteId: string;
  onPay: () => void;
  onBack: () => void;
  isProcessing?: boolean;
}

const included = [
  "Custom designed website",
  "Mobile-friendly responsive design",
  "Hosted on fast, reliable servers",
  "Your own website address",
  "SEO basics set up",
  "Contact form included",
];

export default function Step4Checkout({
  businessInfo,
  siteId,
  onPay,
  onBack,
  isProcessing,
}: Step4Props) {
  if (isProcessing) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <LoadingSpinner size="lg" message="Processing your payment..." />
        <p className="text-sm text-[var(--text-muted)]">
          Just a moment while we set everything up.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto space-y-8">
      <div className="text-center space-y-2">
        <h2 className="text-2xl md:text-3xl font-[var(--font-heading)] text-[var(--text-primary)]">
          Let&apos;s make it yours
        </h2>
        <p className="text-[var(--text-secondary)]">
          One payment, no monthly fees. Your website goes live straight away.
        </p>
      </div>

      <Card padding="lg" className="space-y-6">
        {/* Business details */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-semibold text-[var(--text-primary)]">
              {businessInfo.businessName}
            </h3>
            <Badge variant="accent">{businessInfo.tradeType}</Badge>
          </div>
          <p className="text-sm text-[var(--text-secondary)]">
            {businessInfo.location}, {businessInfo.region}
          </p>
        </div>

        <hr className="border-[var(--border)]" />

        {/* Price */}
        <div className="text-center space-y-1">
          <p className="text-sm text-[var(--text-muted)] uppercase tracking-wider font-medium">
            One-off payment
          </p>
          <p className="text-4xl font-bold text-[var(--text-primary)]">
            $500 <span className="text-lg font-normal text-[var(--text-muted)]">NZD</span>
          </p>
          <p className="text-sm text-[var(--secondary)] font-medium">
            No monthly fees, no hidden costs
          </p>
        </div>

        <hr className="border-[var(--border)]" />

        {/* What's included */}
        <div className="space-y-3">
          <p className="text-sm font-semibold text-[var(--text-primary)]">
            What&apos;s included:
          </p>
          <ul className="space-y-2">
            {included.map((item) => (
              <li key={item} className="flex items-center gap-2.5 text-sm text-[var(--text-secondary)]">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--secondary)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                {item}
              </li>
            ))}
          </ul>
        </div>

        <Button onClick={onPay} size="lg" className="w-full">
          Pay $500 NZD &amp; Go Live
        </Button>

        <p className="text-xs text-center text-[var(--text-muted)]">
          Secure checkout. Your website will be live within minutes.
        </p>
      </Card>

      <div className="flex justify-center">
        <Button variant="ghost" onClick={onBack}>
          Back to preview
        </Button>
      </div>
    </div>
  );
}
