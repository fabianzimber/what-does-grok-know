"use client";

import { Header } from "@/components/layout/header";
import { MobileNav } from "@/components/layout/mobile-nav";
import { Sidebar } from "@/components/layout/sidebar";
import { AnalysisProvider } from "@/lib/context/analysis-provider";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AnalysisProvider>
      <div className="flex min-h-screen">
        <Sidebar />
        <div className="flex-1 md:ml-64">
          <Header />
          <main className="p-4 pb-20 md:pb-4">{children}</main>
        </div>
        <MobileNav />
      </div>
    </AnalysisProvider>
  );
}
