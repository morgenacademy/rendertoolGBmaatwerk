"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { RenderCanvas } from "@/components/RenderCanvas";
import { RequestInput } from "@/components/RequestInput";
import { RevisionHistory } from "@/components/RevisionHistory";
import { ChangesPanel } from "@/components/ChangesPanel";
import { DownloadButton } from "@/components/DownloadButton";
import { loadSession, saveSession, clearSession } from "@/lib/storage";
import type { Revision, ReviseRequest, ReviseResponse } from "@/types";

function newId(): string {
  return crypto.randomUUID();
}

function dataUrlToBase64(dataUrl: string): { base64: string; mimeType: string } {
  const match = dataUrl.match(/^data:([^;]+);base64,(.+)$/);
  if (!match) throw new Error("Ongeldige data URL.");
  return { mimeType: match[1], base64: match[2] };
}

export default function Page() {
  const [revisions, setRevisions] = useState<Revision[]>([]);
  const [activeRevisionId, setActiveRevisionId] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const stored = loadSession();
    if (stored) {
      setRevisions(stored.revisions);
      setActiveRevisionId(stored.activeRevisionId);
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    saveSession({ revisions, activeRevisionId });
  }, [revisions, activeRevisionId, hydrated]);

  const activeRevision = useMemo(
    () => revisions.find((r) => r.id === activeRevisionId) ?? null,
    [revisions, activeRevisionId]
  );

  const handleUpload = useCallback((dataUrl: string, _mimeType: string) => {
    const original: Revision = {
      id: newId(),
      parentId: null,
      label: "Origineel",
      timestamp: Date.now(),
      imageDataUrl: dataUrl,
      userRequest: null,
      summary: null,
      changes: [],
      renderPrompt: null,
    };
    setRevisions([original]);
    setActiveRevisionId(original.id);
    setError(null);
  }, []);

  const buildHistoryForRequest = useCallback(
    (baseId: string): { userRequest: string; summary: string }[] => {
      const chain: Revision[] = [];
      let current = revisions.find((r) => r.id === baseId) ?? null;
      while (current) {
        chain.unshift(current);
        current = current.parentId ? revisions.find((r) => r.id === current!.parentId) ?? null : null;
      }
      return chain
        .filter((r) => r.userRequest && r.summary)
        .map((r) => ({ userRequest: r.userRequest!, summary: r.summary! }));
    },
    [revisions]
  );

  const handleSubmit = useCallback(
    async (userRequest: string) => {
      if (!activeRevision) return;
      setIsGenerating(true);
      setError(null);
      try {
        const { base64, mimeType } = dataUrlToBase64(activeRevision.imageDataUrl);
        const body: ReviseRequest = {
          imageBase64: base64,
          mimeType,
          userRequest,
          history: buildHistoryForRequest(activeRevision.id),
        };
        const res = await fetch("/api/revise", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
        const data = (await res.json()) as ReviseResponse | { error: string };
        if (!res.ok || "error" in data) {
          throw new Error("error" in data ? data.error : "Onbekende fout.");
        }

        const nextLabel = `Revisie ${revisions.filter((r) => r.parentId).length + 1}`;
        const newRev: Revision = {
          id: newId(),
          parentId: activeRevision.id,
          label: nextLabel,
          timestamp: Date.now(),
          imageDataUrl: `data:${data.mimeType};base64,${data.imageBase64}`,
          userRequest,
          summary: data.summary,
          changes: data.changes,
          renderPrompt: data.renderPrompt,
        };
        setRevisions((prev) => [...prev, newRev]);
        setActiveRevisionId(newRev.id);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Onbekende fout.");
      } finally {
        setIsGenerating(false);
      }
    },
    [activeRevision, buildHistoryForRequest, revisions]
  );

  const handleClear = useCallback(() => {
    setRevisions([]);
    setActiveRevisionId(null);
    setError(null);
    clearSession();
  }, []);

  return (
    <main className="mx-auto flex min-h-screen max-w-[1600px] flex-col gap-6 p-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-neutral-900">
            Rendertool — GB Maatwerkinterieur
          </h1>
          <p className="text-sm text-neutral-500">
            Pas een render aan met natuurlijke taal. Camera, ruimte en licht blijven gelijk.
          </p>
        </div>
        <DownloadButton revision={activeRevision} />
      </header>

      <div className="grid flex-1 grid-cols-1 gap-6 lg:grid-cols-[1fr_400px]">
        <div className="flex flex-col gap-4">
          <div className="h-[60vh] min-h-[400px] lg:h-[70vh]">
            <RenderCanvas
              imageDataUrl={activeRevision?.imageDataUrl ?? null}
              onUpload={handleUpload}
              isGenerating={isGenerating}
            />
          </div>
          <RevisionHistory
            revisions={revisions}
            activeRevisionId={activeRevisionId}
            onSelect={setActiveRevisionId}
            onClear={handleClear}
          />
        </div>

        <aside className="flex flex-col gap-4">
          <RequestInput
            onSubmit={handleSubmit}
            isGenerating={isGenerating}
            disabled={!activeRevision}
          />
          {error && (
            <div className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700 ring-1 ring-red-200">
              {error}
            </div>
          )}
          <ChangesPanel revision={activeRevision} />
        </aside>
      </div>
    </main>
  );
}
