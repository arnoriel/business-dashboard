import OpenAI from "openai";

// Membaca dari environment variables Vite
const OPENROUTER_API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY;
const SITE_URL = import.meta.env.VITE_SITE_URL || "http://localhost:5173";
const SITE_NAME = import.meta.env.VITE_SITE_NAME || "Business Dashboard";

if (!OPENROUTER_API_KEY) {
  console.error("API Key tidak ditemukan! Pastikan VITE_OPENROUTER_API_KEY sudah diset di .env.local");
}

const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: OPENROUTER_API_KEY,
  dangerouslyAllowBrowser: true, 
  defaultHeaders: {
    "HTTP-Referer": SITE_URL,
    "X-Title": SITE_NAME,
  },
});

export const analyzeBusinessPerformance = async (data: any[]) => {
  try {
    // Kita batasi data agar tidak memakan terlalu banyak token
    const dataSample = JSON.stringify(data.slice(0, 50)); 

    const completion = await openai.chat.completions.create({
      model: "arcee-ai/trinity-large-preview:free",
      messages: [
        {
          role: "system",
          content: "Kamu adalah analis bisnis ahli. Analisa data penjualan JSON berikut. Berikan ringkasan performa, tren penjualan, dan rekomendasi singkat dalam format HTML (gunakan tag <p>, <ul>, <li>, <strong>). Bahasa: Indonesia."
        },
        {
          role: "user",
          content: `Berikut adalah data penjualan toko: ${dataSample}`
        }
      ],
    });

    return completion.choices[0].message.content;
  } catch (error) {
    console.error("Error analyzing data:", error);
    throw new Error("Gagal menganalisa data via AI.");
  }
};