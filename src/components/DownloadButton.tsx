"use client";

import { Download } from "lucide-react";
import type { Revision } from "@/types";

type Props = {
  revision: Revision | null;
};

export function DownloadButton({ revision }: Props) {
  const handleDownload = () => {
    if (!revision) return;
    const a = document.createElement("a");
    a.href = revision.imageDataUrl;
    const safeLabel = revision.label.toLowerCase().replace(/\s+/g, "-");
    a.download = `${safeLabel}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <button
      onClick={handleDownload}
      disabled={!revision}
      className="inline-flex items-center gap-2 rounded-full border border-brand-line bg-white px-4 py-2 text-sm font-medium text-brand shadow-sm hover:bg-brand-surface disabled:cursor-not-allowed disabled:opacity-50"
    >
      <Download className="h-4 w-4" />
      Download
    </button>
  );
}
