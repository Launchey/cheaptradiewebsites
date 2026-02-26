export function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/['']/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 63);
}

export function formatNZPhone(phone: string): string {
  const digits = phone.replace(/\D/g, "");

  // Handle +64 prefix
  const local = digits.startsWith("64") ? "0" + digits.slice(2) : digits;

  // Mobile: 02X XXX XXXX
  if (/^02\d{7,9}$/.test(local)) {
    const prefix = local.slice(0, 3);
    const rest = local.slice(3);
    if (rest.length <= 3) return `${prefix} ${rest}`;
    return `${prefix} ${rest.slice(0, 3)} ${rest.slice(3)}`;
  }

  // Landline: 0X XXX XXXX
  if (/^0\d{8,9}$/.test(local)) {
    const prefix = local.slice(0, 2);
    const rest = local.slice(2);
    return `${prefix} ${rest.slice(0, 3)} ${rest.slice(3)}`;
  }

  return phone;
}

export function generateSiteId(): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).slice(2, 8);
  return `site-${timestamp}-${random}`;
}
