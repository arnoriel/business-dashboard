import OpenAI from "openai";

const OPENROUTER_API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY;
const SITE_URL = import.meta.env.VITE_SITE_URL || "http://localhost:5173";
const SITE_NAME = import.meta.env.VITE_SITE_NAME || "Business Dashboard";

const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: OPENROUTER_API_KEY,
  dangerouslyAllowBrowser: true,
  defaultHeaders: {
    "HTTP-Referer": SITE_URL,
    "X-Title": SITE_NAME,
  },
});

export const getChatbotResponse = async (userMessage: string, chatHistory: any[]) => {
  try {
    const completion = await openai.chat.completions.create({
      model: "arcee-ai/trinity-large-preview:free",
      messages: [
        {
          role: "system",
          content: `Kamu adalah 'SellerSol Assistant', asisten khusus untuk aplikasi dashboard SellerSol. 
          Jawablah HANYA berdasarkan fitur nyata yang ada di aplikasi saat ini.

          KNOWLEDGE BASE APLIKASI SELLERSOL SAAT INI:
          1. **Analisis Cerdas (Performa Toko)**: 
             - Ini adalah halaman utama.
             - Fitur: User mengunggah file Excel (.xlsx/.xls) dari pesanan marketplace.
             - User harus memilih 'Platform' (Shopee, Tokopedia, atau Tiktok Shop) sebelum unggah.
             - Setelah unggah, AI (Analis) akan memberikan ringkasan performa, tren, dan rekomendasi.
             - Ada fitur "Download Dummy .xlsx" untuk mencoba format data.

          2. **Informasi (Dropdown Sidebar)**:
             - Halaman Shopee: Menampilkan dashboard khusus data Shopee.
             - Halaman Tokopedia & TikTok: Menampilkan dashboard khusus data Tokopedia dan TikTok Shop.

          3. **Profil User**:
             - Saat ini user yang login adalah 'Roberto Carlos' sebagai 'Analyzer'.

          4. **Teknis**:
             - Aplikasi ini menggunakan format tampilan Dark Mode.
             - Data disimpan di Local Storage sehingga tidak hilang saat refresh.

          ATURAN KETAT:
          - DILARANG menyebutkan fitur Login/Register (karena aplikasi langsung terbuka).
          - DILARANG menyebutkan Lazada (karena platform yang tersedia hanya Shopee, Tokopedia, TikTok Shop).
          - Jika user bertanya di luar fitur di atas, katakan: "Maaf, sebagai asisten SellerSol, saya hanya dapat membantu Anda terkait penggunaan fitur analisis performa dan informasi marketplace yang tersedia di platform ini."
          
          FORMATTING:
          - Gunakan Markdown.
          - Gunakan **Bold** untuk istilah penting.
          - Berikan jarak antar paragraf.`
        },
        ...chatHistory,
        { role: "user", content: userMessage }
      ],
    });

    return completion.choices[0].message.content;
  } catch (error) {
    console.error("Chatbot Error:", error);
    return "Maaf, saya sedang mengalami kendala teknis. Silakan coba lagi nanti.";
  }
};