import React, { useState, useEffect } from 'react';
import { PropertyReport } from '../types';
import { Sparkles, Send, Bot, Database, Compass, CheckCircle2, AlertTriangle, Loader2 } from 'lucide-react';

interface AiSynthesisTabProps {
  report: PropertyReport;
}

interface Message {
  sender: 'user' | 'ai';
  text: string;
  time: string;
}

export const AiSynthesisTab: React.FC<AiSynthesisTabProps> = ({ report }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputPrompt, setInputPrompt] = useState('');
  const [loading, setLoading] = useState(false);

  const quickPrompts = [
    'Quels sont les meilleurs arguments pour négocier le prix d\'achat?',
    'Quel est le risque financier lié au DPE et aux travaux de rénovation?',
    'Analyser l\'évolution de la valeur foncière DVF par rapport à la ville.',
    'Synthèse des risques naturels Géorisques (PPRI et argiles).',
  ];

  // Auto-fetch initial report synthesis on mount
  useEffect(() => {
    let isMounted = true;

    async function fetchInitialSynthesis() {
      setLoading(true);
      try {
        const res = await fetch('/api/ai/report', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ propertyReport: report }),
        });

        const data = await res.json();
        if (!isMounted) return;

        setMessages([
          {
            sender: 'ai',
            text: data.synthesis || data.error || 'Erreur lors de la génération de la synthèse d\'expertise.',
            time: 'À l\'instant',
          },
        ]);
      } catch (err) {
        if (!isMounted) return;
        setMessages([
          {
            sender: 'ai',
            text: 'Désolé, une erreur est survenue lors de la communication avec le service Briquia AI.',
            time: 'À l\'instant',
          },
        ]);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    fetchInitialSynthesis();

    return () => { isMounted = false; };
  }, [report.address.address]);

  const handleSend = async (customText?: string) => {
    const textToSend = customText || inputPrompt;
    if (!textToSend.trim() || loading) return;

    const userMsg: Message = {
      sender: 'user',
      text: textToSend,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputPrompt('');
    setLoading(true);

    try {
      const res = await fetch('/api/ai/report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          propertyReport: report,
          userQuestion: textToSend,
        }),
      });

      const data = await res.json();

      const aiMsg: Message = {
        sender: 'ai',
        text: data.synthesis || data.error || 'Impossible d\'analyser la requête.',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          sender: 'ai',
          text: 'Erreur réseau lors de la communication avec Briquia AI.',
          time: 'Maintenant',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      
      {/* Header */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-bold shadow-sm">
          <Bot className="w-7 h-7 stroke-[2.5]" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-slate-900">Synthèse IA & Expert Immobilier</h1>
            <span className="bg-emerald-50 text-emerald-800 text-xs font-bold px-2.5 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              Gemini 3.6 Flash
            </span>
          </div>
          <p className="text-xs text-slate-600 mt-1 font-medium">Analyse croisée de l'ensemble des indicateurs fonciers pour vous guider lors de votre achat ou négociation.</p>
        </div>
      </div>

      {/* Suggested Questions */}
      <div className="space-y-2">
        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Questions Fréquentes sur cet Emplacement</span>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {quickPrompts.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(q)}
              disabled={loading}
              className="text-left p-3 rounded-2xl bg-white hover:bg-slate-50 text-slate-700 hover:text-slate-900 text-xs font-semibold border border-slate-200 transition-all flex items-center justify-between group shadow-2xs"
            >
              <span className="line-clamp-1">{q}</span>
              <Compass className="w-4 h-4 text-emerald-600 opacity-60 group-hover:opacity-100 flex-shrink-0 ml-2" />
            </button>
          ))}
        </div>
      </div>

      {/* Chat / Synthesis Box */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-[520px]">
        
        {/* Messages Container */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1 custom-scrollbar">
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`flex items-start gap-3 ${m.sender === 'user' ? 'flex-row-reverse' : ''}`}
            >
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs flex-shrink-0 ${
                m.sender === 'user' ? 'bg-blue-600 text-white' : 'bg-emerald-600 text-white'
              }`}>
                {m.sender === 'user' ? 'Vous' : <Bot className="w-4 h-4" />}
              </div>

              <div className={`max-w-[85%] p-4 rounded-2xl text-xs leading-relaxed space-y-2 ${
                m.sender === 'user'
                  ? 'bg-blue-600 text-white font-bold rounded-tr-none'
                  : 'bg-slate-50 text-slate-800 border border-slate-200 rounded-tl-none whitespace-pre-wrap font-sans'
              }`}>
                <div>{m.text}</div>
                <span className={`block text-[10px] mt-1 ${m.sender === 'user' ? 'text-blue-200 font-medium' : 'text-slate-400 font-mono'}`}>
                  {m.time}
                </span>
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-200">
                <Loader2 className="w-4 h-4 animate-spin" />
              </div>
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-600 font-medium">
                Analyse et évaluation foncière de l'emplacement en cours...
              </div>
            </div>
          )}
        </div>

        {/* Input Form */}
        <div className="p-4 bg-slate-50 border-t border-slate-200">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              placeholder="Posez votre question sur ce bien (négociation, travaux, fiscalité, plus-value...)..."
              value={inputPrompt}
              onChange={(e) => setInputPrompt(e.target.value)}
              disabled={loading}
              className="flex-1 bg-white text-slate-900 placeholder-slate-400 text-xs px-4 py-3.5 rounded-2xl border border-slate-200 focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 shadow-2xs"
            />

            <button
              type="submit"
              disabled={!inputPrompt.trim() || loading}
              className={`p-3.5 rounded-2xl transition-all shadow-xs ${
                !inputPrompt.trim() || loading
                  ? 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200'
                  : 'bg-emerald-600 hover:bg-emerald-700 text-white font-bold'
              }`}
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>

      </div>

    </div>
  );
};
