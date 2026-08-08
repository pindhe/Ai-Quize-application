# Pindhe AI — Tijaabada Maskaxda

AI-powered brain quiz app with a Somali-first UI. Play timed rounds across IQ, Math, Science, Technology, Football, Movies, Somalia, and Islamic Knowledge. Earn XP and credits as you go.

**Live:** [https://aiquize.onrender.com/](https://aiquize.onrender.com/)

<p align="center">
  <img
    src="Screenshot 2026-05-17 132752.png"
    width="850"
    alt="Pindhe AI preview"
  />
</p>

---

## Features

- 10 AI-generated questions per game (Gemini), randomized each run
- Categories + difficulty (Fudud → Khubaro)
- Timed answers, 50/50 hint, and quick-help lifeline
- Guest profile (local) — no Google login required
- XP, credits, rewards, leaderboard, and settings
- Somali UI copy + Somali quiz generation
- Dark/light theme support

---

## Tech stack

| Layer | Stack |
| --- | --- |
| Frontend | React 19, TypeScript, Vite, Tailwind CSS, Motion |
| Backend | Express (`server.ts`) + Gemini API (`@google/genai`) |
| Data | Firebase / Firestore (optional online profile & leaderboard) |
| Hosting | Render (`https://aiquize.onrender.com/`) |

App source lives in the `Ai-quize/` folder.

---

## Project structure

```text
Ai-Quize/
├── Ai-quize/
│   ├── server.ts          # Express + /api/quiz/generate
│   ├── src/
│   │   ├── components/    # Brand, loading, icons, layout
│   │   ├── pages/         # Splash, Categories, Quiz, Rewards…
│   │   ├── lib/           # brand, guest profile, translations
│   │   └── images/        # logo, loader SVG, hero video
│   ├── .env.example
│   └── package.json
├── Screenshot 2026-05-17 132752.png
└── README.md
```

---

## Run locally

**Prerequisites:** Node.js 20+

```bash
cd Ai-quize
npm install
```

Create `.env.local` from the example:

```bash
# Ai-quize/.env.local
GEMINI_API_KEY=your_key_here
APP_URL=http://localhost:3000
```

Get a free key: [Google AI Studio](https://aistudio.google.com/apikey)

Start the app:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Production build (local)

```bash
npm run build
npm start
```

---

## Deploy (Render)

This app needs a **Node** host (Express serves the API + SPA).

1. Push the repo to GitHub.
2. Create a **Web Service** on [Render](https://render.com).
3. Settings:
   - **Root Directory:** `Ai-quize`
   - **Build Command:** `npm install && npm run build`
   - **Start Command:** `npm start`
4. Environment variables:
   - `GEMINI_API_KEY` — required
   - `NODE_ENV=production`
   - `APP_URL=https://aiquize.onrender.com` (or your service URL)
5. Deploy, then open the public URL.

Do **not** commit `.env.local` or real API keys.

---

## Quiz API

`POST /api/quiz/generate`

```json
{
  "category": "IQ",
  "difficulty": "Medium",
  "count": 10,
  "language": "Soomaali",
  "seed": "optional-unique-seed"
}
```

Each request uses a seed + shuffling so replays return a different question mix and answer order.

---

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Dev server (Vite + Express) on port 3000 |
| `npm run build` | Build client + bundle `dist/server.cjs` |
| `npm start` | Run production server |
| `npm run lint` | Typecheck (`tsc --noEmit`) |

---

## Notes

- Free-tier Gemini quotas apply; if generation fails with a rate-limit message, wait and retry.
- Guest mode stores progress in `localStorage`; Firebase is used when available for online features.

---

## License

MIT
