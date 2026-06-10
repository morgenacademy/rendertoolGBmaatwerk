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
      <label className="text-sm font-medium text-brand">Wijzigingsverzoek</label>

      <div className="flex gap-1 rounded-full border border-brand-line bg-white p-1">
        <button
          type="button"
          onClick={() => setMode("meubel")}
          disabled={disabled || isGenerating}
          className={`inline-flex flex-1 items-center justify-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium transition ${
            mode === "meubel"
              ? "bg-brand text-brand-cream shadow-sm"
              : "text-brand-muted hover:text-brand"
          } disabled:cursor-not-allowed disabled:opacity-60`}
        >
          <Sofa className="h-4 w-4" /> Meubel
        </button>
        <button
          type="button"
          onClick={() => setMode("omgeving")}
          disabled={disabled || isGenerating}
          className={`inline-flex flex-1 items-center justify-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium transition ${
            mode === "omgeving"
              ? "bg-brand text-brand-cream shadow-sm"
              : "text-brand-muted hover:text-brand"
          } disabled:cursor-not-allowed disabled:opacity-60`}
        >
          <Mountain className="h-4 w-4" /> Omgeving & sfeer
        </button>
      </div>
      <p className="-mt-1 text-xs text-brand-muted">{MODE_HINT[mode]}</p>

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
        className="w-full resize-none rounded-2xl border border-brand-line bg-white p-3 text-sm shadow-sm focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand disabled:bg-brand-surface disabled:text-brand-muted"
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
        className="inline-flex items-center justify-center gap-2 rounded-full bg-brand px-4 py-2.5 text-sm font-semibold text-brand-cream shadow-sm hover:bg-neutral-800 disabled:cursor-not-allowed disabled:bg-brand-line disabled:text-brand-muted"
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
              className="rounded-full border border-brand-line bg-white px-3 py-1 text-xs text-brand-muted hover:border-brand hover:text-brand"
            >
              {s}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
