import { GoogleGenAI } from "@google/genai";
import { SYSTEM_PROMPT } from "./systemPrompt";
import { InterpretationSchema, type Interpretation } from "./schema";

const TEXT_MODEL = "gemini-2.5-flash";
const IMAGE_MODEL = "gemini-2.5-flash-image";

function getClient(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error(
      "GEMINI_API_KEY ontbreekt. Vul deze in .env.local (lokaal) of in de Netlify environment variables (productie)."
    );
  }
  return new GoogleGenAI({ apiKey });
}

function stripJsonFences(text: string): string {
  const trimmed = text.trim();
  if (trimmed.startsWith("```")) {
    return trimmed
      .replace(/^```(?:json)?\s*/i, "")
      .replace(/```\s*$/, "")
      .trim();
  }
  return trimmed;
}

export async function interpretRequest(args: {
  imageBase64: string;
  mimeType: string;
  userRequest: string;
  history: { userRequest: string; summary: string }[];
}): Promise<Interpretation> {
  const ai = getClient();

  const historyBlock =
    args.history.length === 0
      ? "(no previous revisions)"
      : args.history
          .map(
            (h, i) =>
              `Revision ${i + 1}:\n  Customer: ${h.userRequest}\n  Summary: ${h.summary}`
          )
          .join("\n\n");

  const userText = `Previous revisions in this session:
${historyBlock}

Current customer request:
"${args.userRequest}"

Analyze the attached render and respond with valid JSON only, no markdown fences, matching this exact shape:
{
  "summary": "one short sentence describing the change",
  "changes": ["concrete change 1", "concrete change 2", ...],
  "render_prompt": "detailed prompt for the image model that preserves camera, room geometry, walls, windows, doors and lighting, and only modifies the requested furniture elements"
}`;

  const response = await ai.models.generateContent({
    model: TEXT_MODEL,
    config: {
      systemInstruction: SYSTEM_PROMPT,
      responseMimeType: "application/json",
      temperature: 0.4,
    },
    contents: [
      {
        role: "user",
        parts: [
          {
            inlineData: {
              data: args.imageBase64,
              mimeType: args.mimeType,
            },
          },
          { text: userText },
        ],
      },
    ],
  });

  const raw = response.text ?? "";
  if (!raw) {
    throw new Error("Lege response van Gemini bij interpretatie.");
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(stripJsonFences(raw));
  } catch {
    throw new Error("Kon JSON-output van Gemini niet parsen.");
  }

  const result = InterpretationSchema.safeParse(parsed);
  if (!result.success) {
    throw new Error("JSON van Gemini voldoet niet aan het verwachte formaat.");
  }
  return result.data;
}

export async function generateRender(args: {
  baseImageBase64: string;
  mimeType: string;
  renderPrompt: string;
}): Promise<{ imageBase64: string; mimeType: string }> {
  const ai = getClient();

  const response = await ai.models.generateContent({
    model: IMAGE_MODEL,
    contents: [
      {
        role: "user",
        parts: [
          {
            inlineData: {
              data: args.baseImageBase64,
              mimeType: args.mimeType,
            },
          },
          {
            text: `Edit this interior render according to the following instructions. Preserve camera angle, room geometry, walls, windows, doors and lighting exactly. Only modify the cabinetry/furniture elements described:\n\n${args.renderPrompt}`,
          },
        ],
      },
    ],
  });

  const candidates = response.candidates ?? [];
  for (const candidate of candidates) {
    const parts = candidate.content?.parts ?? [];
    for (const part of parts) {
      const inline = part.inlineData;
      if (inline?.data) {
        return {
          imageBase64: inline.data,
          mimeType: inline.mimeType ?? "image/png",
        };
      }
    }
  }

  throw new Error("Geen beeld ontvangen van Gemini. Probeer een ander verzoek of upload opnieuw.");
}
