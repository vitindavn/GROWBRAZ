
import React, { useState, useRef, useEffect } from 'react';
import { Plant } from '../types';
import { getAIGrowAdvice } from '../services/geminiService';
import { PaperAirplaneIcon, SparklesIcon, UserIcon } from '@heroicons/react/24/solid';

interface AIAssistantProps {
  plants: Plant[];
}

interface Message {
  role: 'user' | 'ai';
  text: string;
}

const AIAssistant: React.FC<AIAssistantProps> = ({ plants }) => {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'ai', text: "Olá! Eu sou o seu Consultor GrowBraZ IA Pro. Pergunte-me qualquer coisa sobre seus cultivos, pragas ou nutrição." }
  ]);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!query.trim() || loading) return;

    const userMsg = query;
    setQuery('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setLoading(true);

    // Default to the first plant for context if available
    const advice = await getAIGrowAdvice(plants[0], userMsg);
    
    setMessages(prev => [...prev, { role: 'ai', text: advice }]);
    setLoading(false);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-180px)] animate-in zoom-in-95 duration-500">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
          <SparklesIcon className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className="text-xl font-bold">Especialista de Cultivo IA</h2>
          <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Alimentado por Gemini Pro</p>
        </div>
      </div>

      <div className="flex-1 bg-slate-800/30 rounded-3xl border border-slate-800 p-4 overflow-y-auto space-y-4 mb-4">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] rounded-2xl p-4 flex gap-3 ${
              msg.role === 'user' 
                ? 'bg-emerald-500 text-slate-900 font-medium rounded-tr-none' 
                : 'bg-slate-800 border border-slate-700 text-slate-200 rounded-tl-none'
            }`}>
              {msg.role === 'ai' && <SparklesIcon className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />}
              <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.text}</p>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-slate-800 border border-slate-700 rounded-2xl rounded-tl-none p-4 flex gap-2">
              <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce delay-100"></div>
              <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce delay-200"></div>
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      <div className="relative">
        <input 
          type="text" 
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Pergunte sobre nutrientes, pH, iluminação..."
          className="w-full bg-slate-800 border border-slate-700 rounded-2xl py-4 pl-6 pr-14 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 text-slate-100 placeholder:text-slate-500"
        />
        <button 
          onClick={handleSend}
          disabled={loading || !query.trim()}
          className="absolute right-2 top-2 bottom-2 w-10 bg-emerald-500 text-slate-900 rounded-xl flex items-center justify-center hover:bg-emerald-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-lg"
        >
          <PaperAirplaneIcon className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default AIAssistant;
