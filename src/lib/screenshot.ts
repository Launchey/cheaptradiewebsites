/**
 * Server-side screenshot service using Puppeteer.
 * Optional — if puppeteer-core or @sparticuz/chromium are not installed,
 * the import will fail and claude.ts falls back to text-based refinement.
 */
export async function takeScreenshot(
  html: string,
  viewport: { width: number; height: number }
): Promise<string | null> {
  try {
    const chromium = await import("@sparticuz/chromium");
    const puppeteer = await import("puppeteer-core");

    const browser = await puppeteer.default.launch({
      args: chromium.default.args,
      executablePath: await chromium.default.executablePath(),
      headless: true,
    });
    const page = await browser.newPage();
    await page.setViewport(viewport);
    await page.setContent(html, { waitUntil: "networkidle0" });
    const screenshot = await page.screenshot({ encoding: "base64", fullPage: false });
    await browser.close();
    return screenshot as string;
  } catch {
    return null;
  }
}
