import React, { useState, useEffect, useRef } from 'react';
import { 
  UploadCloud, 
  Link as LinkIcon, 
  Activity, 
  FileVideo, 
  Sparkles,
  Search,
  CheckCircle2,
  XCircle,
  Clock,
  Zap,
  Volume2,
  ListChecks,
  AlertTriangle,
  Database
} from 'lucide-react';

export default function App() {
  const [status, setStatus] = useState('idle'); // 'idle', 'analyzing', 'complete'
  const [progress, setProgress] = useState(0);
  const [scanText, setScanText] = useState('Initializing Gemini 1.5 Pro...');
  
  const [scriptUrl, setScriptUrl] = useState('');
  const [videoFile, setVideoFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadTab, setUploadTab] = useState('local'); 
  
  const fileInputRef = useRef(null);

  useEffect(() => {
    let timer;
    if (status === 'analyzing') {
      const scanMessages = [
        "Initializing Gemini 1.5 Pro Vision...",
        "Scanning frames for pacing and jump-cuts...",
        "Analyzing subtitle density and Hormozi-style styling...",
        "Cross-referencing B-Roll with script context...",
        "Auditing audio frequencies and SFX cues...",
        "Generating final Style DNA technical report..."
      ];

      timer = setInterval(() => {
        setProgress((prev) => {
          const newProgress = prev + 1;
          const messageIndex = Math.floor((newProgress / 100) * scanMessages.length);
          if (scanMessages[messageIndex]) {
            setScanText(scanMessages[messageIndex]);
          }
          if (newProgress >= 100) {
            clearInterval(timer);
            setStatus('complete');
            return 100;
          }
          return newProgress;
        });
      }, 50);
    }
    return () => clearInterval(timer);
  }, [status]);

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setVideoFile(e.dataTransfer.files[0]);
    }
  };

  const initiateAudit = () => {
    if (!scriptUrl || (!videoFile && uploadTab === 'local')) {
      alert("Please provide both a script URL and a video file.");
      return;
    }
    setStatus('analyzing');
    setProgress(0);
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 font-sans selection:bg-indigo-500/30 pb-20">
      <header className="border-b border-white/5 bg-[#020617]/80 backdrop-blur-md sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">EditorGem Pro</h1>
              <p className="text-[10px] text-indigo-400 font-bold tracking-widest uppercase">AI Quality Assurance</p>
            </div>
          </div>
          {status === 'complete' && (
            <button onClick={() => setStatus('idle')} className="text-sm font-medium px-4 py-2 rounded-lg border border-white/10 text-slate-300 hover:text-white hover:bg-white/5 transition-all">New Audit</button>
          )}
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-12">
        {status === 'idle' && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="text-center space-y-4 mb-12">
              <h2 className="text-4xl font-extrabold text-white tracking-tight">Style DNA Video Audit</h2>
              <p className="text-slate-400 max-w-2xl mx-auto text-lg">Upload your latest edit and link your script. Our AI engine will audit pacing, subtitles, and audio quality.</p>
            </div>

            <div className="bg-[#0f172a] border border-slate-800 rounded-3xl p-8 space-y-8 shadow-2xl relative overflow-hidden">
              <div className="space-y-3 relative z-10">
                <label className="text-sm font-semibold text-slate-300 ml-1 uppercase tracking-wider">1. Talking Points / Script URL</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500"><LinkIcon className="h-5 w-5" /></div>
                  <input type="url" value={scriptUrl} onChange={(e) => setScriptUrl(e.target.value)} placeholder="Paste Notion or Google Docs link..." className="block w-full pl-11 pr-4 py-4 bg-[#020617] border border-slate-700 rounded-2xl text-slate-200 placeholder-slate-500 focus:ring-2 focus:ring-indigo-500/50 outline-none transition-all" />
                </div>
              </div>

              <div className="space-y-3 relative z-10">
                <div className="flex items-center justify-between ml-1">
                  <label className="text-sm font-semibold text-slate-300 uppercase tracking-wider">2. Video File Source</label>
                  <div className="flex bg-[#020617] p-1 rounded-lg border border-slate-800">
                    <button onClick={() => setUploadTab('local')} className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${uploadTab === 'local' ? 'bg-indigo-600 text-white' : 'text-slate-500 hover:text-slate-300'}`}>Local File</button>
                    <button onClick={() => setUploadTab('drive')} className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${uploadTab === 'drive' ? 'bg-indigo-600 text-white' : 'text-slate-500 hover:text-slate-300'}`}>Google Drive</button>
                  </div>
                </div>

                {uploadTab === 'local' ? (
                  <div onDragOver={(e) => {e.preventDefault(); setIsDragging(true);}} onDragLeave={() => setIsDragging(false)} onDrop={handleDrop} onClick={() => fileInputRef.current?.click()} className={`relative border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all ${videoFile ? 'border-indigo-500/50 bg-indigo-500/5' : isDragging ? 'border-indigo-400 bg-indigo-400/10' : 'border-slate-700 hover:border-slate-500 bg-[#020617]'}`}>
                    <input type="file" ref={fileInputRef} onChange={(e) => e.target.files[0] && setVideoFile(e.target.files[0])} accept="video/mp4,video/quicktime" className="hidden" />
                    {videoFile ? (
                      <div className="flex flex-col items-center space-y-3"><FileVideo className="w-10 h-10 text-indigo-400" /><p className="font-semibold text-indigo-300 text-lg">{videoFile.name}</p></div>
                    ) : (
                      <div className="flex flex-col items-center space-y-4"><UploadCloud className="w-8 h-8 text-slate-400" /><p className="font-semibold text-slate-300 text-lg">Click to upload or drag and drop</p></div>
                    )}
                  </div>
                ) : (
                  <div className="border-2 border-slate-800 rounded-2xl p-12 text-center bg-[#020617] flex flex-col items-center space-y-6">
                    <Database className="w-8 h-8 text-indigo-400" />
                    <button onClick={() => alert("Google Drive selection is simulated. Use Local File for demo.")} className="px-6 py-3 bg-white text-slate-900 font-bold rounded-xl hover:bg-slate-200 transition-colors flex items-center space-x-2">
                      <img src="[https://upload.wikimedia.org/wikipedia/commons/1/12/Google_Drive_icon_%282020%29.svg](https://upload.wikimedia.org/wikipedia/commons/1/12/Google_Drive_icon_%282020%29.svg)" className="w-5 h-5" alt="Drive" />
                      <span>Select from Drive</span>
                    </button>
                  </div>
                )}
              </div>

              <button onClick={initiateAudit} disabled={!scriptUrl || (!videoFile && uploadTab === 'local')} className="w-full py-4 mt-4 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold rounded-2xl shadow-lg disabled:opacity-50 flex items-center justify-center space-x-2 transition-all">
                <Search className="w-5 h-5" /><span>Initiate DNA Audit</span>
              </button>
            </div>
          </div>
        )}

        {status === 'analyzing' && (
          <div className="flex flex-col items-center justify-center py-32 space-y-12 animate-in fade-in zoom-in-95 duration-500">
            <div className="relative w-40 h-40 flex items-center justify-center">
              <div className="absolute inset-0 rounded-full border border-indigo-500/30 animate-[spin_4s_linear_infinite]" />
              <div className="absolute inset-0 rounded-full border-t-2 border-indigo-400 animate-[spin_2s_ease-in-out_infinite]" />
              <Activity className="w-12 h-12 text-indigo-300 animate-pulse relative z-10" />
            </div>
            <div className="w-full max-w-md space-y-6 text-center">
              <p className="text-indigo-300 font-mono text-sm tracking-tight">{scanText}</p>
              <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden shadow-inner"><div className="h-full bg-gradient-to-r from-indigo-500 to-violet-500 transition-all duration-75" style={{ width: `${progress}%` }} /></div>
            </div>
          </div>
        )}

        {status === 'complete' && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2 bg-[#1e1414] border border-red-900/50 rounded-3xl p-8 flex flex-col justify-center relative overflow-hidden">
                <h2 className="text-xs font-bold text-red-400 uppercase tracking-widest mb-2 flex items-center gap-2"><AlertTriangle className="w-4 h-4" /> Final Verdict</h2>
                <div className="text-4xl font-black text-white flex items-center space-x-3 mb-3"><XCircle className="w-10 h-10 text-red-500" /><span>Needs Revision</span></div>
                <p className="text-slate-300 text-lg">Visuals align with the script, but pacing drops significantly in the middle segment and subtitle styling violates DNA standards.</p>
              </div>
              <div className="bg-[#0f172a] border border-slate-800 rounded-3xl p-8 flex flex-col items-center justify-center text-center">
                <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Style DNA Grade</h2>
                <div className="text-7xl font-black text-transparent bg-clip-text bg-gradient-to-br from-white to-slate-400 mb-2">7.2</div>
                <div className="text-sm font-semibold text-slate-500 uppercase tracking-widest">Out of 10</div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-[#0f172a] border border-slate-800 rounded-2xl p-6">
                <h3 className="text-lg font-bold text-white flex items-center space-x-2 mb-6"><ListChecks className="w-5 h-5 text-emerald-400" /><span>Script Adherence</span></h3>
                <p className="text-slate-300 leading-relaxed bg-slate-800/30 p-4 rounded-xl border border-slate-700/50">Note: All talking points covered. B-Roll of the Ethereum chart matches dialogue perfectly.</p>
              </div>
              <div className="bg-[#0f172a] border border-slate-800 rounded-2xl p-6">
                <h3 className="text-lg font-bold text-white flex items-center space-x-2 mb-6"><Activity className="w-5 h-5 text-indigo-400" /><span>DNA Detailed Feedback</span></h3>
                <ul className="space-y-4 text-sm">
                  <li className="flex items-start space-x-3"><Clock className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" /><div><strong className="text-white block mb-1">Pacing</strong><span>Average cut rate: 4.2s. 3 instances of dead air detected.</span></div></li>
                  <li className="flex items-start space-x-3"><Zap className="w-5 h-5 text-red-500 shrink-0 mt-0.5" /><div><strong className="text-white block mb-1">Subtitles</strong><span>Missing required green/red color-coding for financial terms.</span></div></li>
                </ul>
              </div>
            </div>

            <div className="bg-[#0f172a] border border-slate-800 rounded-2xl p-6">
              <h3 className="text-lg font-bold text-white flex items-center space-x-2 mb-6"><Clock className="w-5 h-5 text-violet-400" /><span>Specific Fixes Required</span></h3>
              <div className="space-y-3">
                {[
                  { time: "01:14", type: "Pacing", desc: "Long silence detected. Cut dead air before 'Bitcoin Halving'." },
                  { time: "02:30", type: "Subtitles", desc: "Change 'market might crash soon' to 'market [Red: crash]'." }
                ].map((fix, idx) => (
                  <div key={idx} className="flex flex-col sm:flex-row sm:items-center p-4 bg-slate-800/40 rounded-xl border border-slate-700/50">
                    <div className="flex items-center mb-2 sm:mb-0 sm:w-48 shrink-0"><span className="font-mono text-indigo-400 bg-indigo-500/10 px-2 py-1 rounded text-sm font-bold mr-3 border border-indigo-500/20">[{fix.time}]</span><span className="text-xs font-bold uppercase tracking-wider text-slate-500">{fix.type}</span></div>
                    <p className="text-sm text-slate-300">{fix.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
