import { NextResponse } from "next/server";
import { z } from "zod";
import type { BusinessInfo, ExtractedImage } from "@/lib/types";

const schema = z.object({
  url: z.string().url("Please enter a valid website address"),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { url } = schema.parse(body);

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 20000);

    let html: string;
    try {
      const res = await fetch(url, {
        signal: controller.signal,
        headers: {
          "User-Agent": "Mozilla/5.0 (compatible; CheapTradieWebsites/1.0)",
        },
      });
      html = await res.text();
    } catch {
      return NextResponse.json(
        {
          businessInfo: {},
          images: [],
          rawText: "",
          note: "We couldn't reach that website, but no worries — just fill in your details below.",
        },
        { status: 200 }
      );
    } finally {
      clearTimeout(timeout);
    }

    const businessInfo = extractBusinessInfo(html);
    const images = extractImages(html, url);
    const rawText = extractRawText(html);

    return NextResponse.json({ businessInfo, images, rawText });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json(
        { error: err.issues[0].message },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Something went wrong importing that website. Please try again." },
      { status: 500 }
    );
  }
}

function extractBusinessInfo(html: string): Partial<BusinessInfo> {
  const info: Partial<BusinessInfo> = {};

  // Extract title as business name
  const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
  if (titleMatch) {
    let title = titleMatch[1].trim();
    // Remove common suffixes
    title = title.replace(/\s*[-|–]\s*(Home|Welcome|Official).*$/i, "").trim();
    if (title.length > 2 && title.length < 80) {
      info.businessName = title;
    }
  }

  // Extract phone numbers (NZ format)
  const phoneRegex = /(?:(?:\+?64|0)[- ]?(?:2[0-9]|[3-9])[- ]?\d{3}[- ]?\d{4}|\b0800[- ]?\d{3}[- ]?\d{3}\b)/g;
  const phones = html.match(phoneRegex);
  if (phones?.[0]) {
    info.phone = phones[0].trim();
  }

  // Extract email
  const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
  const emails = html.match(emailRegex);
  if (emails?.[0]) {
    info.email = emails[0];
  }

  // Extract meta description as about text
  const metaDescMatch = html.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']+)["']/i);
  if (metaDescMatch) {
    info.aboutText = metaDescMatch[1].trim();
  }

  // Try to extract NZ location references
  const nzLocations = [
    "Auckland", "Wellington", "Christchurch", "Hamilton", "Tauranga",
    "Dunedin", "Napier", "Hastings", "Palmerston North", "Nelson",
    "Rotorua", "New Plymouth", "Whangarei", "Invercargill", "Whanganui",
    "Gisborne", "Blenheim", "Timaru", "Taupo", "Queenstown",
  ];
  for (const loc of nzLocations) {
    if (html.includes(loc)) {
      info.location = loc;
      break;
    }
  }

  return info;
}

function extractImages(html: string, baseUrl: string): ExtractedImage[] {
  const images: ExtractedImage[] = [];
  const imgRegex = /<img[^>]+src=["']([^"']+)["'][^>]*(?:alt=["']([^"']*?)["'])?[^>]*>/gi;
  let match;
  const seen = new Set<string>();

  while ((match = imgRegex.exec(html)) !== null && images.length < 10) {
    let src = match[1];
    const alt = match[2] || "";

    // Skip tiny images, icons, trackers
    if (src.includes("1x1") || src.includes("pixel") || src.includes("tracking") || src.endsWith(".svg") || src.includes("data:image/gif")) {
      continue;
    }

    // Resolve relative URLs
    try {
      src = new URL(src, baseUrl).href;
    } catch {
      continue;
    }

    if (seen.has(src)) continue;
    seen.add(src);

    // Guess image type
    const lowerAlt = alt.toLowerCase();
    const lowerSrc = src.toLowerCase();
    let type: ExtractedImage["type"] = "other";
    if (lowerAlt.includes("logo") || lowerSrc.includes("logo")) type = "logo";
    else if (lowerAlt.includes("hero") || lowerSrc.includes("hero") || lowerSrc.includes("banner")) type = "hero";
    else if (lowerAlt.includes("team") || lowerSrc.includes("team") || lowerSrc.includes("staff")) type = "team";
    else if (lowerAlt.includes("gallery") || lowerSrc.includes("gallery") || lowerSrc.includes("project")) type = "gallery";

    images.push({ src, alt, type });
  }

  return images;
}

function extractRawText(html: string): string {
  // Strip tags and get text content
  const text = html
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "")
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/\s+/g, " ")
    .trim();

  // Return first 2000 chars
  return text.slice(0, 2000);
}
