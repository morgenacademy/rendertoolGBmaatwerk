"use client";

import type { Revision } from "@/types";
import { Trash2 } from "lucide-react";

type Props = {
  revisions: Revision[];
  activeRevisionId: string | null;
  onSelect: (id: string) => void;
  onClear: () => void;
};

export function RevisionHistory({ revisions, activeRevisionId, onSelect, onClear }: Props) {
  if (revisions.length === 0) return null;

  return (
    <div className="flex items-center gap-3">
      <div className="flex flex-1 gap-3 overflow-x-auto pb-2">
        {revisions.map((rev) => {
          const isActive = rev.id === activeRevisionId;
          return (
            <button
              key={rev.id}
              onClick={() => onSelect(rev.id)}
              className={`group relative flex shrink-0 flex-col items-center gap-1 rounded-2xl border-2 p-1 transition ${
                isActive ? "border-brand" : "border-transparent hover:border-brand-line"
              }`}
              title={rev.userRequest ?? "Originele upload"}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={rev.imageDataUrl}
                alt={rev.label}
                className="h-20 w-28 rounded-xl object-cover ring-1 ring-brand-line"
              />
              <span
                className={`text-xs ${isActive ? "font-semibold text-brand" : "text-brand-muted"}`}
              >
                {rev.label}
              </span>
            </button>
          );
        })}
      </div>
      <button
        onClick={() => {
          if (confirm("Sessie wissen? Alle revisies gaan verloren.")) onClear();
        }}
        className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-brand-line bg-white px-4 py-2 text-xs text-brand-muted hover:border-red-200 hover:bg-red-50 hover:text-red-700"
        title="Sessie wissen"
      >
        <Trash2 className="h-3.5 w-3.5" />
        Wissen
      </button>
    </div>
  );
}
