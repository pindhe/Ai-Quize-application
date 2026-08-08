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

// Initialize Gemini
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || "",
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

const QUIZ_MODELS = [
  "gemini-2.5-flash",
  "gemini-flash-latest",
  "gemini-2.5-flash-lite",
  "gemini-3-flash-preview",
];

function parseGeminiError(error: unknown): { status?: number; message: string; retryAfter?: number } {
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
          : "Gemini free tier wuu dhammaaday (20 request / maalin). Sug xoogaa ama beddel model-ka.";
      } else if (status === 401 || status === 403) {
        message = "Gemini API key waa khaldan ama lama oggola. Hubi .env.local.";
      } else if (apiMsg) {
        message = apiMsg.split("\n")[0];
      }
    }
  } catch {
    // keep default message
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
          systemInstruction:
            "You are an expert quiz master. Generate high-quality multiple choice questions. Ensure one correct answer and three plausible distractors. Provide a brief explanation for the correct answer. Do not include imageUrl unless you are certain it is a real working URL.",
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
                correctIndex: { type: Type.INTEGER, description: "Index of the correct answer (0-3)" },
                explanation: { type: Type.STRING, description: "Brief explanation of why the answer is correct" },
                category: { type: Type.STRING },
                difficulty: { type: Type.STRING },
                imageUrl: { type: Type.STRING, description: "Optional URL for a related image" },
              },
              required: ["text", "options", "correctIndex", "explanation", "category", "difficulty"],
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
      // try next model on quota / not-found / empty
      if (info.status && ![404, 429].includes(info.status) && info.status < 500) {
        throw error;
      }
    }
  }
  throw lastError;
}

// API Routes
app.post("/api/quiz/generate", async (req, res) => {
  const { category, difficulty, count = 5, language = "English" } = req.body;

  if (!process.env.GEMINI_API_KEY) {
    return res.status(500).json({ error: "Gemini API key lama dejin. Ku dar GEMINI_API_KEY .env.local." });
  }

  try {
    const prompt = `Generate ${count} unique and challenging quiz questions for the category "${category}" at "${difficulty}" difficulty level. Language: ${language}. Write all question text, options, and explanations fully in ${language}. Do not mix English unless the category requires it.`;

    const questions = await generateWithFallback(prompt);
    res.json({ questions });
  } catch (error) {
    console.error("Gemini Error:", error);
    const info = parseGeminiError(error);
    res.status(info.status === 429 ? 429 : 500).json({
      error: info.message,
      retryAfter: info.retryAfter,
    });
  }
});

// Health check
app.get("/api/health", (req, res) => {
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
