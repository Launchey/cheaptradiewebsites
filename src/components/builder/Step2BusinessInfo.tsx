"use client";

import { useState, useEffect } from "react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Textarea from "@/components/ui/Textarea";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { TRADE_TYPES, NZ_REGIONS, SERVICES_BY_TRADE } from "@/lib/constants";
import type { BusinessInfo, TradeType } from "@/lib/types";

interface Step2Props {
  onComplete: (info: BusinessInfo) => void;
  onBack: () => void;
  prefill?: Partial<BusinessInfo>;
  isLoading?: boolean;
}

interface FormErrors {
  businessName?: string;
  tradeType?: string;
  location?: string;
  region?: string;
  phone?: string;
  email?: string;
  services?: string;
  aboutText?: string;
}

export default function Step2BusinessInfo({
  onComplete,
  onBack,
  prefill,
  isLoading,
}: Step2Props) {
  const [form, setForm] = useState<Partial<BusinessInfo>>({
    businessName: "",
    tradeType: undefined,
    location: "",
    region: "",
    phone: "",
    email: "",
    services: [],
    aboutText: "",
    tagline: "",
    ...prefill,
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [availableServices, setAvailableServices] = useState<string[]>([]);

  useEffect(() => {
    if (form.tradeType) {
      setAvailableServices(SERVICES_BY_TRADE[form.tradeType as TradeType] || []);
    }
  }, [form.tradeType]);

  function updateField<K extends keyof BusinessInfo>(
    key: K,
    value: BusinessInfo[K]
  ) {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  }

  function toggleService(service: string) {
    const current = form.services || [];
    const updated = current.includes(service)
      ? current.filter((s) => s !== service)
      : [...current, service];
    updateField("services", updated);
  }

  function validate(): boolean {
    const errs: FormErrors = {};

    if (!form.businessName?.trim()) errs.businessName = "Business name is required";
    if (!form.tradeType) errs.tradeType = "Please select your trade type";
    if (!form.location?.trim()) errs.location = "Location is required";
    if (!form.region) errs.region = "Please select your region";
    if (!form.phone?.trim()) errs.phone = "Phone number is required";
    if (!form.email?.trim()) {
      errs.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      errs.email = "Please enter a valid email address";
    }
    if (!form.services?.length) errs.services = "Please select at least one service";
    if (!form.aboutText?.trim()) errs.aboutText = "Please tell us a bit about your business";

    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  function handleSubmit() {
    if (validate()) {
      onComplete(form as BusinessInfo);
    }
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <LoadingSpinner size="lg" message="Building your website..." />
        <p className="text-sm text-[var(--text-muted)] max-w-md text-center">
          We&apos;re designing a professional website tailored to your business. This usually takes about 30 seconds.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div className="text-center space-y-2">
        <h2 className="text-2xl md:text-3xl font-[var(--font-heading)] text-[var(--text-primary)]">
          Tell us about your business
        </h2>
        <p className="text-[var(--text-secondary)]">
          This takes about 2 minutes. We&apos;ll use this to build your website.
        </p>
      </div>

      <div className="space-y-5">
        <Input
          label="Business Name"
          value={form.businessName || ""}
          onChange={(e) => updateField("businessName", e.target.value)}
          placeholder="e.g. Smith Plumbing Ltd"
          error={errors.businessName}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <Select
            label="Trade Type"
            value={form.tradeType || ""}
            onChange={(e) => updateField("tradeType", e.target.value as TradeType)}
            options={TRADE_TYPES}
            placeholder="Select your trade"
            error={errors.tradeType}
          />

          <Select
            label="Region"
            value={form.region || ""}
            onChange={(e) => updateField("region", e.target.value)}
            options={NZ_REGIONS.map((r) => ({ value: r, label: r }))}
            placeholder="Select your region"
            error={errors.region}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <Input
            label="Location / Town"
            value={form.location || ""}
            onChange={(e) => updateField("location", e.target.value)}
            placeholder="e.g. Tauranga"
            error={errors.location}
          />

          <Input
            label="Phone Number"
            type="tel"
            value={form.phone || ""}
            onChange={(e) => updateField("phone", e.target.value)}
            placeholder="e.g. 027 123 4567"
            error={errors.phone}
          />
        </div>

        <Input
          label="Email Address"
          type="email"
          value={form.email || ""}
          onChange={(e) => updateField("email", e.target.value)}
          placeholder="e.g. info@smithplumbing.co.nz"
          error={errors.email}
        />

        {/* Services checkboxes */}
        {form.tradeType && availableServices.length > 0 && (
          <div className="space-y-2">
            <label className="text-sm font-medium text-[var(--text-primary)]">
              Services You Offer
            </label>
            <div className="grid grid-cols-2 gap-2">
              {availableServices.map((service) => (
                <label
                  key={service}
                  className={`flex items-center gap-2.5 px-3 py-2.5 rounded-[var(--radius-md)] border cursor-pointer transition-all duration-[var(--transition-fast)] text-sm ${
                    form.services?.includes(service)
                      ? "border-[var(--accent)] bg-[var(--accent-light)] text-[var(--accent)]"
                      : "border-[var(--border)] hover:border-[var(--text-muted)] text-[var(--text-secondary)]"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={form.services?.includes(service) || false}
                    onChange={() => toggleService(service)}
                    className="sr-only"
                  />
                  <div
                    className={`w-4 h-4 rounded border-2 flex items-center justify-center shrink-0 ${
                      form.services?.includes(service)
                        ? "bg-[var(--accent)] border-[var(--accent)]"
                        : "border-[var(--border)]"
                    }`}
                  >
                    {form.services?.includes(service) && (
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    )}
                  </div>
                  {service}
                </label>
              ))}
            </div>
            {errors.services && (
              <p className="text-sm text-red-500">{errors.services}</p>
            )}
          </div>
        )}

        <Textarea
          label="About Your Business"
          value={form.aboutText || ""}
          onChange={(e) => updateField("aboutText", e.target.value)}
          placeholder="Tell us a bit about your business — how long you've been going, what you're known for, what area you cover..."
          error={errors.aboutText}
          rows={4}
        />

        <Input
          label="Tagline (optional)"
          value={form.tagline || ""}
          onChange={(e) => updateField("tagline", e.target.value)}
          placeholder="e.g. Quality builds, honest prices"
          helperText="A short phrase that captures what you're about"
        />
      </div>

      <div className="flex justify-between items-center pt-4">
        <Button variant="ghost" onClick={onBack}>
          Back
        </Button>
        <Button onClick={handleSubmit} size="lg">
          Build My Website
        </Button>
      </div>
    </div>
  );
}
