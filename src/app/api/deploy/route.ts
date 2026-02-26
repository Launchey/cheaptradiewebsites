import { NextResponse } from "next/server";
import { z } from "zod";
import { getSite, updateSiteStatus } from "@/lib/storage";
import { deploySite } from "@/lib/vercel-deploy";

const schema = z.object({
  siteId: z.string().min(1),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { siteId } = schema.parse(body);

    const site = getSite(siteId);
    if (!site) {
      return NextResponse.json(
        { error: "Website not found. Please try generating it again." },
        { status: 404 }
      );
    }

    // Allow bypass for development, but check paid status in production
    if (site.status !== "paid" && process.env.NODE_ENV === "production") {
      return NextResponse.json(
        { error: "Payment required before deployment." },
        { status: 403 }
      );
    }

    const deployedUrl = await deploySite(
      siteId,
      site.html,
      site.businessInfo.businessName
    );

    updateSiteStatus(siteId, "deployed", deployedUrl);

    return NextResponse.json({ deployedUrl });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json(
        { error: err.issues[0].message },
        { status: 400 }
      );
    }

    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("Deploy error:", message);

    return NextResponse.json(
      { error: "Something went wrong deploying your website. Please try again." },
      { status: 500 }
    );
  }
}
