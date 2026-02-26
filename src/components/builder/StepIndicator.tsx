"use client";

interface StepIndicatorProps {
  currentStep: 1 | 2 | 3 | 4;
}

const steps = [
  { num: 1, label: "Pick a Style" },
  { num: 2, label: "Your Business" },
  { num: 3, label: "Preview" },
  { num: 4, label: "Go Live" },
];

export default function StepIndicator({ currentStep }: StepIndicatorProps) {
  return (
    <div className="w-full max-w-2xl mx-auto px-4">
      <div className="flex items-center justify-between">
        {steps.map((step, i) => {
          const isCompleted = step.num < currentStep;
          const isCurrent = step.num === currentStep;

          return (
            <div key={step.num} className="flex items-center flex-1 last:flex-initial">
              {/* Step circle */}
              <div className="flex flex-col items-center gap-1.5">
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-[var(--transition-base)] ${
                    isCompleted
                      ? "bg-[var(--secondary)] text-white"
                      : isCurrent
                        ? "bg-[var(--accent)] text-white shadow-[0_2px_8px_rgba(181,117,58,0.3)]"
                        : "bg-[var(--bg-warm)] text-[var(--text-muted)]"
                  }`}
                >
                  {isCompleted ? (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  ) : (
                    step.num
                  )}
                </div>
                <span
                  className={`text-xs font-medium whitespace-nowrap hidden sm:block ${
                    isCurrent
                      ? "text-[var(--accent)]"
                      : isCompleted
                        ? "text-[var(--secondary)]"
                        : "text-[var(--text-muted)]"
                  }`}
                >
                  {step.label}
                </span>
              </div>

              {/* Connector line */}
              {i < steps.length - 1 && (
                <div
                  className={`flex-1 h-0.5 mx-3 mt-[-1.25rem] sm:mt-0 rounded-full transition-colors duration-[var(--transition-base)] ${
                    step.num < currentStep
                      ? "bg-[var(--secondary)]"
                      : "bg-[var(--border)]"
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
