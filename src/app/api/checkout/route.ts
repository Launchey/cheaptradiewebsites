import { NextResponse } from "next/server";
import { z } from "zod";
import { getSite, updateSiteStatus } from "@/lib/storage";

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

    // Placeholder: simulate payment success
    // TODO: Connect real payment provider (Stripe, LemonSqueezy, etc.)
    updateSiteStatus(siteId, "paid");

    return NextResponse.json({
      success: true,
      siteId,
      message: "Payment successful! Your website is being deployed.",
    });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json(
        { error: err.issues[0].message },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Something went wrong with the checkout. Please try again." },
      { status: 500 }
    );
  }
}
