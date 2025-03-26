import type React from "react";
import { Inter } from "next/font/google";
import type { Metadata } from "next";
import { metadata } from "./metadata";
import "./globals.css";
import "../styles/components.css";

import { cn } from "@/lib/utils";
import { SidebarProvider } from "@/components/ui/sidebar";
import { ThemeProvider } from "@/components/theme-provider";
import { AppSidebar } from "@/components/app-sidebar";

const inter = Inter({ subsets: ["latin"] });

export { metadata };

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn("bg-background font-sans antialiased", inter.className)}
      >
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          <SidebarProvider defaultOpen={true}>
            <div className="relative flex min-h-screen">
              <AppSidebar />
              <main className="flex-1">{children}</main>
            </div>
          </SidebarProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
