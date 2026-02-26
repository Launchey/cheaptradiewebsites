import type { GeneratedSite } from "./types";

// In-memory storage for MVP
// TODO: Replace with Vercel KV or a database for production persistence
const sites = new Map<string, GeneratedSite>();

const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;

function cleanExpired() {
  const now = Date.now();
  for (const [id, site] of sites) {
    if (now - new Date(site.createdAt).getTime() > SEVEN_DAYS_MS) {
      sites.delete(id);
    }
  }
}

export function saveSite(site: GeneratedSite): void {
  cleanExpired();
  sites.set(site.id, site);
}

export function getSite(id: string): GeneratedSite | undefined {
  cleanExpired();
  return sites.get(id);
}

export function updateSiteStatus(
  id: string,
  status: GeneratedSite["status"],
  deployedUrl?: string
): void {
  const site = sites.get(id);
  if (site) {
    site.status = status;
    if (deployedUrl) site.deployedUrl = deployedUrl;
    sites.set(id, site);
  }
}
