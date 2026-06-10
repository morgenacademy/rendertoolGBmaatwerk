"use client";

import { useState } from "react";
import { Check, ChevronDown, ChevronRight } from "lucide-react";
import type { Revision } from "@/types";

type Props = {
  revision: Revision | null;
};

export function ChangesPanel({ revision }: Props) {
  const [showPrompt, setShowPrompt] = useState(false);

  if (!revision || !revision.summary) {
    return (
      <div className="rounded-3xl border border-dashed border-brand-line bg-white p-5 text-sm text-brand-muted">
        Nog geen revisie. Geef een wijzigingsverzoek om te starten.
      </div>
    );
  }

  return (
    <div className="rounded-3xl border border-brand-line bg-white p-5 shadow-sm">
      <div className="mb-3 flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-muted">
          {revision.label}
        </span>
      </div>

      <p className="mb-4 text-base font-medium text-brand">{revision.summary}</p>

      {revision.changes.length > 0 && (
        <ul className="space-y-2">
          {revision.changes.map((c, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-neutral-700">
              <Check className="mt-0.5 h-4 w-4 shrink-0 text-brand" />
              <span>{c}</span>
            </li>
          ))}
        </ul>
      )}

      {revision.renderPrompt && (
        <div className="mt-5 border-t border-neutral-100 pt-3">
          <button
            onClick={() => setShowPrompt((v) => !v)}
            className="inline-flex items-center gap-1 text-xs font-medium text-neutral-500 hover:text-neutral-700"
          >
            {showPrompt ? (
              <ChevronDown className="h-3.5 w-3.5" />
            ) : (
              <ChevronRight className="h-3.5 w-3.5" />
            )}
            Render-prompt (voor beeldmodel)
          </button>
          {showPrompt && (
            <pre className="mt-2 whitespace-pre-wrap rounded-md bg-neutral-50 p-3 text-xs text-neutral-600 ring-1 ring-neutral-100">
              {revision.renderPrompt}
            </pre>
          )}
        </div>
      )}
    </div>
  );
}
