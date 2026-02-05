import React, { useState, useEffect } from 'react';
import { 
  BarChart2, 
  Info, 
  UploadCloud, 
  Download, 
  Loader2, 
  Bell, 
  ChevronDown} from 'lucide-react';
import { analyzeBusinessPerformance } from './services/AI';
import { generateDummyExcel, readExcelFile } from './utils/excel';

// --- Type Definitions ---
interface AnalysisResult {
  raw: any[];
  analysis: string | null;
  timestamp: string;
}

function App() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [platform, setPlatform] = useState('');
  const [analysisData, setAnalysisData] = useState<AnalysisResult | null>(null);

  // Load from Local Storage on mount
  useEffect(() => {
    const saved = localStorage.getItem('businessAnalysis');
    if (saved) {
      setAnalysisData(JSON.parse(saved));
    }
  }, []);

  const handleFileDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) return alert("Pilih file terlebih dahulu!");
    if (!platform) return alert("Pilih platform terlebih dahulu!");

    setLoading(true);
    try {
      // 1. Read Excel
      const jsonData = await readExcelFile(file);
      
      // 2. Analyze with AI
      const aiResult = await analyzeBusinessPerformance(jsonData);
      
      // 3. Save Result
      const resultObj: AnalysisResult = {
        raw: jsonData,
        analysis: aiResult,
        timestamp: new Date().toLocaleString()
      };
      
      setAnalysisData(resultObj);
      localStorage.setItem('businessAnalysis', JSON.stringify(resultObj));
      
    } catch (error) {
      console.error(error);
      alert("Terjadi kesalahan saat analisa.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-dark-900 text-slate-300 font-sans overflow-hidden">
      
      {/* --- SIDEBAR --- */}
      <aside className="w-64 bg-dark-900 border-r border-dark-800 flex flex-col">
        <div className="p-6 flex items-center gap-2">
          {/* Logo Placeholder */}
          <div className="bg-white p-1 rounded">
             <div className="w-6 h-6 bg-primary-600 rounded-sm"></div>
          </div>
          <span className="text-white font-bold text-lg tracking-wide">SellerSol</span>
        </div>

        <div className="px-4 py-2 text-xs font-semibold text-slate-500 uppercase">Utama</div>
        
        <nav className="flex-1 px-2 space-y-1">
          <div className="group">
            <button className="w-full flex items-center justify-between p-3 text-white bg-dark-800 rounded-lg">
              <div className="flex items-center gap-3">
                <BarChart2 size={20} />
                <span className="font-medium">Analisis Cerdas</span>
              </div>
              <ChevronDown size={16} />
            </button>
            <div className="pl-10 mt-1 space-y-1">
              <a href="#" className="block py-2 text-sm text-primary-500 font-medium">Performa Toko</a>
              <a href="#" className="block py-2 text-sm text-slate-400 hover:text-slate-200">Tren Produk</a>
            </div>
          </div>

          <a href="#" className="flex items-center gap-3 p-3 text-slate-400 hover:text-white hover:bg-dark-800 rounded-lg transition">
            <Info size={20} />
            <span>Informasi</span>
          </a>
        </nav>
      </aside>

      {/* --- MAIN CONTENT --- */}
      <div className="flex-1 flex flex-col overflow-hidden relative">
        
        {/* HEADER */}
        <header className="h-16 border-b border-dark-800 bg-dark-900 flex items-center justify-between px-6">
          <div>
            <h1 className="text-xl font-bold text-white">Dasbor</h1>
            <p className="text-xs text-slate-500">Data penjualan yang simpel & terpusat.</p>
          </div>
          
          <div className="flex items-center gap-4">
            <button className="p-2 text-slate-400 hover:text-white"><Bell size={20} /></button>
            <div className="flex items-center gap-2 pl-4 border-l border-dark-700">
              <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center text-white font-bold">
                RC
              </div>
              <div className="text-sm">
                <p className="text-white font-medium">Roberto Carlos</p>
                <p className="text-xs text-slate-500">Analyzer</p>
              </div>
              <ChevronDown size={16} className="text-slate-500" />
            </div>
          </div>
        </header>

        {/* CONTENT AREA */}
        <main className="flex-1 overflow-y-auto p-8">
          <div className="max-w-4xl mx-auto">
            
            <div className="mb-6 flex items-center justify-between">
               <h2 className="text-xl font-bold text-white">Performa Toko</h2>
               <div className="text-sm text-slate-400">
                 Dashboard / Analisis / <span className="text-primary-500">Performa Toko</span>
               </div>
            </div>

            {/* FORM UPLOAD CARD (Mirip Gambar) */}
            <div className="bg-dark-800 border border-dark-700 rounded-lg p-6 shadow-xl mb-8">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold text-white">Form Unggah</h3>
                <button 
                  onClick={generateDummyExcel} 
                  className="text-xs flex items-center gap-1 text-primary-500 hover:underline"
                >
                  <Download size={14} /> Download Dummy .xlsx
                </button>
              </div>
              
              <div className="space-y-4">
                {/* Platform Input */}
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Platform<span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <select 
                      value={platform}
                      onChange={(e) => setPlatform(e.target.value)}
                      className="w-full bg-dark-900 border border-dark-700 text-slate-300 text-sm rounded-md px-3 py-2.5 outline-none focus:border-primary-500 appearance-none"
                    >
                      <option value="" disabled>Pilih Platform</option>
                      <option value="Shopee">Shopee</option>
                      <option value="Tokopedia">Tokopedia</option>
                      <option value="Tiktok Shop">Tiktok Shop</option>
                    </select>
                    <ChevronDown size={16} className="absolute right-3 top-3 text-slate-500 pointer-events-none" />
                  </div>
                </div>

                {/* File Dropzone */}
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    File Pesanan<span className="text-red-500">*</span>
                  </label>
                  <div 
                    onDrop={handleFileDrop}
                    onDragOver={(e) => e.preventDefault()}
                    className="border-2 border-dashed border-dark-700 bg-dark-900 rounded-lg p-10 flex flex-col items-center justify-center text-center cursor-pointer hover:border-dark-600 transition"
                  >
                    <input 
                      type="file" 
                      accept=".xlsx, .xls"
                      onChange={(e) => e.target.files && setFile(e.target.files[0])}
                      className="hidden" 
                      id="file-upload"
                    />
                    <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center">
                      <UploadCloud size={32} className="text-slate-400 mb-3" />
                      <span className="text-sm text-slate-400 font-medium">
                        {file ? file.name : "Seret & letakkan file di sini, atau klik untuk memilih file"}
                      </span>
                    </label>
                  </div>
                </div>

                {/* Button */}
                <div className="flex justify-end pt-2">
                  <button 
                    onClick={handleUpload}
                    disabled={loading}
                    className="bg-primary-600 hover:bg-primary-500 text-white px-6 py-2 rounded-md text-sm font-medium transition flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <>
                        <Loader2 size={16} className="animate-spin" /> Menganalisa...
                      </>
                    ) : (
                      "Unggah"
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* HASIL ANALISA */}
            {analysisData && (
              <div className="bg-dark-800 border border-dark-700 rounded-lg p-6 animate-fade-in">
                <div className="flex items-center justify-between mb-4 border-b border-dark-700 pb-3">
                  <h3 className="font-semibold text-white flex items-center gap-2">
                     <span className="w-2 h-6 bg-primary-500 rounded-full"></span>
                     Hasil Analisis AI
                  </h3>
                  <span className="text-xs text-slate-500">{analysisData.timestamp}</span>
                </div>
                
                <div className="prose prose-invert max-w-none text-slate-300 text-sm">
                   {/* Render HTML dari AI result */}
                   {analysisData.analysis ? (
                     <div dangerouslySetInnerHTML={{ __html: analysisData.analysis }} />
                   ) : (
                     <p>Gagal mendapatkan respon teks.</p>
                   )}
                </div>

                <div className="mt-6 pt-4 border-t border-dark-700">
                  <h4 className="text-white text-sm font-medium mb-2">Data Mentah (Preview):</h4>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs text-slate-400">
                      <thead className="text-slate-200 uppercase bg-dark-900">
                        <tr>
                          <th className="px-3 py-2">Produk</th>
                          <th className="px-3 py-2">Qty</th>
                          <th className="px-3 py-2">Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        {analysisData.raw.slice(0, 3).map((row, idx) => (
                          <tr key={idx} className="border-b border-dark-700">
                            <td className="px-3 py-2 font-medium text-white">{row.Produk || '-'}</td>
                            <td className="px-3 py-2">{row.Qty || 0}</td>
                            <td className="px-3 py-2">Rp {row.Total?.toLocaleString() || 0}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    <p className="text-xs mt-2 italic text-slate-600">Menampilkan 3 baris pertama saja.</p>
                  </div>
                </div>
              </div>
            )}

          </div>
        </main>
      </div>
    </div>
  );
}

export default App;