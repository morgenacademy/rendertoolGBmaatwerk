"use client";

import { useState } from "react";
import { Wand2, Sofa, Mountain } from "lucide-react";
import type { RenderMode } from "@/types";

type Props = {
  onSubmit: (request: string, mode: RenderMode) => void;
  isGenerating: boolean;
  disabled: boolean;
};

const SUGGESTIONS: Record<RenderMode, string[]> = {
  meubel: [
    "Maak de fronten mat zwart.",
    "Geef het werkblad een marmerlook.",
    "Verander de kleur van de kasten naar warm eiken.",
    "Maak de afwerking hoogglans wit.",
  ],
  omgeving: [
    "Maak er een fotorealistische render van.",
    "Geef de vloer een eiken houten look.",
    "Maak de wanden warm beige.",
    "Voeg sfeervolle, warme verlichting toe.",
  ],
};

const MODE_HINT: Record<RenderMode, string> = {
  meubel: "Alleen het meubel/de kasten wijzigen. Ruimte, vloer en licht blijven gelijk.",
  omgeving: "Vloer, wanden, licht en sfeer aanpassen. Het meubel blijft qua vorm gelijk.",
};

export function RequestInput({ onSubmit, isGenerating, disabled }: Props) {
  const [text, setText] = useState("");
  const [mode, setMode] = useState<RenderMode>("meubel");

  const submit = () => {
    const trimmed = text.trim();
    if (!trimmed || isGenerating || disabled) return;
    onSubmit(trimmed, mode);
    setText("");
  };

  return (
    <div className="flex flex-col gap-3">
      <label className="text-sm font-medium text-neutral-700">Wijzigingsverzoek</label>

      <div className="flex gap-1 rounded-lg bg-neutral-100 p-1">
        <button
          type="button"
          onClick={() => setMode("meubel")}
          disabled={disabled || isGenerating}
          className={`inline-flex flex-1 items-center justify-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition ${
            mode === "meubel"
              ? "bg-white text-neutral-900 shadow-sm"
              : "text-neutral-500 hover:text-neutral-700"
          } disabled:cursor-not-allowed disabled:opacity-60`}
        >
          <Sofa className="h-4 w-4" /> Meubel
        </button>
        <button
          type="button"
          onClick={() => setMode("omgeving")}
          disabled={disabled || isGenerating}
          className={`inline-flex flex-1 items-center justify-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition ${
            mode === "omgeving"
              ? "bg-white text-neutral-900 shadow-sm"
              : "text-neutral-500 hover:text-neutral-700"
          } disabled:cursor-not-allowed disabled:opacity-60`}
        >
          <Mountain className="h-4 w-4" /> Omgeving & sfeer
        </button>
      </div>
      <p className="-mt-1 text-xs text-neutral-500">{MODE_HINT[mode]}</p>

      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder={
          disabled
            ? "Upload eerst een render…"
            : mode === "meubel"
              ? "Bijv. 'Maak de wandkast breder en voeg lades onderaan toe.'"
              : "Bijv. 'Geef de hele render een warme, fotorealistische sfeer.'"
        }
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
          {SUGGESTIONS[mode].map((s) => (
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
