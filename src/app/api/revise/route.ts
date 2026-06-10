import { NextResponse } from "next/server";
import { interpretRequest, generateRender } from "@/lib/gemini";
import type { ReviseRequest, ReviseResponse } from "@/types";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(req: Request) {
  let body: ReviseRequest;
  try {
    body = (await req.json()) as ReviseRequest;
  } catch {
    return NextResponse.json({ error: "Ongeldige JSON in request." }, { status: 400 });
  }

  if (!body.imageBase64 || !body.mimeType || !body.userRequest) {
    return NextResponse.json(
      { error: "Verzoek mist verplichte velden (imageBase64, mimeType, userRequest)." },
      { status: 400 }
    );
  }

  try {
    const mode = body.mode === "omgeving" ? "omgeving" : "meubel";

    const interpretation = await interpretRequest({
      imageBase64: body.imageBase64,
      mimeType: body.mimeType,
      userRequest: body.userRequest,
      history: body.history ?? [],
      mode,
    });

    const render = await generateRender({
      baseImageBase64: body.imageBase64,
      mimeType: body.mimeType,
      renderPrompt: interpretation.render_prompt,
      mode,
    });

    const response: ReviseResponse = {
      summary: interpretation.summary,
      changes: interpretation.changes,
      renderPrompt: interpretation.render_prompt,
      imageBase64: render.imageBase64,
      mimeType: render.mimeType,
    };

    return NextResponse.json(response);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Onbekende fout bij genereren van revisie.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
