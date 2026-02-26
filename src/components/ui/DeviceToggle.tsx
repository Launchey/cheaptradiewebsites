"use client";

type Device = "desktop" | "tablet" | "mobile";

interface DeviceToggleProps {
  active: Device;
  onChange: (device: Device) => void;
}

const devices: { value: Device; label: string; icon: React.ReactNode; width: string }[] = [
  {
    value: "desktop",
    label: "Desktop",
    width: "1280px",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
        <line x1="8" y1="21" x2="16" y2="21" />
        <line x1="12" y1="17" x2="12" y2="21" />
      </svg>
    ),
  },
  {
    value: "tablet",
    label: "Tablet",
    width: "768px",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="4" y="2" width="16" height="20" rx="2" ry="2" />
        <line x1="12" y1="18" x2="12" y2="18" />
      </svg>
    ),
  },
  {
    value: "mobile",
    label: "Mobile",
    width: "375px",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
        <line x1="12" y1="18" x2="12" y2="18" />
      </svg>
    ),
  },
];

export default function DeviceToggle({ active, onChange }: DeviceToggleProps) {
  return (
    <div className="inline-flex items-center gap-1 bg-[var(--bg-warm)] rounded-[var(--radius-md)] p-1">
      {devices.map((device) => (
        <button
          key={device.value}
          onClick={() => onChange(device.value)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-[var(--radius-sm)] text-sm font-medium transition-all duration-[var(--transition-fast)] cursor-pointer ${
            active === device.value
              ? "bg-white text-[var(--text-primary)] shadow-[var(--shadow-sm)]"
              : "text-[var(--text-muted)] hover:text-[var(--text-secondary)]"
          }`}
          title={`${device.label} (${device.width})`}
        >
          {device.icon}
          <span className="hidden sm:inline">{device.label}</span>
        </button>
      ))}
    </div>
  );
}

export const DEVICE_WIDTHS: Record<Device, number> = {
  desktop: 1280,
  tablet: 768,
  mobile: 375,
};
