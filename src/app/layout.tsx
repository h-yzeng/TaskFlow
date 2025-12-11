import "./globals.css";
import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { ThemeProvider, SessionProvider } from "@/components/providers";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Header } from "@/components/layout";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: {
    default: "TaskFlow - Modern Task Management",
    template: "%s | TaskFlow",
  },
  description:
    "A modern, feature-rich task management application built with Next.js",
  keywords: ["task manager", "productivity", "todo", "project management"],
  authors: [{ name: "TaskFlow Team" }],
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} font-sans antialiased min-h-screen bg-background text-foreground`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <SessionProvider>
            <TooltipProvider delayDuration={0}>
              <div className="relative flex min-h-screen flex-col">
                <Header />
                <main className="flex-1">{children}</main>
                <footer className="border-t py-6">
                  <div className="container max-w-7xl mx-auto flex items-center justify-center px-4 md:px-6">
                    <p className="text-center text-sm text-muted-foreground">
                      © {new Date().getFullYear()} TaskFlow. Built with Next.js.
                    </p>
                  </div>
                </footer>
              </div>
            </TooltipProvider>
          </SessionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}