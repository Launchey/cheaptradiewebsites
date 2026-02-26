"use client";

import { useEffect, useState } from "react";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";

interface SuccessScreenProps {
  deployedUrl: string;
  businessName: string;
}

export default function SuccessScreen({ deployedUrl, businessName }: SuccessScreenProps) {
  const [showConfetti, setShowConfetti] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowConfetti(false), 5000);
    return () => clearTimeout(timer);
  }, []);

  const shareText = encodeURIComponent(
    `Check out my new website for ${businessName}! ${deployedUrl}`
  );

  return (
    <div className="max-w-lg mx-auto space-y-8 text-center relative">
      {/* Simple confetti effect */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
          {Array.from({ length: 40 }).map((_, i) => (
            <div
              key={i}
              className="absolute animate-bounce"
              style={{
                left: `${Math.random() * 100}%`,
                top: `-${Math.random() * 20}%`,
                animationDuration: `${1.5 + Math.random() * 2}s`,
                animationDelay: `${Math.random() * 1}s`,
                width: "8px",
                height: "8px",
                borderRadius: Math.random() > 0.5 ? "50%" : "0",
                backgroundColor: ["#B5753A", "#6B7F5E", "#F39C12", "#E67E22", "#2C3E50", "#FF5722"][
                  Math.floor(Math.random() * 6)
                ],
                opacity: 0.8,
              }}
            />
          ))}
        </div>
      )}

      {/* Success icon */}
      <div className="mx-auto w-20 h-20 rounded-full bg-[var(--secondary)]/10 flex items-center justify-center">
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--secondary)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
          <polyline points="22 4 12 14.01 9 11.01" />
        </svg>
      </div>

      <div className="space-y-2">
        <h2 className="text-3xl font-[var(--font-heading)] text-[var(--text-primary)]">
          Your website is live!
        </h2>
        <p className="text-[var(--text-secondary)]">
          Congratulations! Your professional website is up and running.
        </p>
      </div>

      {/* Deployed URL */}
      <Card padding="md" className="bg-[var(--bg-warm)]">
        <p className="text-sm text-[var(--text-muted)] mb-1">Your website address:</p>
        <a
          href={deployedUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-lg font-semibold text-[var(--accent)] hover:text-[var(--accent-hover)] break-all"
        >
          {deployedUrl}
        </a>
      </Card>

      {/* Quick actions */}
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Button href={deployedUrl} target="_blank" rel="noopener noreferrer">
          Visit Your Website
        </Button>
        <Button
          variant="outline"
          href={`https://www.facebook.com/sharer/sharer.php?quote=${shareText}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          Share on Facebook
        </Button>
      </div>

      {/* Next steps */}
      <Card padding="md" className="text-left space-y-4">
        <h3 className="font-semibold text-[var(--text-primary)]">What&apos;s next?</h3>
        <ul className="space-y-3">
          <li className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-[var(--accent-light)] flex items-center justify-center shrink-0 mt-0.5">
              <span className="text-xs font-bold text-[var(--accent)]">1</span>
            </div>
            <div>
              <p className="text-sm font-medium text-[var(--text-primary)]">
                Add a custom domain
              </p>
              <p className="text-sm text-[var(--text-muted)]">
                Like yourbusiness.co.nz — makes it look even more professional.
              </p>
            </div>
          </li>
          <li className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-[var(--accent-light)] flex items-center justify-center shrink-0 mt-0.5">
              <span className="text-xs font-bold text-[var(--accent)]">2</span>
            </div>
            <div>
              <p className="text-sm font-medium text-[var(--text-primary)]">
                Update your content anytime
              </p>
              <p className="text-sm text-[var(--text-muted)]">
                Need to change photos, services, or contact details? Just get in touch.
              </p>
            </div>
          </li>
          <li className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-[var(--accent-light)] flex items-center justify-center shrink-0 mt-0.5">
              <span className="text-xs font-bold text-[var(--accent)]">3</span>
            </div>
            <div>
              <p className="text-sm font-medium text-[var(--text-primary)]">
                Tell your mates — they get $50 off
              </p>
              <p className="text-sm text-[var(--text-muted)]">
                Know another tradie who needs a website? Send them our way.
              </p>
            </div>
          </li>
        </ul>
      </Card>
    </div>
  );
}
