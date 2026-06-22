import puppeteer, { type Browser } from "puppeteer-core";
import chromium from "@sparticuz/chromium";

/** Common local Chrome locations for development. */
const LOCAL_CHROME = [
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  "/usr/bin/google-chrome",
  "/usr/bin/chromium-browser",
];

/**
 * Launch a headless browser for PDF rendering. Uses @sparticuz/chromium on
 * Vercel (serverless), and a locally-installed Chrome in development.
 */
export async function getBrowser(): Promise<Browser> {
  if (process.env.VERCEL) {
    return puppeteer.launch({
      args: chromium.args,
      executablePath: await chromium.executablePath(),
      headless: true,
    });
  }
  const executablePath =
    process.env.LOCAL_CHROME_PATH ??
    LOCAL_CHROME.find((p) => p) ??
    LOCAL_CHROME[0];
  return puppeteer.launch({ executablePath, headless: true });
}
