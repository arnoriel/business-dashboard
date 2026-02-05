import React, { useState, useEffect } from 'react';
import { 
  BarChart2, 
  Info, 
  UploadCloud, 
  Loader2, 
  ChevronDown,
  History,
  FileSpreadsheet,
  Trash2,
  LogOut,
  Lock,
  CheckCircle2,
  AlertCircle,
  X,
  Eye,
  EyeOff
} from 'lucide-react';
import { analyzeBusinessPerformance } from './services/AI';
import { generateDummyExcel, readExcelFile, exportAnalysisToExcel } from './utils/excel';
import Chatbot from './components/Chatbot'; 
import ShopeeBoards from './components/ShopeeBoards';
import TokopediaTiktokBoards from './components/TokopediaTiktokBoards';

// --- Type Definitions ---
interface AnalysisResult {
  id: string;
  platform: string;
  raw: any[];
  analysis: string | null;
  timestamp: string;
}

type ViewPage = 'performa' | 'shopee' | 'tokopedia';

interface ToastProps {
  message: string;
  type: 'success' | 'error';
  onClose: () => void;
}

// --- Komponen Toast ---
const Toast = ({ message, type, onClose }: ToastProps) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={`fixed top-5 right-5 z-[100] flex items-center gap-3 px-5 py-3 rounded-lg shadow-2xl animate-in fade-in slide-in-from-top-4 duration-300 ${
      type === 'success' ? 'bg-emerald-600 text-white' : 'bg-red-600 text-white'
    }`}>
      {type === 'success' ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
      <span className="text-sm font-medium">{message}</span>
      <button onClick={onClose} className="ml-2 hover:opacity-70"><X size={16} /></button>
    </div>
  );
};

function App() {
  // --- AUTH & UI STATES ---
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false); // State baru untuk show/hide password
  const [showLogoutModal, setShowLogoutModal] = useState(false); // Modal untuk Logout
  const [globalLoading, setGlobalLoading] = useState(false);
  const [toast, setToast] = useState<{message: string, type: 'success' | 'error'} | null>(null);

  // --- APP STATES ---
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [platform, setPlatform] = useState('');
  const [history, setHistory] = useState<AnalysisResult[]>([]);
  const [selectedAnalysis, setSelectedAnalysis] = useState<AnalysisResult | null>(null);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [activeView, setActiveView] = useState<ViewPage>('performa');
  const [isInfoOpen, setIsInfoOpen] = useState(false);
  const [isAnalisisOpen, setIsAnalisisOpen] = useState(true);

  // Load Status Awal
  useEffect(() => {
    const authStatus = localStorage.getItem('isLogin');
    if (authStatus === 'true') {
      setIsLoggedIn(true);
    }
    const saved = localStorage.getItem('businessAnalysisHistory');
    if (saved) {
      const parsedHistory = JSON.parse(saved);
      setHistory(parsedHistory);
      if (parsedHistory.length > 0) setSelectedAnalysis(parsedHistory[0]);
    }
  }, []);

  // --- HANDLERS ---
  const triggerToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) return triggerToast("Harap isi semua kolom!", "error");
    
    setGlobalLoading(true);
    // Simulasi loading progress sebentar
    setTimeout(() => {
      if (username === 'roberto' && password === 'password') {
        localStorage.setItem('isLogin', 'true');
        setIsLoggedIn(true);
        triggerToast("Login Berhasil! Selamat datang Roberto.", "success");
      } else {
        triggerToast("Username atau Password salah!", "error");
      }
      setGlobalLoading(false);
    }, 1200);
  };

  const confirmLogout = () => {
    setShowLogoutModal(false);
    setGlobalLoading(true);
    setTimeout(() => {
      localStorage.removeItem('isLogin');
      setIsLoggedIn(false);
      setUsername(''); // Clear Input Username
      setPassword(''); // Clear Input Password
      setShowPassword(false); // Reset visibilitas password
      setGlobalLoading(false);
      triggerToast("Logout Berhasil. Sampai jumpa!", "success");
    }, 1000);
  };

  const handleFileDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) return triggerToast("Pilih file terlebih dahulu!", "error");
    if (!platform) return triggerToast("Pilih platform terlebih dahulu!", "error");

    setLoading(true);
    try {
      const jsonData = await readExcelFile(file);
      const aiResult = await analyzeBusinessPerformance(jsonData, platform);
      
      const newResult: AnalysisResult = {
        id: Date.now().toString(),
        platform: platform,
        raw: jsonData,
        analysis: aiResult,
        timestamp: new Date().toLocaleString()
      };
      
      const updatedHistory = [newResult, ...history];
      setHistory(updatedHistory);
      setSelectedAnalysis(newResult);
      localStorage.setItem('businessAnalysisHistory', JSON.stringify(updatedHistory));
      setFile(null);
      triggerToast("Analisa selesai!", "success");
    } catch (error) {
      triggerToast("Terjadi kesalahan saat analisa.", "error");
    } finally {
      setLoading(false);
    }
  };

  const deleteHistory = (id: string) => {
    const filtered = history.filter(item => item.id !== id);
    setHistory(filtered);
    localStorage.setItem('businessAnalysisHistory', JSON.stringify(filtered));
    if (selectedAnalysis?.id === id) setSelectedAnalysis(null);
    triggerToast("Riwayat dihapus.", "success");
  };

  // --- RENDER LOADING OVERLAY ---
  if (globalLoading) {
    return (
      <div className="h-screen bg-dark-900 flex flex-col items-center justify-center space-y-4">
        <Loader2 size={48} className="text-primary-500 animate-spin" />
        <div className="flex flex-col items-center">
          <p className="text-white font-bold text-lg animate-pulse tracking-tight">SellerSol</p>
          <p className="text-slate-500 text-sm">Sedang memproses...</p>
        </div>
      </div>
    );
  }

  // --- RENDER LOGIN PAGE ---
  if (!isLoggedIn) {
    return (
      <div className="h-screen bg-dark-900 flex items-center justify-center p-4 relative overflow-hidden">
        {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
        
        {/* Background Decorative Blur */}
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary-600/10 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/10 rounded-full blur-[120px]"></div>

        <div className="bg-dark-800 border border-dark-700 p-8 rounded-2xl w-full max-w-md shadow-2xl relative z-10 backdrop-blur-sm animate-in fade-in zoom-in-95 duration-500">
          <div className="flex flex-col items-center mb-10">
            <div className="bg-gradient-to-br from-primary-500 to-primary-700 p-4 rounded-2xl shadow-lg shadow-primary-500/20 mb-4">
              <Lock className="text-white" size={28} />
            </div>
            <h2 className="text-3xl font-black text-white tracking-tight">SellerSol</h2>
            <p className="text-slate-500 text-sm mt-1 uppercase tracking-widest font-bold">Admin Portal</p>
          </div>

          <form onSubmit={handleLoginSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase mb-2 ml-1 tracking-wider">Username</label>
              <input 
                type="text" 
                className="w-full bg-dark-900/50 border border-dark-700 rounded-xl px-4 py-3 text-white outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all placeholder:text-slate-700"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="username"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase mb-2 ml-1 tracking-wider">Password</label>
              <div className="relative">
                <input 
                  type={showPassword ? "text" : "password"} 
                  className="w-full bg-dark-900/50 border border-dark-700 rounded-xl px-4 py-3 pr-12 text-white outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all placeholder:text-slate-700"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="password"
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-primary-500 transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>
            <button type="submit" className="w-full bg-primary-600 hover:bg-primary-500 text-white font-bold py-3.5 rounded-xl transition-all active:scale-[0.98] shadow-lg shadow-primary-600/20 mt-2">
              Masuk Sekarang
            </button>
          </form>
        </div>
      </div>
    );
  }

  // --- MAIN APP RENDER ---
  return (
    <div className="flex h-screen bg-dark-900 text-slate-300 font-sans overflow-hidden">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      
      {/* --- SIDEBAR --- */}
      <aside className="w-64 bg-dark-900 border-r border-dark-800 flex flex-col">
        <div className="p-6 flex items-center gap-2">
          <div className="bg-white p-1 rounded shadow-sm">
             <div className="w-6 h-6 bg-primary-600 rounded-sm"></div>
          </div>
          <span className="text-white font-bold text-xl tracking-wide">SellerSol</span>
        </div>

        <div className="px-4 py-2 text-xs font-bold text-slate-600 uppercase tracking-widest">Utama</div>
        
        <nav className="flex-1 px-2 space-y-1 mt-2">
          <div className="group">
            <button 
              onClick={() => setIsAnalisisOpen(!isAnalisisOpen)}
              className={`w-full flex items-center justify-between p-3 rounded-lg transition ${activeView === 'performa' ? 'text-white bg-dark-800' : 'text-slate-400 hover:text-white hover:bg-dark-800'}`}
            >
              <div className="flex items-center gap-3">
                <BarChart2 size={20} />
                <span className="font-medium">Analisis Cerdas</span>
              </div>
              <ChevronDown size={16} className={`transition-transform ${isAnalisisOpen ? 'rotate-0' : '-rotate-90'}`} />
            </button>
            {isAnalisisOpen && (
              <div className="pl-10 mt-1 space-y-1">
                <button 
                  onClick={() => setActiveView('performa')}
                  className={`w-full text-left py-2 text-sm transition ${activeView === 'performa' ? 'text-primary-500 font-medium' : 'text-slate-400 hover:text-slate-200'}`}
                >
                  Performa Toko
                </button>
              </div>
            )}
          </div>

          <div className="group">
            <button 
              onClick={() => setIsInfoOpen(!isInfoOpen)}
              className={`w-full flex items-center justify-between p-3 rounded-lg transition ${activeView === 'shopee' || activeView === 'tokopedia' ? 'text-white bg-dark-800' : 'text-slate-400 hover:text-white hover:bg-dark-800'}`}
            >
              <div className="flex items-center gap-3">
                <Info size={20} />
                <span className="font-medium">Informasi</span>
              </div>
              <ChevronDown size={16} className={`transition-transform ${isInfoOpen ? 'rotate-0' : '-rotate-90'}`} />
            </button>
            {isInfoOpen && (
              <div className="pl-10 mt-1 space-y-1">
                <button 
                  onClick={() => setActiveView('shopee')}
                  className={`w-full text-left py-2 text-sm transition ${activeView === 'shopee' ? 'text-primary-500 font-medium' : 'text-slate-400 hover:text-slate-200'}`}
                >
                  Shopee
                </button>
                <button 
                  onClick={() => setActiveView('tokopedia')}
                  className={`w-full text-left py-2 text-sm transition ${activeView === 'tokopedia' ? 'text-primary-500 font-medium' : 'text-slate-400 hover:text-slate-200'}`}
                >
                  Tokopedia & TikTok
                </button>
              </div>
            )}
          </div>
        </nav>

        {/* --- TOMBOL LOGOUT (Memicu Modal) --- */}
        <div className="p-4 border-t border-dark-800 bg-dark-900/50">
          <button 
            onClick={() => setShowLogoutModal(true)}
            className="w-full flex items-center gap-3 p-3 rounded-xl text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors group"
          >
            <LogOut size={20} className="group-hover:translate-x-1 transition-transform" />
            <span className="font-semibold text-sm">Keluar Akun</span>
          </button>
        </div>
      </aside>

      {/* --- MAIN CONTENT --- */}
      <div className="flex-1 flex flex-col overflow-hidden relative">
        <header className="h-16 border-b border-dark-800 bg-dark-900/80 backdrop-blur-md flex items-center justify-between px-6 z-10">
          <div>
            <h1 className="text-xl font-bold text-white tracking-tight">Dasbor Utama</h1>
            <p className="text-xs text-slate-500 font-medium">Data penjualan yang simpel & terpusat.</p>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3 pl-4 border-l border-dark-700">
              <div className="text-right hidden sm:block">
                <p className="text-white font-bold text-sm leading-none">Roberto Carlos</p>
                <p className="text-[10px] text-primary-500 font-bold uppercase tracking-tighter mt-1">Analyzer Pro</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 to-primary-600 flex items-center justify-center text-white font-black shadow-lg shadow-primary-900/20">
                RC
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-8 bg-dark-900">
          <div className="max-w-6xl mx-auto">
            
            {activeView === 'performa' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                
                {/* Kolom Kiri: Form Input & History */}
                <div className="lg:col-span-1 space-y-6">
                  <div className="bg-dark-800 border border-dark-700 rounded-2xl p-6 shadow-xl ring-1 ring-white/5">
                    <div className="flex justify-between items-center mb-5">
                      <h3 className="font-bold text-white flex items-center gap-2">
                        <UploadCloud size={18} className="text-primary-500" />
                        Upload Data
                      </h3>
                      <button onClick={generateDummyExcel} className="text-[10px] font-bold px-2 py-1 bg-primary-500/10 text-primary-500 rounded hover:bg-primary-500/20 transition-colors">
                        GET DUMMY
                      </button>
                    </div>
                    
                    <div className="space-y-4">
                      <select 
                        value={platform}
                        onChange={(e) => setPlatform(e.target.value)}
                        className="w-full bg-dark-900 border border-dark-700 text-slate-300 text-sm rounded-xl px-3 py-2.5 outline-none focus:border-primary-500 transition-all"
                      >
                        <option value="" disabled>Pilih Platform</option>
                        <option value="Shopee">Shopee</option>
                        <option value="Tokopedia">Tokopedia</option>
                        <option value="Tiktok Shop">Tiktok Shop</option>
                      </select>

                      <div 
                        onDrop={handleFileDrop}
                        onDragOver={(e) => e.preventDefault()}
                        className="border-2 border-dashed border-dark-700 bg-dark-900/50 rounded-2xl p-6 text-center cursor-pointer hover:border-primary-500/50 hover:bg-primary-500/5 transition-all group"
                      >
                        <input 
                          type="file" 
                          accept=".xlsx, .xls"
                          onChange={(e) => e.target.files && setFile(e.target.files[0])}
                          className="hidden" 
                          id="file-upload"
                        />
                        <label htmlFor="file-upload" className="cursor-pointer">
                          <UploadCloud size={32} className="text-slate-600 mx-auto mb-3 group-hover:text-primary-500 transition-colors" />
                          <span className="text-xs font-medium text-slate-400 block truncate px-2">
                            {file ? file.name : "Seret file atau klik di sini"}
                          </span>
                        </label>
                      </div>

                      <button 
                        onClick={handleUpload}
                        disabled={loading}
                        className="w-full bg-primary-600 hover:bg-primary-500 text-white py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2 disabled:opacity-50 shadow-lg shadow-primary-900/20 active:scale-[0.98] transition-all"
                      >
                        {loading ? <Loader2 size={18} className="animate-spin" /> : "Mulai Analisa Sekarang"}
                      </button>
                    </div>
                  </div>

                  <div className="bg-dark-800 border border-dark-700 rounded-2xl p-6 ring-1 ring-white/5">
                    <h3 className="font-bold text-white mb-5 flex items-center gap-2 text-sm">
                      <History size={18} className="text-purple-500" /> Riwayat Analisa
                    </h3>
                    <div className="space-y-3 max-h-[380px] overflow-y-auto pr-2 custom-scrollbar">
                      {history.length === 0 && (
                        <div className="py-10 text-center">
                          <p className="text-xs text-slate-600 italic">Belum ada riwayat analisa.</p>
                        </div>
                      )}
                      {history.map((item) => (
                        <div 
                          key={item.id}
                          onClick={() => setSelectedAnalysis(item)}
                          className={`group p-4 rounded-xl border-2 cursor-pointer transition-all flex justify-between items-start ${
                            selectedAnalysis?.id === item.id 
                            ? 'bg-primary-600/10 border-primary-500 shadow-md' 
                            : 'bg-dark-900/50 border-dark-700 hover:border-slate-600'
                          }`}
                        >
                          <div className="overflow-hidden">
                            <p className="text-xs font-black text-white truncate uppercase tracking-wider">{item.platform}</p>
                            <p className="text-[10px] text-slate-500 font-medium mt-1">{item.timestamp}</p>
                          </div>
                          <button 
                            onClick={(e) => { e.stopPropagation(); deleteHistory(item.id); }}
                            className="p-1.5 opacity-0 group-hover:opacity-100 text-slate-500 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Kolom Kanan: Hasil Detail */}
                <div className="lg:col-span-2">
                  {selectedAnalysis ? (
                    <div className="bg-dark-800 border border-dark-700 rounded-2xl flex flex-col h-full shadow-2xl ring-1 ring-white/5 overflow-hidden">
                      <div className="p-6 border-b border-dark-700 flex flex-wrap gap-4 justify-between items-center bg-dark-800/80 backdrop-blur-sm">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="px-2 py-0.5 bg-primary-500 text-white text-[10px] font-black rounded uppercase tracking-tighter">
                              {selectedAnalysis.platform}
                            </span>
                            <h2 className="text-lg font-bold text-white">Hasil Analisis</h2>
                          </div>
                          <p className="text-xs text-slate-500 font-medium">{selectedAnalysis.timestamp}</p>
                        </div>
                       <button 
                        onClick={() => exportAnalysisToExcel(selectedAnalysis.analysis || '', selectedAnalysis.raw, selectedAnalysis.platform)}
                        className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-5 py-2.5 rounded-xl text-xs font-bold transition-all shadow-lg shadow-emerald-900/20 active:scale-[0.98]"
                      >
                        <FileSpreadsheet size={16} /> Export Excel
                      </button>
                      </div>

                      <div className="p-8 overflow-y-auto">
                        <div className="prose prose-invert max-w-none prose-sm prose-h3:text-primary-400 prose-strong:text-white prose-p:text-slate-300">
                          <div dangerouslySetInnerHTML={{ __html: selectedAnalysis.analysis || '' }} />
                        </div>

                        <div className="mt-12 bg-dark-900/50 rounded-2xl p-6 border border-dark-700">
                          <h4 className="text-white text-sm font-bold mb-4 flex items-center gap-2">
                            <div className="w-1.5 h-4 bg-primary-500 rounded-full"></div> 
                            Pratinjau Data Penjualan
                          </h4>
                          <div className="overflow-x-auto rounded-xl border border-dark-700 bg-dark-950">
                            <table className="w-full text-left text-[11px] text-slate-400 border-collapse">
                              <thead>
                                <tr className="bg-dark-800 text-slate-200 border-b border-dark-700">
                                  <th className="px-5 py-3 font-bold uppercase tracking-wider">Produk</th>
                                  <th className="px-5 py-3 font-bold uppercase tracking-wider">Kategori</th>
                                  <th className="px-5 py-3 font-bold uppercase tracking-wider text-right">Qty</th>
                                  <th className="px-5 py-3 font-bold uppercase tracking-wider text-right">Total</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-dark-800">
                                {selectedAnalysis.raw.slice(0, 5).map((row, idx) => (
                                  <tr key={idx} className="hover:bg-primary-500/5 transition-colors">
                                    <td className="px-5 py-3 text-slate-200 font-bold">{row.Produk || row.produk || '-'}</td>
                                    <td className="px-5 py-3 font-medium">{row.Kategori || row.kategori || '-'}</td>
                                    <td className="px-5 py-3 text-right font-mono">{row.Qty || row.qty || 0}</td>
                                    <td className="px-5 py-3 text-right font-bold text-white">Rp {(row.Total || row.total || 0).toLocaleString()}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="h-full min-h-[500px] border-2 border-dashed border-dark-800 rounded-3xl flex flex-col items-center justify-center text-slate-600 bg-dark-800/20 shadow-inner">
                      <div className="bg-dark-800 p-6 rounded-3xl mb-4 shadow-xl">
                        <BarChart2 size={56} className="text-dark-700" />
                      </div>
                      <p className="text-sm font-medium">Silakan pilih riwayat atau buat analisa baru.</p>
                      <p className="text-xs text-slate-700 mt-2">Visualisasi data akan muncul di sini.</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeView === 'shopee' && <ShopeeBoards />}
            {activeView === 'tokopedia' && <TokopediaTiktokBoards />}

          </div>
        </main>
      </div>

      {/* --- MODAL KONFIRMASI LOGOUT --- */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-dark-800 border border-dark-700 p-6 rounded-2xl max-w-sm w-full shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex items-center gap-3 text-red-500 mb-4">
              <LogOut size={24} />
              <h3 className="text-lg font-bold text-white">Konfirmasi Keluar</h3>
            </div>
            <p className="text-slate-400 text-sm mb-6 leading-relaxed">
              Apakah Anda yakin ingin keluar dari sistem? Anda harus login kembali untuk mengakses data.
            </p>
            <div className="flex gap-3">
              <button 
                onClick={() => setShowLogoutModal(false)}
                className="flex-1 px-4 py-2.5 rounded-xl bg-dark-700 text-slate-300 font-bold hover:bg-dark-600 transition"
              >
                Batal
              </button>
              <button 
                onClick={confirmLogout}
                className="flex-1 px-4 py-2.5 rounded-xl bg-red-600 text-white font-bold hover:bg-red-500 transition shadow-lg shadow-red-900/20"
              >
                Ya, Keluar
              </button>
            </div>
          </div>
        </div>
      )}

      <Chatbot isOpen={isChatOpen} setIsOpen={setIsChatOpen} />
    </div>
  );
}

export default App;
