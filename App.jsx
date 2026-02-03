import React, { useState } from 'react';
import { Monitor, X, LayoutDashboard } from 'lucide-react';

const apiKey = ""; 

const App = () => {
  const [val, setVal] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const cleanText = (text) => {
    return text.replace(/[*#_~`\[\]()<>|]/g, '').trim();
  };

  const callAI = async (prompt) => {
    setIsProcessing(true);
    const sys = "Strategic consultant for GSS Garki. Provide resource optimization analysis. PLAIN TEXT ONLY. No markdown, no symbols. Professional paragraphs.";
    try {
      const r = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`, { 
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }], systemInstruction: { parts: [{ text: sys }] } }) 
      });
      const d = await r.json();
      return cleanText(d.candidates[0].content.parts[0].text);
    } catch (e) { return "Network Interrupt."; } finally { setIsProcessing(false); }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col font-sans">
      <nav className="p-6 border-b border-yellow-500/20 bg-black flex justify-between items-center">
        <div className="flex items-center gap-3 font-black uppercase text-sm text-yellow-500"><Monitor/><span className="tracking-widest">RC Abuja HighRise</span></div>
        <img src="https://upload.wikimedia.org/wikipedia/en/thumb/0/06/Rotary_International_logo.svg/1200px-Rotary_International_logo.svg.png" className="h-10 brightness-0 invert" alt="Rotary" />
      </nav>
      <main className="flex-1 flex flex-col items-center justify-center p-6 text-center space-y-12">
        <h1 className="text-6xl font-black uppercase italic tracking-tighter">Principal <span className="text-yellow-500">Dashboard</span></h1>
        <div className="w-full max-w-xl bg-white/5 p-12 rounded-[50px] border border-white/10 shadow-2xl space-y-6">
          <input value={val} onChange={(e) => setVal(e.target.value)} className="w-full bg-black/40 p-6 rounded-2xl text-center text-xl outline-none border border-white/10 focus:border-yellow-500" placeholder="Goal: e.g. Library Utilization" />
          <button onClick={async () => { const res = await callAI(`Analyze: ${val}`); setResult(res); setShowModal(true); }} className="w-full bg-yellow-500 py-6 rounded-2xl font-black text-xl uppercase text-slate-900 tracking-widest shadow-xl">Optimize Institution</button>
        </div>
      </main>
      <footer className="bg-[#002147] h-24 border-t-8 border-yellow-500 flex items-center justify-between px-10">
        <div className="flex flex-col items-start font-black uppercase"><p className="text-xs text-white">Strategic Intelligence Unit</p><p className="text-[10px] text-yellow-500">Rtn. Babatunde Adesina — The Orchestrator</p></div>
        <LayoutDashboard className="text-white/20" />
      </footer>
      {showModal && (
        <div className="fixed inset-0 bg-black/98 z-[100] flex items-center justify-center p-6">
          <div className="bg-slate-800 border border-yellow-500/20 rounded-[40px] w-full max-w-5xl max-h-[85vh] flex flex-col shadow-2xl">
            <div className="p-8 border-b border-white/10 flex justify-between items-center">
              <h2 className="text-2xl font-black uppercase text-yellow-500">Institutional Strategy</h2>
              <button onClick={() => setShowModal(false)} className="bg-white/5 p-3 rounded-xl hover:bg-red-500 transition-colors"><X/></button>
            </div>
            <div className="flex-1 overflow-y-auto p-12 text-xl text-slate-200 leading-relaxed whitespace-pre-wrap">{result}</div>
          </div>
        </div>
      )}
    </div>
  );
};
export default App;
