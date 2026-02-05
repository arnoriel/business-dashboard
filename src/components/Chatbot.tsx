import React, { useState, useRef, useEffect } from "react";
import { MessageSquare, X, Send, Bot } from "lucide-react";
import { getChatbotResponse } from "../services/aichatbot";
import ReactMarkdown from "react-markdown"; // 1. Import library ini

interface ChatbotProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

const Chatbot = ({ isOpen, setIsOpen }: ChatbotProps) => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<
    { role: "user" | "assistant"; content: string }[]
  >([]);
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isOpen]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMsg = input;
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: userMsg }]);
    setIsLoading(true);

    const history = messages.slice(-5);
    const aiResponse = await getChatbotResponse(userMsg, history);

    setMessages((prev) => [
      ...prev,
      { role: "assistant", content: aiResponse || "" },
    ]);
    setIsLoading(false);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end font-sans">
      {isOpen && (
        <div className="bg-dark-800 border border-dark-700 w-80 md:w-96 h-[550px] rounded-2xl shadow-2xl flex flex-col mb-4 overflow-hidden animate-fade-in-up">
          {/* Header */}
          <div className="bg-primary-600 p-4 flex justify-between items-center text-white shadow-lg">
            <div className="flex items-center gap-2">
              <div className="bg-white/20 p-1.5 rounded-lg">
                <Bot size={20} className="text-white" />
              </div>
              <div>
                <span className="font-bold text-sm block">
                  SellerSol Assistant
                </span>
                <span className="text-[10px] text-primary-100 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></span>{" "}
                  Online
                </span>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="hover:bg-primary-700 p-1.5 rounded-full transition"
            >
              <X size={18} />
            </button>
          </div>

          {/* Messages Area */}
          <div
            ref={scrollRef}
            className="flex-1 overflow-y-auto p-4 space-y-4 bg-dark-900/50"
          >
            {messages.length === 0 && (
              <div className="bg-dark-800 border border-dark-700 rounded-xl p-4 text-center mt-4">
                <p className="text-slate-300 text-sm font-medium">
                  👋 Halo Roberto!
                </p>
                <p className="text-slate-500 text-xs mt-1">
                  Saya asisten SellerSol. Ada yang bisa dibantu mengenai
                  dashboard Anda?
                </p>
              </div>
            )}

            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] p-3 rounded-2xl text-sm leading-relaxed ${
                    msg.role === "user"
                      ? "bg-primary-600 text-white rounded-tr-none shadow-md"
                      : "bg-dark-700 text-slate-200 rounded-tl-none border border-dark-600 shadow-sm"
                  }`}
                >
                  {/* Bungkus dengan div untuk styling Tailwind Prose */}
                  <div
                    className="prose prose-invert prose-sm max-w-none 
                    prose-p:leading-relaxed prose-pre:bg-dark-900 prose-li:my-1 
                    prose-strong:text-white prose-strong:font-bold"
                  >
                    <ReactMarkdown>{msg.content}</ReactMarkdown>
                  </div>
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-dark-700 p-3 rounded-xl rounded-tl-none border border-dark-600">
                  <div className="flex gap-1">
                    <span className="w-1.5 h-1.5 bg-primary-500 rounded-full animate-bounce"></span>
                    <span className="w-1.5 h-1.5 bg-primary-500 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                    <span className="w-1.5 h-1.5 bg-primary-500 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Input Area */}
          <form
            onSubmit={handleSendMessage}
            className="p-4 border-t border-dark-700 bg-dark-800"
          >
            <div className="flex gap-2 bg-dark-900 border border-dark-700 rounded-xl px-3 py-1 focus-within:border-primary-500 transition">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Tanya sesuatu..."
                className="flex-1 bg-transparent text-slate-300 text-sm py-2 outline-none"
              />
              <button
                type="submit"
                className="text-primary-500 hover:text-primary-400 disabled:opacity-50 transition"
                disabled={!input.trim() || isLoading}
              >
                <Send size={18} />
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Floating Button */}
      <div className="flex items-center gap-3">
        {/* Tooltip - Sekarang di sebelah kiri dan warna oranye */}
        {!isOpen && (
          <div className="bg-primary-500 text-white px-4 py-2 rounded-xl shadow-lg text-sm font-medium animate-bounce-horizontal relative hidden md:block whitespace-nowrap">
            Tanya SellerSol Assistant
            {/* Arrow/Segitiga Kecil Oranye */}
            <div className="absolute right-[-6px] top-1/2 -translate-y-1/2 w-0 h-0 border-t-[6px] border-t-transparent border-l-[8px] border-l-primary-500 border-b-[6px] border-b-transparent"></div>
          </div>
        )}

        {/* Floating Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="bg-primary-500 hover:bg-primary-600 text-white p-4 rounded-full shadow-2xl transition-all hover:scale-110 active:scale-95 group shrink-0"
        >
          {isOpen ? (
            <X size={24} />
          ) : (
            <div className="relative">
              <MessageSquare size={24} />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 border-2 border-white rounded-full"></span>
            </div>
          )}
        </button>
      </div>
    </div>
  );
};

export default Chatbot;
