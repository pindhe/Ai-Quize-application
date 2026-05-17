import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

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

// API Routes
app.post("/api/quiz/generate", async (req, res) => {
  const { category, difficulty, count = 5, language = "English" } = req.body;

  if (!process.env.GEMINI_API_KEY) {
    return res.status(500).json({ error: "Gemini API key is not configured" });
  }

    try {
    const prompt = `Generate ${count} unique and challenging quiz questions for the category "${category}" at "${difficulty}" difficulty level. Language: ${language}. For some questions (about 40%), provide a relevant "imageUrl" using a high-quality descriptive keyword on Unsplash, e.g., "https://images.unsplash.com/photo-1541963463532-d68292c34b19?auto=format&fit=crop&q=80&w=800" for a book-related question. If no specific URL is known, use a descriptive aesthetic keyword like "https://loremflickr.com/800/450/science,tech".`;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        systemInstruction: "You are an expert quiz master. Generate high-quality multiple choice questions. Ensure one correct answer and three plausible distractors. Provide a brief explanation for the correct answer. Some questions should include a relevant imageUrl.",
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
                description: "Four possible answers"
              },
              correctIndex: { type: Type.INTEGER, description: "Index of the correct answer (0-3)" },
              explanation: { type: Type.STRING, description: "Brief explanation of why the answer is correct" },
              category: { type: Type.STRING },
              difficulty: { type: Type.STRING },
              imageUrl: { type: Type.STRING, description: "Optional URL for a related image" }
            },
            required: ["text", "options", "correctIndex", "explanation", "category", "difficulty"]
          }
        }
      }
    });

    const questions = JSON.parse(response.text || "[]");
    res.json({ questions });
  } catch (error) {
    console.error("Gemini Error:", error);
    res.status(500).json({ error: "Failed to generate questions" });
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
