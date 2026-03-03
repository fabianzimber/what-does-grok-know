import { Footer } from "@/components/layout/footer";
import { FloatingOrbs } from "@/components/shared/floating-orbs";
import Link from "next/link";

export default function InfoLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col relative">
      <FloatingOrbs />
      <header className="sticky top-0 z-20 glass-deep border-b border-brand-border/30">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center gap-3">
          <Link
            href="/"
            className="text-sm text-brand-muted hover:text-brand-primary transition-colors flex items-center gap-1"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M10 12L6 8L10 4"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Back
          </Link>
          <span className="text-sm font-medium text-brand-text">What Does Grok Know?</span>
        </div>
      </header>
      <main className="flex-1 w-full max-w-4xl mx-auto px-4 py-8">{children}</main>
      <Footer />
    </div>
  );
}
