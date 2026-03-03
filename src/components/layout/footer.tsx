import Link from "next/link";

const footerLinks = [
  { href: "/how-to", label: "How to Get Your Data" },
  { href: "/faq", label: "FAQ" },
  { href: "/privacy-info", label: "Privacy Verification" },
  { href: "/privacy", label: "Datenschutz" },
  { href: "/impressum", label: "Impressum" },
];

export function Footer() {
  return (
    <footer className="w-full border-t border-brand-border/50 mt-auto">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <nav className="flex flex-wrap justify-center gap-x-6 gap-y-2 mb-4">
          {footerLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm text-brand-muted hover:text-brand-primary transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="text-center text-xs text-brand-muted/60">
          <p>
            &copy; {new Date().getFullYear()}{" "}
            <a
              href="https://shiftbloom.studio"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-brand-primary transition-colors"
            >
              shiftbloom studio
            </a>
            . All rights reserved.
          </p>
          <p className="mt-1">100% client-side &mdash; your data never leaves your browser.</p>
        </div>
      </div>
    </footer>
  );
}
