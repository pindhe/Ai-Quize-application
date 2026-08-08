import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });
dotenv.config(); // fallback to .env

const app = express();
const PORT = 3000;

app.use(express.json());

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || "",
  httpOptions: {
    headers: {
      "User-Agent": "aistudio-build",
    },
  },
});

/** Prefer models with separate free-tier quotas; skip retired IDs */
const QUIZ_MODELS = [
  "gemini-flash-latest",
  "gemini-3.5-flash",
  "gemini-3.6-flash",
  "gemini-3-flash-preview",
];

function parseGeminiError(error: unknown): {
  status?: number;
  message: string;
  retryAfter?: number;
} {
  const anyErr = error as { status?: number; message?: string };
  const raw = anyErr?.message || String(error);
  let message = "Su'aalaha lama samayn karin. Isku day mar kale.";
  let retryAfter: number | undefined;
  let status = anyErr?.status;

  try {
    const jsonStart = raw.indexOf("{");
    if (jsonStart >= 0) {
      const parsed = JSON.parse(raw.slice(jsonStart));
      status = parsed?.error?.code ?? status;
      const apiMsg = parsed?.error?.message || "";
      const retryMatch = apiMsg.match(/retry in ([\d.]+)s/i);
      if (retryMatch) retryAfter = Math.ceil(Number(retryMatch[1]));
      if (status === 429 || /quota|rate.?limit|resource_exhausted/i.test(apiMsg)) {
        message = retryAfter
          ? `Gemini free tier wuu dhammaaday. Sug ${retryAfter} ilbiriqsi oo isku day mar kale.`
          : "Gemini free tier wuu dhammaaday. Sug xoogaa ama isku day mar kale.";
      } else if (status === 401 || status === 403) {
        message = "Gemini API key waa khaldan ama lama oggola. Hubi .env.local.";
      } else if (apiMsg) {
        message = apiMsg.split("\n")[0];
      }
    }
  } catch {
    // keep default
  }

  return { status, message, retryAfter };
}

async function generateWithFallback(prompt: string) {
  let lastError: unknown;

  for (const model of QUIZ_MODELS) {
    try {
      const response = await ai.models.generateContent({
        model,
        contents: prompt,
        config: {
          temperature: 1.15,
          systemInstruction:
            "You are an expert quiz master. Every request must produce a fresh, randomized set of questions — never repeat the same set. Vary topics, facts, numbers, and wording. Ensure one correct answer and three plausible distractors. Provide a brief explanation for the correct answer.",
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                text: { type: Type.STRING, description: "The content of the question" },
                options: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                  description: "Four possible answers",
                },
                correctIndex: {
                  type: Type.INTEGER,
                  description: "Index of the correct answer (0-3)",
                },
                explanation: {
                  type: Type.STRING,
                  description: "Brief explanation of why the answer is correct",
                },
                category: { type: Type.STRING },
                difficulty: { type: Type.STRING },
                imageUrl: {
                  type: Type.STRING,
                  description: "Optional URL for a related image",
                },
              },
              required: [
                "text",
                "options",
                "correctIndex",
                "explanation",
                "category",
                "difficulty",
              ],
            },
          },
        },
      });

      const questions = JSON.parse(response.text || "[]");
      if (!Array.isArray(questions) || questions.length === 0) {
        throw new Error("Empty question list from model");
      }
      console.log(`Quiz generated with model: ${model}`);
      return questions;
    } catch (error) {
      lastError = error;
      const info = parseGeminiError(error);
      console.warn(`Model ${model} failed (${info.status ?? "?"}):`, info.message);
      if (info.status && ![404, 429].includes(info.status) && info.status < 500) {
        throw error;
      }
    }
  }

  throw lastError;
}

function shuffleInPlace<T>(arr: T[]): T[] {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function randomizeQuestions(questions: unknown[]) {
  const randomized = shuffleInPlace(
    questions.map((q: any) => {
      const options = Array.isArray(q.options) ? [...q.options] : [];
      const correctValue = options[q.correctIndex];
      const shuffledOpts = shuffleInPlace(options);
      const correctIndex = Math.max(0, shuffledOpts.indexOf(correctValue));
      return { ...q, options: shuffledOpts, correctIndex };
    })
  );
  return randomized;
}

app.post("/api/quiz/generate", async (req, res) => {
  const { category, difficulty, count = 10, language = "English", seed } = req.body;
  const sessionSeed =
    typeof seed === "string" && seed.length > 0
      ? seed
      : `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;

  if (!process.env.GEMINI_API_KEY) {
    return res
      .status(500)
      .json({ error: "Gemini API key lama dejin. Ku dar GEMINI_API_KEY .env.local." });
  }

  try {
    const prompt = `Generate ${count} UNIQUE quiz questions for category "${category}" at "${difficulty}" difficulty.
Language: ${language} — write ALL text, options, and explanations in ${language}.
Session seed: ${sessionSeed} (use this to pick a DIFFERENT random mix of topics/facts than any previous run).
Rules:
- Do NOT reuse classic/overused riddles for this seed.
- Vary numbers, names, facts, and angle so a replay feels new.
- Mix question styles (fact, logic, sequence, comparison) in random order.
- Exactly 4 options per question; only one correct.`;

    const questions = randomizeQuestions(await generateWithFallback(prompt));
    res.json({ questions, seed: sessionSeed });
  } catch (error) {
    console.error("Gemini Error:", error);
    const info = parseGeminiError(error);
    res.status(info.status === 429 ? 429 : 500).json({
      error: info.message,
      retryAfter: info.retryAfter,
    });
  }
});

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" });
});

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
