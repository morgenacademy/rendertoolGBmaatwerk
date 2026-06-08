# Rendertool GB Maatwerkinterieur

Webapp om bestaande renders van maatwerkmeubels snel aan te passen via natuurlijke taal.
De maker uploadt een render, typt een wijzigingsverzoek ("maak de kast breder", "voeg lades toe"),
en krijgt binnen seconden een nieuwe render terug — met behoud van camera, ruimte en licht.

Gebouwd met **Next.js 15**, **TypeScript**, **Tailwind** en **Google Gemini** (LLM + image).

---

## Snel starten

```bash
# 1. Installeer dependencies
npm install

# 2. Maak je env-bestand aan
cp .env.example .env.local
# Vul GEMINI_API_KEY in (haal hem op via https://aistudio.google.com/apikey)

# 3. Start de dev-server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Hoe het werkt

1. Upload een render (PNG/JPG, max 15 MB).
2. Typ een wijzigingsverzoek in de zijbalk.
3. Onder de motorkap:
   - Gemini 2.5 Flash interpreteert het verzoek als ervaren meubelmaker en geeft `summary`, `changes` en een `render_prompt` terug.
   - Gemini 2.5 Flash Image bewerkt de oorspronkelijke render met die prompt en behoudt camera/ruimte/licht.
4. Iedere revisie wordt bewaard in de browser-sessie. Klik op een vorige revisie om vanaf daar verder te werken.

---

## Kosten

Per revisie ongeveer **€0,04** (Gemini Image) + verwaarloosbare LLM-kosten.

| Volume | Indicatie per maand |
|---|---|
| 100 revisies | ±€4 |
| 1.000 revisies | ±€40 |
| 10.000 revisies | ±€400 |

Voor productie: maak een eigen Google Cloud project voor GB Maatwerkinterieur zodat de facturen
direct daarheen gaan.

---

## Deploy op Netlify

1. Push naar GitHub (`morgenacademy/rendertoolGBmaatwerk`).
2. In Netlify: **Add new site → Import an existing project** en kies de repo.
3. Build-instellingen worden automatisch herkend via `netlify.toml`
   (build command `npm run build`, plus de officiële Next.js-runtime).
4. Ga naar **Site settings → Environment variables** en voeg toe:
   `GEMINI_API_KEY` = jouw key.
5. Deploy. Elke nieuwe push naar GitHub zet automatisch de nieuwe versie live.

---

## Bestandsstructuur

```
src/
├── app/
│   ├── layout.tsx, page.tsx, globals.css
│   └── api/revise/route.ts        # Orkestreert LLM → image
├── components/                     # Canvas, Input, History, Changes, Download
├── lib/
│   ├── gemini.ts                  # Gemini text + image wrappers
│   ├── systemPrompt.ts            # Cabinet-maker persona
│   ├── schema.ts                  # Zod validatie LLM-output
│   └── storage.ts                 # localStorage sessie-historie
└── types/index.ts
```

---

## Roadmap (niet in MVP)

- Login + persistente projecten (DB)
- Side-by-side vergelijking origineel ↔ revisie
- Export als PDF / projectmap voor klanten
- FLUX.1 Kontext als alternatief image model
- Voice input voor verzoeken
