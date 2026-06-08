import type { Revision } from "@/types";

const STORAGE_KEY = "rendertool-gb-session-v1";

type StoredSession = {
  revisions: Revision[];
  activeRevisionId: string | null;
};

export function loadSession(): StoredSession | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as StoredSession;
  } catch {
    return null;
  }
}

export function saveSession(session: StoredSession): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
  } catch {
    // QuotaExceeded — sessie te groot voor localStorage. Stilzwijgend negeren.
  }
}

export function clearSession(): void {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(STORAGE_KEY);
}
