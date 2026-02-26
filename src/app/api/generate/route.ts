import { NextResponse } from "next/server";
import { z } from "zod";
import { createGenerateStream } from "@/lib/claude";
import { saveSite } from "@/lib/storage";
import { generateSiteId } from "@/lib/utils";
import type { BusinessInfo, ExtractedDesignTokens } from "@/lib/types";

const businessInfoSchema = z.object({
  businessName: z.string().min(1, "Business name is required"),
  tradeType: z.string().min(1),
  location: z.string().min(1, "Location is required"),
  region: z.string().min(1, "Region is required"),
  phone: z.string().min(1, "Phone number is required"),
  email: z.string().email("Please enter a valid email"),
  services: z.array(z.string()).min(1, "Please select at least one service"),
  aboutText: z.string().min(1, "Please tell us about your business"),
  tagline: z.string().optional(),
  yearsExperience: z.number().optional(),
});

const designTokensSchema = z.object({
  colors: z.object({
    primary: z.string(),
    secondary: z.string(),
    accent: z.string(),
    background: z.string(),
    text: z.string(),
  }),
  fonts: z.object({ heading: z.string(), body: z.string() }),
  style: z.enum(["minimal", "bold", "warm", "dark", "corporate", "rustic"]),
  layoutPatterns: z.array(z.string()),
});

const schema = z.object({
  businessInfo: businessInfoSchema,
  designTokens: designTokensSchema,
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { businessInfo, designTokens } = schema.parse(body);

    const siteId = generateSiteId();

    // Stream the response
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        try {
          const messageStream = createGenerateStream(
            businessInfo as BusinessInfo,
            designTokens as ExtractedDesignTokens
          );

          let fullHtml = "";

          messageStream.on("text", (text) => {
            fullHtml += text;
            controller.enqueue(
              encoder.encode(`data: ${JSON.stringify({ type: "chunk", text })}\n\n`)
            );
          });

          await messageStream.finalMessage();

          // Store the generated site
          saveSite({
            id: siteId,
            html: fullHtml,
            businessInfo: businessInfo as BusinessInfo,
            designTokens: designTokens as ExtractedDesignTokens,
            createdAt: new Date().toISOString(),
            status: "preview",
          });

          controller.enqueue(
            encoder.encode(
              `data: ${JSON.stringify({
                type: "complete",
                siteId,
                previewUrl: `/api/preview/${siteId}`,
              })}\n\n`
            )
          );

          controller.close();
        } catch (err) {
          controller.enqueue(
            encoder.encode(
              `data: ${JSON.stringify({
                type: "error",
                error: "Something went wrong building your website. Please try again.",
              })}\n\n`
            )
          );
          controller.close();
          console.error("Generation error:", err);
        }
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json(
        { error: err.issues.map((e) => e.message).join(", ") },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
