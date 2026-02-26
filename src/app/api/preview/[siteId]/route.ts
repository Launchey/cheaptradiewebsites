import { NextResponse } from "next/server";
import { getSite } from "@/lib/storage";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ siteId: string }> }
) {
  const { siteId } = await params;
  const site = getSite(siteId);

  if (!site) {
    const html404 = `<!DOCTYPE html>
<html lang="en-NZ">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Preview Not Found</title>
  <style>
    body { font-family: 'Outfit', system-ui, sans-serif; display: flex; align-items: center; justify-content: center; min-height: 100vh; margin: 0; background: #FAF8F5; color: #2A2A2A; }
    .container { text-align: center; padding: 2rem; }
    h1 { font-family: 'DM Serif Display', serif; font-size: 2rem; margin-bottom: 0.5rem; }
    p { color: #6B6560; }
  </style>
</head>
<body>
  <div class="container">
    <h1>Preview Not Found</h1>
    <p>This preview may have expired. Head back and generate a new one.</p>
  </div>
</body>
</html>`;

    return new NextResponse(html404, {
      status: 404,
      headers: {
        "Content-Type": "text/html; charset=utf-8",
        "X-Frame-Options": "SAMEORIGIN",
      },
    });
  }

  return new NextResponse(site.html, {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "X-Frame-Options": "SAMEORIGIN",
      "Cache-Control": "no-store",
    },
  });
}
