import type { Metadata } from "next";
import "@/styles/globals.css";
import Providers from "@/app/Providers";

export const metadata: Metadata = {
  title: "Hitch Intelligence",
  description: "The Security Leadership Benchmark",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&family=DM+Sans:wght@300;400;500&family=IBM+Plex+Mono:wght@300;400&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <Providers>
          <div style={{ background: "var(--ink)" }}>{children}</div>
        </Providers>
      </body>
    </html>
  );
}
