import OpenAI from "openai";

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

export const analyzeBusinessPerformance = async (data: any[], platform: string) => {
  try {
    // Membatasi data namun tetap representatif
    const dataSample = JSON.stringify(data.slice(0, 100)); 

    const completion = await openai.chat.completions.create({
      model: "arcee-ai/trinity-large-preview:free",
      messages: [
        {
          role: "system",
          content: `Anda adalah Konsultan Bisnis Senior. Tugas Anda adalah menganalisa data penjualan dari platform ${platform}.
          
          Logika Analisa:
          1. Identifikasi Produk Terlaris (Best Seller) berdasarkan Qty.
          2. Hitung estimasi total pendapatan dari data yang diberikan.
          3. Temukan tren (misal: kategori mana yang paling dominan).
          4. Berikan 3 rekomendasi strategis yang spesifik dan actionable.

          Format Output: Gunakan HTML murni (tanpa markdown box) dengan tag:
          - <h3> untuk judul bagian
          - <strong> untuk penekanan
          - <ul> dan <li> untuk poin-poin
          - <p> untuk paragraf.
          Bahasa: Indonesia yang profesional.`
        },
        {
          role: "user",
          content: `Berikut adalah data transaksi JSON: ${dataSample}`
        }
      ],
    });

    return completion.choices[0].message.content;
  } catch (error) {
    console.error("Error analyzing data:", error);
    throw new Error("Gagal menganalisa data via AI.");
  }
};