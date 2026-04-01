import type { Metadata } from "next";

import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { Providers } from "@/components/providers/Providers";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import "./globals.css";

export const metadata: Metadata = {
  title: "LedgerBloom",
  description:
    "A polished finance dashboard built with Next.js, shadcn/ui, Zustand, and Recharts.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-background font-sans text-foreground antialiased">
        <Providers>
          <SidebarProvider defaultOpen>
            <Sidebar />
            <SidebarInset className="min-h-screen">
              <Header />
              <div className="flex flex-1 flex-col px-4 pb-4 md:px-6 md:pb-6">
                <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col">
                  {children}
                </div>
              </div>
            </SidebarInset>
          </SidebarProvider>
        </Providers>
      </body>
    </html>
  );
}
