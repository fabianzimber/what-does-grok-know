"use client";

export function FloatingOrbs() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10" aria-hidden="true">
      <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-gradient-to-br from-brand-primary/25 to-brand-accent/10 blur-3xl animate-float" />
      <div
        className="absolute -top-20 -right-32 w-80 h-80 rounded-full bg-gradient-to-br from-brand-accent/20 to-brand-gold/10 blur-3xl animate-float"
        style={{ animationDelay: "1.5s" }}
      />
      <div
        className="absolute -bottom-32 left-1/3 w-96 h-96 rounded-full bg-gradient-to-br from-brand-gold/15 to-brand-warm/10 blur-3xl animate-float"
        style={{ animationDelay: "3s" }}
      />
      <div
        className="absolute -bottom-40 -right-40 w-72 h-72 rounded-full bg-gradient-to-br from-brand-secondary/20 to-brand-primary/10 blur-3xl animate-float opacity-60"
        style={{ animationDelay: "4.5s" }}
      />
    </div>
  );
}
