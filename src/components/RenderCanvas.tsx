"use client";

import { useCallback, useRef, useState } from "react";
import { Upload, ImageIcon } from "lucide-react";

type Props = {
  imageDataUrl: string | null;
  onUpload: (dataUrl: string, mimeType: string) => void;
  isGenerating: boolean;
};

const MAX_DIMENSION = 1280;
const MAX_FILE_SIZE = 15 * 1024 * 1024; // 15 MB

async function fileToResizedDataUrl(file: File): Promise<{ dataUrl: string; mimeType: string }> {
  const bitmap = await createImageBitmap(file);
  const { width, height } = bitmap;
  const scale = Math.min(1, MAX_DIMENSION / Math.max(width, height));
  const targetWidth = Math.round(width * scale);
  const targetHeight = Math.round(height * scale);

  const canvas = document.createElement("canvas");
  canvas.width = targetWidth;
  canvas.height = targetHeight;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas niet beschikbaar.");
  ctx.drawImage(bitmap, 0, 0, targetWidth, targetHeight);

  const mimeType = file.type === "image/png" ? "image/png" : "image/jpeg";
  const dataUrl = canvas.toDataURL(mimeType, 0.92);
  bitmap.close();
  return { dataUrl, mimeType };
}

export function RenderCanvas({ imageDataUrl, onUpload, isGenerating }: Props) {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback(
    async (file: File) => {
      setError(null);
      if (!file.type.startsWith("image/")) {
        setError("Alleen afbeeldingen (PNG, JPG) zijn toegestaan.");
        return;
      }
      if (file.size > MAX_FILE_SIZE) {
        setError("Bestand te groot (max 15 MB).");
        return;
      }
      try {
        const { dataUrl, mimeType } = await fileToResizedDataUrl(file);
        onUpload(dataUrl, mimeType);
      } catch {
        setError("Kon afbeelding niet verwerken.");
      }
    },
    [onUpload]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files?.[0];
      if (file) void handleFile(file);
    },
    [handleFile]
  );

  return (
    <div className="relative flex h-full w-full items-center justify-center rounded-4xl border border-brand-line bg-white overflow-hidden">
      {imageDataUrl ? (
        <>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={imageDataUrl}
            alt="Huidige render"
            className="max-h-full max-w-full object-contain"
          />
          <button
            onClick={() => inputRef.current?.click()}
            className="absolute bottom-4 right-4 inline-flex items-center gap-2 rounded-full bg-white/90 px-4 py-2 text-sm font-medium text-brand shadow-md ring-1 ring-brand-line hover:bg-white"
            disabled={isGenerating}
          >
            <Upload className="h-4 w-4" /> Vervang basisrender
          </button>
        </>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          className={`flex h-full w-full flex-col items-center justify-center gap-3 border-2 border-dashed transition-colors ${
            isDragging ? "border-brand bg-brand-surface" : "border-brand-line bg-brand-surface/50"
          }`}
        >
          <ImageIcon className="h-12 w-12 text-neutral-400" />
          <p className="text-base font-medium text-neutral-700">
            Sleep een render hierheen of klik om te uploaden
          </p>
          <p className="text-sm text-neutral-500">PNG of JPG, max 15 MB</p>
        </button>
      )}

      {isGenerating && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/70 backdrop-blur-sm">
          <div className="flex flex-col items-center gap-3">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-neutral-300 border-t-brand-accent" />
            <p className="text-sm font-medium text-neutral-700">Nieuwe revisie wordt gegenereerd…</p>
          </div>
        </div>
      )}

      {error && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700 ring-1 ring-red-200">
          {error}
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/png,image/jpeg"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) void handleFile(file);
          e.target.value = "";
        }}
      />
    </div>
  );
}
