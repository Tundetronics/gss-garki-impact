import React, { useState } from 'react';
import { Monitor, X, LayoutDashboard, Heart, ShieldCheck } from 'lucide-react';

/**
 * Gift 3 - Principal Strategic Dashboard
 * RC Abuja HighRise Vocational Project 2026
 * Architect: Rtn. Babatunde Adesina — The Agentic Orchestrator
 */

const apiKey = ""; 

const App = () => {
  const [val, setVal] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const sanitize = (text) => text.replace(/[*#_~`\[\]()<>|]/g, '').trim();

  const callAI = async (prompt) => {
    setIsProcessing(true);
    const sys = "Strategic institutional consultant. Analyze school resource optimization. Use PLAIN CONVERSATIONAL TEXT ONLY. No markdown symbols.";
    const delays = [1000, 2000, 4000];
    
    for (let i = 0; i <= delays.length; i++) {
      try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`, { 
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }], systemInstruction: { parts: [{ text: sys }] } }) 
        });
        if (!response.ok) throw new Error();
        const data = await response.json();
        setResult(sanitize(data.candidates?.[0]?.content?.parts?.[0]?.text || ""));
        setShowModal(true);
        setIsProcessing(false);
        return;
      } catch (e) {
        if (i === delays.length) {
          setResult("Network Interrupted. Retry.");
          setShowModal(true);
          setIsProcessing(false);
        } else {
          await new Promise(res => setTimeout(res, delays[i]));
        }
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col font-sans selection:bg-yellow-500">
      <nav className="p-6 border-b border-yellow-500/20 bg-black flex justify-between items-center sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <Monitor className="text-yellow-500" size={28} />
          <span className="font-black uppercase tracking-widest text-sm leading-none">RC Abuja HighRise Dashboard</span>
        </div>
        <ShieldCheck className="text-white/20" />
      </nav>
      <main className="flex-1 flex flex-col items-center justify-center p-6 text-center space-y-12">
        <h1 className="text-6xl font-black uppercase italic tracking-tighter leading-none">Principal <br/><span className="text-yellow-500 not-italic">Dashboard</span></h1>
        <div className="w-full max-w-xl bg-white/5 p-12 rounded-[50px] border border-white/10 shadow-2xl space-y-6 backdrop-blur-md">
          <input value={val} onChange={(e) => setVal(e.target.value)} className="w-full bg-black/40 p-6 rounded-2xl text-center text-xl outline-none border border-white/10 focus:border-yellow-500 transition-all" placeholder="Audit Target: e.g. Laboratory Resources" />
          <button disabled={isProcessing || !val.trim()} onClick={() => callAI(`Optimize resource: ${val}`)} className="w-full bg-yellow-500 py-6 rounded-2xl font-black text-xl uppercase text-slate-900 tracking-widest shadow-xl hover:bg-yellow-400 active:scale-95 transition-all">
            {isProcessing ? "Analyzing..." : "Execute Strategic Audit"}
          </button>
        </div>
      </main>
      <footer className="bg-[#002147] h-24 border-t-8 border-yellow-500 flex items-center justify-between px-10 mt-auto">
        <div className="text-left font-black uppercase tracking-widest"><p className="text-xs text-white">Strategic Intelligence Unit</p><p className="text-[10px] text-yellow-500/50">Rtn. Babatunde Adesina</p></div>
        <LayoutDashboard className="text-white/20" size={24} />
      </footer>
      {showModal && (
        <div className="fixed inset-0 bg-black/98 z-[100] flex items-center justify-center p-6 animate-in zoom-in duration-300">
          <div className="bg-slate-800 border border-yellow-500/20 rounded-[40px] w-full max-w-5xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
            <div className="p-8 border-b border-white/10 flex justify-between items-center bg-white/5">
              <h2 className="text-2xl font-black uppercase tracking-tighter text-yellow-500">Analysis Result</h2>
              <button onClick={() => setShowModal(false)} className="bg-white/5 p-3 rounded-xl hover:bg-red-500 transition-colors border border-white/10"><X/></button>
            </div>
            <div className="flex-1 overflow-y-auto p-12 text-xl text-slate-200 leading-relaxed whitespace-pre-wrap font-light">{result}</div>
          </div>
        </div>
      )}
    </div>
  );
};
export default App;
