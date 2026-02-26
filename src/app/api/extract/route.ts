import { NextResponse } from "next/server";
import { z } from "zod";
import { extractContentWithClaude } from "@/lib/claude";
import type { ExtractedImage } from "@/lib/types";

export const maxDuration = 60; // Multi-page crawl + Sonnet extraction

const schema = z.object({
  url: z.string().url("Please enter a valid website address"),
});

const FETCH_HEADERS = {
  "User-Agent": "Mozilla/5.0 (compatible; CheapTradieWebsites/1.0)",
};

/** Fetch a single page with timeout. Returns null on failure. */
async function fetchPage(url: string, timeoutMs = 10000): Promise<string | null> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, { signal: controller.signal, headers: FETCH_HEADERS });
    if (!res.ok) return null;
    return await res.text();
  } catch {
    return null;
  } finally {
    clearTimeout(timeout);
  }
}

/** Parse nav links from homepage and return internal page URLs. */
function discoverInternalLinks(html: string, baseUrl: string): string[] {
  const base = new URL(baseUrl);
  const seen = new Set<string>([base.pathname.replace(/\/$/, "") || "/"]);
  const links: string[] = [];

  // Match href values from <a> tags inside <nav>, <header>, or common menu patterns
  const linkRegex = /<a[^>]+href=["']([^"'#]+)["'][^>]*>/gi;
  let match;
  while ((match = linkRegex.exec(html)) !== null) {
    try {
      const resolved = new URL(match[1], baseUrl);
      // Only same-origin pages
      if (resolved.origin !== base.origin) continue;
      const path = resolved.pathname.replace(/\/$/, "") || "/";
      if (seen.has(path)) continue;
      // Skip assets, anchors, files
      if (/\.(pdf|jpg|jpeg|png|gif|svg|css|js|zip|doc|mp4)$/i.test(path)) continue;
      seen.add(path);
      links.push(resolved.href);
    } catch {
      continue;
    }
  }

  // Prioritise common tradie pages, cap at 8
  const priority = ["contact", "about", "service", "project", "portfolio", "gallery", "team", "testimonial"];
  links.sort((a, b) => {
    const aP = priority.findIndex((p) => a.toLowerCase().includes(p));
    const bP = priority.findIndex((p) => b.toLowerCase().includes(p));
    return (aP === -1 ? 99 : aP) - (bP === -1 ? 99 : bP);
  });

  return links.slice(0, 8);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { url } = schema.parse(body);

    // 1. Fetch the homepage
    const homepage = await fetchPage(url, 15000);
    if (!homepage) {
      return NextResponse.json(
        {
          businessInfo: {},
          images: [],
          rawText: "",
          services: [],
          testimonials: [],
          socialLinks: [],
          note: "We couldn't reach that website, but no worries — just fill in your details below.",
        },
        { status: 200 }
      );
    }

    // 2. Discover internal links and fetch them in parallel
    const internalLinks = discoverInternalLinks(homepage, url);
    console.log(`[CTW] Extract: found ${internalLinks.length} internal pages:`, internalLinks.map(u => new URL(u).pathname));

    const subPages = await Promise.all(internalLinks.map((link) => fetchPage(link)));
    const pages: { url: string; html: string }[] = [{ url, html: homepage }];
    for (let i = 0; i < internalLinks.length; i++) {
      if (subPages[i]) {
        pages.push({ url: internalLinks[i], html: subPages[i]! });
      }
    }
    console.log(`[CTW] Extract: fetched ${pages.length} pages total`);

    // 3. Extract images from ALL pages
    const allImages: ExtractedImage[] = [];
    const seenSrcs = new Set<string>();
    for (const page of pages) {
      for (const img of extractImages(page.html, page.url)) {
        if (!seenSrcs.has(img.src)) {
          seenSrcs.add(img.src);
          allImages.push(img);
        }
      }
    }

    // 4. Use Claude to extract content from all pages
    try {
      const extracted = await extractContentWithClaude(pages, url, allImages);
      return NextResponse.json(extracted);
    } catch {
      const businessInfo = extractBusinessInfoFallback(homepage);
      const rawText = extractRawText(homepage);
      return NextResponse.json({
        businessInfo,
        images: allImages,
        rawText,
        services: [],
        testimonials: [],
        socialLinks: [],
      });
    }
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

function extractImages(html: string, baseUrl: string): ExtractedImage[] {
  const images: ExtractedImage[] = [];
  const seen = new Set<string>();

  function addImage(src: string, alt: string, type: ExtractedImage["type"]) {
    if (images.length >= 30) return;
    // Skip tiny images, icons, trackers
    if (src.includes("1x1") || src.includes("pixel") || src.includes("tracking") || src.includes("data:image/gif")) return;
    // Resolve relative URLs
    try {
      src = new URL(src, baseUrl).href;
    } catch { return; }
    if (seen.has(src)) return;
    seen.add(src);
    images.push({ src, alt, type });
  }

  // 1. <img> tags
  const imgRegex = /<img[^>]+src=["']([^"']+)["'][^>]*(?:alt=["']([^"']*?)["'])?[^>]*>/gi;
  let match;
  while ((match = imgRegex.exec(html)) !== null) {
    const src = match[1];
    const alt = match[2] || "";
    const lowerAlt = alt.toLowerCase();
    const lowerSrc = src.toLowerCase();
    let type: ExtractedImage["type"] = "other";
    if (lowerAlt.includes("logo") || lowerSrc.includes("logo")) type = "logo";
    else if (lowerAlt.includes("hero") || lowerSrc.includes("hero") || lowerSrc.includes("banner")) type = "hero";
    else if (lowerAlt.includes("team") || lowerSrc.includes("team") || lowerSrc.includes("staff")) type = "team";
    else if (lowerAlt.includes("gallery") || lowerSrc.includes("gallery") || lowerSrc.includes("project")) type = "gallery";
    addImage(src, alt, type);
  }

  // 2. CSS background-image URLs (catches hero images that aren't in <img> tags)
  const bgRegex = /background(?:-image)?:\s*url\(["']?([^"')]+)["']?\)/gi;
  while ((match = bgRegex.exec(html)) !== null) {
    addImage(match[1], "background image", "hero");
  }

  // 3. Squarespace/common CMS data-src and data-image attributes
  const dataSrcRegex = /data-(?:src|image|bg|background)=["']([^"']+)["']/gi;
  while ((match = dataSrcRegex.exec(html)) !== null) {
    if (/\.(jpg|jpeg|png|webp)/i.test(match[1])) {
      addImage(match[1], "image", "other");
    }
  }

  return images;
}

function extractBusinessInfoFallback(html: string): Record<string, string> {
  const info: Record<string, string> = {};

  const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
  if (titleMatch) {
    let title = titleMatch[1].trim();
    title = title.replace(/\s*[-|–]\s*(Home|Welcome|Official).*$/i, "").trim();
    if (title.length > 2 && title.length < 80) {
      info.businessName = title;
    }
  }

  const phoneRegex = /(?:(?:\+?64|0)[- ]?(?:2[0-9]|[3-9])[- ]?\d{3}[- ]?\d{4}|\b0800[- ]?\d{3}[- ]?\d{3}\b)/g;
  const phones = html.match(phoneRegex);
  if (phones?.[0]) info.phone = phones[0].trim();

  const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
  const emails = html.match(emailRegex);
  if (emails?.[0]) info.email = emails[0];

  const metaDescMatch = html.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']+)["']/i);
  if (metaDescMatch) info.aboutText = metaDescMatch[1].trim();

  return info;
}

function extractRawText(html: string): string {
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

  return text.slice(0, 3000);
}
