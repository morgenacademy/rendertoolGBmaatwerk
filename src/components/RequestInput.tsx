"use client";

import { useState } from "react";
import { Wand2 } from "lucide-react";

type Props = {
  onSubmit: (request: string) => void;
  isGenerating: boolean;
  disabled: boolean;
};

const SUGGESTIONS = [
  "Maak de fronten mat zwart.",
  "Geef het werkblad een marmerlook.",
  "Verander de kleur van de kasten naar warm eiken.",
  "Maak de afwerking hoogglans wit.",
];

export function RequestInput({ onSubmit, isGenerating, disabled }: Props) {
  const [text, setText] = useState("");

  const submit = () => {
    const trimmed = text.trim();
    if (!trimmed || isGenerating || disabled) return;
    onSubmit(trimmed);
    setText("");
  };

  return (
    <div className="flex flex-col gap-3">
      <label className="text-sm font-medium text-neutral-700">Wijzigingsverzoek</label>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder={disabled ? "Upload eerst een render…" : "Bijv. 'Maak de wandkast breder en voeg lades onderaan toe.'"}
        rows={4}
        disabled={disabled || isGenerating}
        className="w-full resize-none rounded-lg border border-neutral-300 bg-white p-3 text-sm shadow-sm focus:border-brand-accent focus:outline-none focus:ring-1 focus:ring-brand-accent disabled:bg-neutral-50 disabled:text-neutral-500"
        onKeyDown={(e) => {
          if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
            e.preventDefault();
            submit();
          }
        }}
      />
      <button
        onClick={submit}
        disabled={disabled || isGenerating || !text.trim()}
        className="inline-flex items-center justify-center gap-2 rounded-lg bg-brand px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-neutral-800 disabled:cursor-not-allowed disabled:bg-neutral-300"
      >
        <Wand2 className="h-4 w-4" />
        {isGenerating ? "Bezig…" : "Genereer revisie"}
      </button>

      {!disabled && !isGenerating && (
        <div className="flex flex-wrap gap-2 pt-1">
          {SUGGESTIONS.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setText(s)}
              className="rounded-full border border-neutral-200 bg-white px-3 py-1 text-xs text-neutral-600 hover:border-neutral-300 hover:bg-neutral-50"
            >
              {s}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
