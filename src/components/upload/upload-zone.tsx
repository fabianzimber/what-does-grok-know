"use client";

import { cn } from "@/lib/utils/format-utils";
import { useCallback, useRef, useState } from "react";

interface UploadZoneProps {
  onFileLoaded: (text: string) => void;
  className?: string;
}

const MAX_FILE_SIZE = 200 * 1024 * 1024; // 200 MB

export function UploadZone({ onFileLoaded, className }: UploadZoneProps) {
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const processFile = useCallback(
    (file: File) => {
      setError(null);

      if (!file.name.endsWith(".json")) {
        setError("Please upload a .json file.");
        return;
      }

      if (file.size > MAX_FILE_SIZE) {
        setError("File exceeds 200 MB limit.");
        return;
      }

      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === "string") {
          onFileLoaded(reader.result);
        }
      };
      reader.onerror = () => {
        setError("Failed to read file. Please try again.");
      };
      reader.readAsText(file);
    },
    [onFileLoaded],
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setDragging(false);

      const file = e.dataTransfer.files[0];
      if (file) processFile(file);
    },
    [processFile],
  );

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) processFile(file);
    },
    [processFile],
  );

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={() => inputRef.current?.click()}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") inputRef.current?.click();
      }}
      role="button"
      tabIndex={0}
      className={cn(
        "relative flex flex-col items-center justify-center gap-4 p-12 rounded-2xl border-2 border-dashed cursor-pointer transition-all duration-300",
        dragging
          ? "border-brand-primary bg-brand-primary/5 scale-[1.02]"
          : "border-brand-border bg-white/50 hover:border-brand-primary/50 hover:bg-white/70",
        className,
      )}
    >
      <div className="w-16 h-16 rounded-2xl bg-brand-primary/10 flex items-center justify-center">
        <svg
          className="w-8 h-8 text-brand-primary"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.5}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9.75 3.104c-.251.023-.501.05-.75.082m6.75-.082c.251.023.501.05.75.082M3.104 9.75c.023-.251.05-.501.082-.75m-.082 6.75c.023.251.05.501.082.75m17.834-6.75c-.023-.251-.05-.501-.082-.75m.082 6.75c-.023.251-.05.501-.082.75M9.75 20.896c.251.023.501.05.75.082m5.25-.082c.251.023.501.05.75.082"
          />
        </svg>
      </div>

      <div className="text-center">
        <p className="text-lg font-semibold text-brand-text">Drop your grok-chats.json here</p>
        <p className="text-sm text-brand-muted mt-1">or click to browse (max 200 MB)</p>
      </div>

      {error && <p className="text-sm text-brand-primary font-medium">{error}</p>}

      <input ref={inputRef} type="file" accept=".json" onChange={handleChange} className="hidden" />
    </div>
  );
}
