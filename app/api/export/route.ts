import { getServerSession } from "next-auth";
import type { NextRequest } from "next/server";
import { authOptions } from "@/lib/auth";
import { getBrowser } from "@/lib/pdf";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return new Response("Unauthorized", { status: 401 });
  }

  const origin = request.nextUrl.origin;
  const query = request.nextUrl.searchParams.toString();
  const exportUrl = `${origin}/export${query ? `?${query}` : ""}`;
  const cookie = request.headers.get("cookie") ?? "";

  let browser;
  try {
    browser = await getBrowser();
    const page = await browser.newPage();
    await page.setViewport({ width: 816, height: 1056, deviceScaleFactor: 2 });
    // Forward the caller's session so the guarded /export page renders.
    if (cookie) await page.setExtraHTTPHeaders({ cookie });
    await page.goto(exportUrl, { waitUntil: "networkidle0", timeout: 45000 });
    await page.waitForSelector(".export-ready", { timeout: 15000 });
    await page.evaluate(async () => {
      await (document as Document).fonts.ready;
    });
    const pdf = await page.pdf({
      format: "letter",
      printBackground: true,
      margin: { top: "0", right: "0", bottom: "0", left: "0" },
    });

    const date = new Date().toISOString().slice(0, 10);
    return new Response(Buffer.from(pdf), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="hitch-benchmark-${date}.pdf"`,
      },
    });
  } catch (err) {
    console.error("PDF export failed:", err);
    return new Response("Export failed", { status: 500 });
  } finally {
    if (browser) await browser.close();
  }
}
