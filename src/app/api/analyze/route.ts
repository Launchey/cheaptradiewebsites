import { NextResponse } from "next/server";
import { z } from "zod";
import { analyzeDesignWithClaude } from "@/lib/claude";
import type { ExtractedDesignTokens } from "@/lib/types";

const schema = z.object({
  url: z.string().url("Please enter a valid website address"),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { url } = schema.parse(body);

    // Fetch the reference website
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);

    let html: string;
    try {
      const res = await fetch(url, {
        signal: controller.signal,
        headers: {
          "User-Agent":
            "Mozilla/5.0 (compatible; CheapTradieWebsites/1.0)",
        },
      });
      html = await res.text();
    } catch {
      return NextResponse.json(
        { error: "We couldn't reach that website. Please check the address and try again." },
        { status: 400 }
      );
    } finally {
      clearTimeout(timeout);
    }

    // Use Claude to intelligently extract design tokens
    let tokens: ExtractedDesignTokens;
    try {
      tokens = await analyzeDesignWithClaude(html, url);
    } catch {
      // Fall back to basic regex extraction if Claude fails
      tokens = extractDesignTokensFallback(html);
    }

    return NextResponse.json(tokens);
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json(
        { error: err.issues[0].message },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Something went wrong analysing that website. Please try again." },
      { status: 500 }
    );
  }
}

/**
 * Fallback regex-based extraction if Claude API is unavailable.
 */
function extractDesignTokensFallback(html: string): ExtractedDesignTokens {
  const colorRegex = /#[0-9A-Fa-f]{3,8}|rgba?\([^)]+\)|hsla?\([^)]+\)/g;
  const colors = html.match(colorRegex) || [];

  const colorFreq = new Map<string, number>();
  for (const c of colors) {
    const normalized = c.toLowerCase().trim();
    colorFreq.set(normalized, (colorFreq.get(normalized) || 0) + 1);
  }

  const defaults = new Set(["#000", "#000000", "#fff", "#ffffff", "#333", "#333333", "#666", "#999", "#ccc", "#eee", "#f5f5f5", "rgba(0,0,0,0)", "rgba(0, 0, 0, 0)"]);
  const sorted = [...colorFreq.entries()]
    .filter(([c]) => !defaults.has(c))
    .sort((a, b) => b[1] - a[1])
    .map(([c]) => c);

  const fontRegex = /font-family:\s*(['"]?)([\w\s,-]+)\1/gi;
  const fonts: string[] = [];
  let match;
  while ((match = fontRegex.exec(html)) !== null) {
    const font = match[2].split(",")[0].trim().replace(/['"]/g, "");
    if (font && !fonts.includes(font) && !["inherit", "initial", "sans-serif", "serif", "monospace"].includes(font.toLowerCase())) {
      fonts.push(font);
    }
  }

  return {
    colors: {
      primary: sorted[0] || "#2C3E50",
      secondary: sorted[1] || "#E67E22",
      accent: sorted[2] || "#F39C12",
      background: sorted[3] || "#FAFAFA",
      text: sorted[4] || "#2C3E50",
    },
    fonts: {
      heading: fonts[0] || "Montserrat",
      body: fonts[1] || fonts[0] || "Open Sans",
    },
    style: "minimal",
    layoutPatterns: ["hero-full", "services-grid", "testimonial-cards"],
  };
}
