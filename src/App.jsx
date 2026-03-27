import React, { useState } from 'react';
import { 
  Link as LinkIcon, Sparkles, CheckCircle2, 
  Scissors, ChevronRight, UploadCloud, FileVideo, BarChart3, AlertCircle
} from 'lucide-react';

const App = () => {
  const [scriptUrl, setScriptUrl] = useState('');
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [status, setStatus] = useState('idle'); // 'idle', 'analyzing', 'complete'
  const [result, setResult] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedVideo({
        name: file.name,
        size: (file.size / (1024 * 1024)).toFixed(1) + ' MB'
      });
      setErrorMsg('');
    }
  };

  const runAnalysis = () => {
    if (!scriptUrl) {
      setErrorMsg("Please paste the Script / Talking Points URL first.");
      return;
    }
    if (!selectedVideo) {
      setErrorMsg("Please upload a video file for analysis.");
      return;
    }

    setErrorMsg('');
    setStatus('analyzing');

    // Mocking the Senior Creative Director DNA Review Output
    setTimeout(() => {
      setResult({
        adherence: "Pass",
        adherenceNote: "Matches script hierarchy. All financial data points regarding CPI were accurately presented.",
        fixes: [
          { time: "00:12", note: "Pacing Error: Silence > 0.5s. DNA standard requires aggressive trim here.", severity: "high" },
          { time: "00:48", note: "Hormozi Captions: Line has 6 words. DNA limit is 1-3 words center-screen.", severity: "high" },
          { time: "01:22", note: "Missing SFX: Add a high-impact 'Swoosh' for the Bitcoin chart entry.", severity: "high" },
          { time: "02:40", note: "Audio Floor: Background hiss audible. Needs Adobe Podcast-style enhancement.", severity: "medium" },
          { time: "03:15", note: "Punch-in missing: The talking head shot is static for 6s. Add a digital zoom.", severity: "medium" }
        ],
        grade: 7.8,
        feedback: "Pacing matches top finance channels. Visual storytelling is effective. SFX coverage is at 60%. Vocal clarity needs studio-level processing.",
        audioEnhanced: "No",
        verdict: "Needs Revision"
      });
      setStatus('complete');
    }, 4000);
  };

  const reset = () => { 
    setStatus('idle'); 
    setSelectedVideo(null); 
    setResult(null); 
    setErrorMsg('');
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 p-6 md:p-12 overflow-y-auto" dir="ltr">
      <div className="max-w-4xl mx-auto">
        
        {/* Header */}
        <header className="mb-12 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-4">
            <div className="bg-indigo-600 p-3 rounded-2xl text-white shadow-[0_0_30px_-5px_rgba(79,70,229,0.5)]">
              <Sparkles size={32} />
            </div>
            <div>
              <h1 className="text-4xl font-black tracking-tight text-white uppercase italic">EditorGem Pro</h1>
              <p className="text-indigo-400 font-bold text-[10px] uppercase tracking-[0.3em] mt-1">Creative Director AI Engine</p>
            </div>
          </div>
          {status === 'complete' && (
            <button onClick={reset} className="text-xs font-black text-slate-500 hover:text-white uppercase tracking-widest bg-slate-900 px-6 py-3 rounded-xl border border-slate-800 transition-all">
              New Audit
            </button>
          )}
        </header>

        {/* Main Panel */}
        <div className="bg-[#0f172a] border border-slate-800/60 rounded-[3rem] shadow-2xl p-8 md:p-12 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500"></div>

          {errorMsg && (
            <div className="mb-8 bg-rose-500/10 border border-rose-500/20 p-4 rounded-2xl flex items-center gap-3 text-rose-400 animate-in fade-in">
              <AlertCircle size={20} />
              <p className="text-sm font-bold">{errorMsg}</p>
            </div>
          )}

          {status === 'idle' && (
            <div className="space-y-10 animate-in fade-in duration-500">
              <div className="text-center max-w-xl mx-auto">
                <h2 className="text-3xl font-black text-white mb-4 tracking-tight">Finance & Crypto DNA Audit</h2>
                <p className="text-slate-400 text-sm leading-relaxed uppercase tracking-widest font-bold">
                  Review production against the 5-pillar standard
                </p>
              </div>

              <div className="space-y-8 max-w-2xl mx-auto">
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-2 block">1. Script / Talking Points Link</label>
                  <div className="relative">
                    <LinkIcon className="absolute left-5 top-5 text-slate-500" size={20} />
                    <input 
                      type="text" 
                      value={scriptUrl} 
                      onChange={(e) => setScriptUrl(e.target.value)}
                      placeholder="Paste Notion or Google Doc link..." 
                      className="w-full bg-slate-900/60 border border-slate-700/60 rounded-2xl pl-14 pr-6 py-5 text-sm outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all text-white shadow-inner"
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-2 block">2. Upload Final Edit</label>
                  {!selectedVideo ? (
                    <label className="flex flex-col items-center justify-center w-full bg-slate-900/30 border-2 border-dashed border-slate-700/50 rounded-3xl p-12 cursor-pointer hover:border-indigo-500/50 transition-all group">
                      <UploadCloud size={40} className="text-slate-500 mb-4 group-hover:text-indigo-400 transition-colors" />
                      <p className="text-lg font-black text-white mb-1">Click to browse video file</p>
                      <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">Supports MP4, MOV</p>
                      <input type="file" className="hidden" accept="video/*" onChange={handleFileChange} />
                    </label>
                  ) : (
                    <div className="bg-indigo-900/20 border border-indigo-500/30 rounded-2xl p-6 flex items-center justify-between">
                      <div className="flex items-center gap-5">
                        <div className="bg-indigo-600 p-4 rounded-2xl text-white shadow-lg"><FileVideo size={24}/></div>
                        <div className="overflow-hidden">
                          <p className="font-black text-white text-lg truncate w-48">{selectedVideo.name}</p>
                          <p className="text-[10px] font-bold text-indigo-400 uppercase">{selectedVideo.size} • Ready</p>
                        </div>
                      </div>
                      <button onClick={() => setSelectedVideo(null)} className="text-xs font-black text-slate-500 hover:text-rose-400 uppercase tracking-widest px-4 py-2 transition-colors">Change</button>
                    </div>
                  )}
                </div>

                <button 
                  onClick={runAnalysis} 
                  className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-6 rounded-2xl font-black text-xs uppercase tracking-[0.3em] shadow-xl transition-all active:scale-95 flex items-center justify-center gap-3"
                >
                  <Sparkles size={18} /> Initiate DNA Audit
                </button>
              </div>
            </div>
          )}

          {status === 'analyzing' && (
            <div className="py-32 flex flex-col items-center text-center animate-in zoom-in-95 duration-500">
              <div className="w-24 h-24 border-8 border-slate-800 border-t-indigo-600 rounded-full animate-spin mb-10 shadow-inner"></div>
              <h3 className="text-4xl font-black text-white mb-4 uppercase italic">Scanning Assets</h3>
              <p className="text-indigo-400 font-bold uppercase tracking-[0.4em] text-[10px] animate-pulse">Gemini 1.5 Pro Analysis in Progress</p>
            </div>
          )}

          {status === 'complete' && result && (
            <div className="animate-in fade-in slide-in-from-bottom-8 duration-700">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12 pb-8 border-b border-slate-800">
                <div>
                  <h3 className="text-3xl font-black uppercase tracking-tight text-white mb-2 flex items-center gap-3">🎬 Performance Review</h3>
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">{selectedVideo?.name}</p>
                </div>
                <div className="bg-slate-900 px-10 py-5 rounded-[2rem] border border-slate-800 text-center shadow-inner">
                  <div className="text-5xl font-black text-indigo-400 leading-none">{result.grade}<span className="text-lg text-slate-700">/10</span></div>
                  <p className="text-[10px] font-black text-slate-500 uppercase mt-3 tracking-widest">DNA Grade</p>
                </div>
              </div>

              <div className="space-y-12">
                <section>
                  <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-4 flex items-center gap-3 underline decoration-indigo-500/30 decoration-2 underline-offset-4">
                    <CheckCircle2 size={16} className="text-green-500"/> 1. Script Adherence
                  </h4>
                  <div className="bg-slate-900/40 p-6 rounded-3xl border border-slate-800/50 italic text-slate-300 font-bold leading-relaxed shadow-sm">
                    [{result.adherence}] {result.adherenceNote}
                  </div>
                </section>

                <section>
                  <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-6 flex items-center gap-3 underline decoration-indigo-500/30 decoration-2 underline-offset-4">
                    <Scissors size={16} className="text-indigo-400"/> 2. ✂️ Specific Fixes Needed
                  </h4>
                  <div className="space-y-4">
                    {result.fixes.map((fix, i) => (
                      <div key={i} className="flex flex-col sm:flex-row gap-4 sm:gap-6 items-start bg-slate-900/50 p-6 rounded-3xl border border-slate-800/30 transition-all hover:bg-slate-900 shadow-sm">
                        <span className="bg-indigo-600 text-white px-3 py-1.5 rounded-xl text-[10px] font-mono font-black shadow-lg shrink-0">{fix.time}</span>
                        <p className="text-sm font-bold text-slate-200 leading-relaxed pt-1">{fix.note}</p>
                      </div>
                    ))}
                  </div>
                </section>

                <section className="bg-indigo-600/5 border border-indigo-500/10 p-10 rounded-[3rem]">
                  <h4 className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.3em] mb-6 flex items-center gap-3">
                    <BarChart3 size={16}/> 3. Style DNA Grade Feedback
                  </h4>
                  <p className="text-sm font-medium text-slate-400 leading-relaxed italic border-l-4 border-indigo-600/50 pl-8">{result.feedback}</p>
                </section>

                <div className="bg-slate-800/30 p-8 rounded-3xl border border-slate-800/50 flex flex-col md:flex-row justify-between items-center gap-6">
                  <div className="space-y-1">
                    <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em]">4. Final Verdict</h4>
                    <p className="text-xs font-bold text-slate-400 underline decoration-indigo-500/50">Adobe Podcast AI Enhanced: <span className="text-indigo-400">{result.audioEnhanced}</span></p>
                  </div>
                  <div className={`px-10 py-4 rounded-xl font-black text-xs uppercase tracking-[0.3em] border shadow-lg ${result.verdict === 'Approved' ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-amber-500/10 text-amber-400 border-amber-500/20'}`}>
                    {result.verdict}
                  </div>
                </div>

                <button className="w-full bg-white hover:bg-slate-200 text-slate-900 py-6 rounded-2xl font-black uppercase tracking-[0.3em] text-xs flex items-center justify-center gap-4 transition-all shadow-2xl active:scale-95">
                  Copy Brief to Clipboard <ChevronRight size={18} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default App;
