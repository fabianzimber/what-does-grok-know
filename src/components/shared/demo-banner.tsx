"use client";

import { clearDatabase, isDemoData } from "@/lib/storage/db-queries";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

export function DemoBanner() {
  const router = useRouter();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    isDemoData().then(setVisible);
  }, []);

  const handleImport = useCallback(async () => {
    await clearDatabase();
    router.push("/");
  }, [router]);

  if (!visible) return null;

  return (
    <div className="glass-deep border-b border-brand-accent/20 px-4 py-2 text-center text-sm">
      <span className="text-brand-muted">
        You are viewing <span className="font-medium text-brand-accent">demo data</span>.{" "}
      </span>
      <button
        type="button"
        onClick={handleImport}
        className="underline font-medium text-brand-primary hover:text-brand-primary/80 transition-colors"
      >
        Import your own data
      </button>
    </div>
  );
}
