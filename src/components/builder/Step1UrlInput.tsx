"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { TEMPLATE_PRESETS } from "@/lib/constants";
import type { ExtractedDesignTokens, BusinessInfo } from "@/lib/types";

interface Step1Props {
  onComplete: (
    designTokens: ExtractedDesignTokens,
    prefill?: Partial<BusinessInfo>
  ) => void;
  initialUrl?: string;
}

export default function Step1UrlInput({ onComplete, initialUrl = "" }: Step1Props) {
  const [referenceUrl, setReferenceUrl] = useState(initialUrl);
  const [existingUrl, setExistingUrl] = useState("");
  const [isAnalysing, setIsAnalysing] = useState(false);
  const [isExtracting, setIsExtracting] = useState(false);
  const [error, setError] = useState("");

  async function handleAnalyse() {
    if (!referenceUrl) {
      setError("Please enter a website address or choose a template below");
      return;
    }

    // Auto-add https:// if missing
    let url = referenceUrl.trim();
    if (!/^https?:\/\//i.test(url)) {
      url = "https://" + url;
      setReferenceUrl(url);
    }

    setError("");
    setIsAnalysing(true);

    try {
      const analyseRes = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });

      const tokens = await analyseRes.json();
      if (tokens.error) {
        setError(tokens.error);
        setIsAnalysing(false);
        return;
      }

      // If they also have an existing website, extract from it
      let prefill: Partial<BusinessInfo> | undefined;
      if (existingUrl) {
        let extUrl = existingUrl.trim();
        if (!/^https?:\/\//i.test(extUrl)) {
          extUrl = "https://" + extUrl;
          setExistingUrl(extUrl);
        }
        setIsExtracting(true);
        try {
          const extractRes = await fetch("/api/extract", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ url: extUrl }),
          });
          const extracted = await extractRes.json();
          prefill = extracted.businessInfo;
        } catch {
          // Extraction is optional — don't block the flow
        }
        setIsExtracting(false);
      }

      onComplete(tokens, prefill);
    } catch {
      setError("Something went wrong. Please check the address and try again.");
    } finally {
      setIsAnalysing(false);
    }
  }

  function handleTemplateClick(templateKey: string) {
    const preset = TEMPLATE_PRESETS[templateKey];
    if (preset) {
      onComplete(preset.designTokens);
    }
  }

  if (isAnalysing || isExtracting) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <LoadingSpinner
          size="lg"
          message={
            isExtracting
              ? "Importing your website content..."
              : "Analysing the design..."
          }
        />
        <p className="text-sm text-[var(--text-muted)] max-w-md text-center">
          {isExtracting
            ? "We're pulling in your existing content to save you time."
            : "We're studying the colours, fonts, and layout style of that website."}
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-10">
      {/* Reference URL */}
      <div className="space-y-4">
        <div className="text-center space-y-2">
          <h2 className="text-2xl md:text-3xl font-[var(--font-heading)] text-[var(--text-primary)]">
            Pick a style you like
          </h2>
          <p className="text-[var(--text-secondary)]">
            Paste a website you like the look of, or choose one of our templates below.
          </p>
        </div>

        <div className="flex gap-3">
          <div className="flex-1 relative">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <line x1="2" y1="12" x2="22" y2="12" />
                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
              </svg>
            </div>
            <input
              type="url"
              value={referenceUrl}
              onChange={(e) => setReferenceUrl(e.target.value)}
              placeholder="https://example.com"
              className="w-full pl-11 pr-4 py-3 rounded-[var(--radius-md)] border border-[var(--border)] focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent-light)] outline-none transition-all duration-[var(--transition-fast)] font-[var(--font-body)] text-[var(--text-primary)] placeholder:text-[var(--text-muted)]"
            />
          </div>
          <Button onClick={handleAnalyse} size="md">
            Analyse This Design
          </Button>
        </div>

        {error && (
          <p className="text-sm text-red-500 text-center">{error}</p>
        )}
      </div>

      {/* Existing website URL */}
      <div className="space-y-2">
        <Input
          label="Already have a website? Paste the URL here (optional)"
          value={existingUrl}
          onChange={(e) => setExistingUrl(e.target.value)}
          placeholder="https://yourbusiness.co.nz"
          helperText="We'll pull in your existing content to save you time filling in the form."
        />
      </div>

      {/* Divider */}
      <div className="flex items-center gap-4">
        <div className="flex-1 h-px bg-[var(--border)]" />
        <span className="text-sm text-[var(--text-muted)] font-medium">
          Or browse our tradie templates
        </span>
        <div className="flex-1 h-px bg-[var(--border)]" />
      </div>

      {/* Template gallery */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {Object.entries(TEMPLATE_PRESETS).map(([key, preset]) => (
          <button
            key={key}
            onClick={() => handleTemplateClick(key)}
            className="group bg-[var(--bg-card)] border border-[var(--border)] rounded-[var(--radius-lg)] p-4 text-left hover:border-[var(--accent)] hover:shadow-[var(--shadow-md)] transition-all duration-[var(--transition-base)] cursor-pointer"
          >
            {/* Colour preview */}
            <div className="flex gap-1.5 mb-3">
              {Object.values(preset.designTokens.colors)
                .slice(0, 3)
                .map((color, i) => (
                  <div
                    key={i}
                    className="w-6 h-6 rounded-full border border-[var(--border)]"
                    style={{ backgroundColor: color }}
                  />
                ))}
            </div>
            <p className="font-semibold text-[var(--text-primary)] group-hover:text-[var(--accent)] transition-colors text-sm">
              {preset.label}
            </p>
            <p className="text-xs text-[var(--text-muted)] capitalize mt-0.5">
              {key} template
            </p>
          </button>
        ))}
      </div>
    </div>
  );
}
