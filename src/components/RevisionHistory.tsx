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
              className={`group relative flex shrink-0 flex-col items-center gap-1 rounded-lg border-2 p-1 transition ${
                isActive ? "border-brand-accent" : "border-transparent hover:border-neutral-300"
              }`}
              title={rev.userRequest ?? "Originele upload"}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={rev.imageDataUrl}
                alt={rev.label}
                className="h-20 w-28 rounded-md object-cover ring-1 ring-neutral-200"
              />
              <span
                className={`text-xs ${isActive ? "font-semibold text-neutral-900" : "text-neutral-600"}`}
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
        className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-neutral-200 bg-white px-3 py-2 text-xs text-neutral-600 hover:border-red-200 hover:bg-red-50 hover:text-red-700"
        title="Sessie wissen"
      >
        <Trash2 className="h-3.5 w-3.5" />
        Wissen
      </button>
    </div>
  );
}
