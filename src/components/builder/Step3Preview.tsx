"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";
import DeviceToggle, { DEVICE_WIDTHS } from "@/components/ui/DeviceToggle";
import Textarea from "@/components/ui/Textarea";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

type Device = "desktop" | "tablet" | "mobile";

interface Step3Props {
  siteId: string;
  previewUrl: string;
  onGetWebsite: () => void;
  onRequestChanges: (feedback: string) => void;
  onStartOver: () => void;
  isRegenerating?: boolean;
}

export default function Step3Preview({
  siteId,
  previewUrl,
  onGetWebsite,
  onRequestChanges,
  onStartOver,
  isRegenerating,
}: Step3Props) {
  const [device, setDevice] = useState<Device>("desktop");
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedback, setFeedback] = useState("");

  if (isRegenerating) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <LoadingSpinner size="lg" message="Making your changes..." />
        <p className="text-sm text-[var(--text-muted)] max-w-md text-center">
          We&apos;re updating your website with the tweaks you requested.
        </p>
      </div>
    );
  }

  function handleSubmitFeedback() {
    if (feedback.trim()) {
      onRequestChanges(feedback.trim());
      setFeedback("");
      setShowFeedback(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl md:text-3xl font-[var(--font-heading)] text-[var(--text-primary)]">
          Here&apos;s your website
        </h2>
        <p className="text-[var(--text-secondary)]">
          Have a look around — check it on different screen sizes. Happy with it?
        </p>
      </div>

      {/* Device toggle */}
      <div className="flex justify-center">
        <DeviceToggle active={device} onChange={setDevice} />
      </div>

      {/* Preview iframe */}
      <div className="flex justify-center">
        <div
          className="border border-[var(--border)] rounded-[var(--radius-lg)] overflow-hidden shadow-[var(--shadow-lg)] bg-white transition-all duration-500 ease-in-out"
          style={{
            width: `min(${DEVICE_WIDTHS[device]}px, 100%)`,
            height: device === "mobile" ? "700px" : "600px",
          }}
        >
          <iframe
            key={siteId}
            src={previewUrl}
            className="w-full h-full border-0"
            title="Website preview"
          />
        </div>
      </div>

      {/* Actions */}
      <div className="max-w-xl mx-auto space-y-4">
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button onClick={onGetWebsite} size="lg">
            Get This Website — $500 NZD
          </Button>
          <Button
            variant="outline"
            onClick={() => setShowFeedback(!showFeedback)}
          >
            Want changes? Tell us what to tweak
          </Button>
        </div>

        {showFeedback && (
          <div className="space-y-3 p-4 bg-[var(--bg-warm)] rounded-[var(--radius-lg)]">
            <Textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="e.g. Make the hero section darker, change the phone number to be bigger, add more photos..."
              rows={3}
            />
            <div className="flex justify-end gap-2">
              <Button variant="ghost" size="sm" onClick={() => setShowFeedback(false)}>
                Cancel
              </Button>
              <Button size="sm" onClick={handleSubmitFeedback}>
                Apply Changes
              </Button>
            </div>
          </div>
        )}

        <div className="text-center">
          <button
            onClick={onStartOver}
            className="text-sm text-[var(--text-muted)] hover:text-[var(--text-secondary)] underline underline-offset-2 cursor-pointer"
          >
            Start over with a different design
          </button>
        </div>
      </div>
    </div>
  );
}
