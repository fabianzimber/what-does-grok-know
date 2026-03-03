import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <h1 className="text-6xl font-bold gradient-text mb-4">404</h1>
        <p className="text-brand-muted text-lg mb-8">Page not found</p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-full bg-brand-primary px-6 py-3 text-white font-medium transition-all duration-300 hover:shadow-lg hover:scale-105"
        >
          Go Home
        </Link>
      </div>
    </div>
  );
}
