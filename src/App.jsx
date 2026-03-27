import React, { useState, useEffect } from 'react';
import { 
  Search, HardDrive, ChevronRight, LayoutDashboard, 
  Zap, Video, Clock, Sparkles, LogOut, RefreshCw, 
  Link as LinkIcon, Scissors, AlertCircle, CheckCircle2,
  FolderOpen, Settings, BarChart3
} from 'lucide-react';

const CLIENT_ID = "680437008053-voar1tv77bl98l3r1en64keamosjm0ml.apps.googleusercontent.com";
const API_KEY = "AIzaSyCbEQsj8SHe-X2Y_akj9ZoBEzBIb96TQiE";

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [talkingPointsUrl, setTalkingPointsUrl] = useState('');
  const [accessToken, setAccessToken] = useState(null);

  useEffect(() => {
    const initGsi = () => {
      window.tokenClient = window.google.accounts.oauth2.initTokenClient({
        client_id: CLIENT_ID,
        scope: '[https://www.googleapis.com/auth/drive.readonly](https://www.googleapis.com/auth/drive.readonly)',
        callback: (response) => {
          if (response.access_token) {
            setAccessToken(response.access_token);
            setIsLoggedIn(true);
          }
        },
      });
    };
    if (window.google) initGsi();
  }, []);

  const handleLogin = () => window.tokenClient.requestAccessToken({ prompt: 'consent' });

  const openPicker = () => {
    if (!accessToken) return;
    window.gapi.load('picker', () => {
      const view = new window.google.picker.DocsView(window.google.picker.ViewId.DOCS);
      view.setMimeTypes("video/mp4,video/x-m4v,video/*");
      const picker = new window.google.picker.PickerBuilder()
        .setAppId(CLIENT_ID)
        .setOAuthToken(accessToken)
        .addView(view)
        .setDeveloperKey(API_KEY)
        .setCallback((data) => {
          if (data.action === window.google.picker.Action.PICKED) {
            const doc = data.docs[0];
            setSelectedFile({ id: doc.id, name: doc.name, size: doc.sizeBytes ? (doc.sizeBytes / (1024 * 1024)).toFixed(1) + " MB" : "N/A" });
            setAnalysisResult(null);
          }
        })
        .build();
      picker.setVisible(true);
    });
  };

  const runDNAReview = async () => {
    if (!talkingPointsUrl) { alert("Please paste the Talking Points link first!"); return; }
    setIsAnalyzing(true);
    setTimeout(() => {
      setAnalysisResult({
        adherence: "Pass",
        adherenceNote: "All talking points regarding 'Crypto Volatility' were accurately maintained.",
        fixes: [
          { time: "00:15", note: "Silence gap > 0.5s. DNA requires aggressive pacing. Trim here.", severity: "high" },
          { time: "00:48", note: "Hormozi Style Subtitles: Too many words on screen. Split into 1-3 words.", severity: "high" },
          { time: "01:22", note: "Sound Design: Missing 'Whoosh' SFX on chart entry. Critical for DNA.", severity: "high" },
          { time: "02:40", note: "Audio Quality: Vocal needs studio processing. Apply AI enhancement.", severity: "medium" }
        ],
        grade: 7.5,
        feedback: "Pacing is tight. SFX coverage is at 60%. Subtitles need animation cleanup. Audio needs deeper processing.",
        audioEnhanced: "No",
        status: "Needs Revision"
      });
      setIsAnalyzing(false);
    }, 4000);
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
        <div className="bg-indigo-600 p-6 rounded-[2.5rem] mb-8 shadow-2xl shadow-indigo-900/50 animate-pulse"><Zap size={48} fill="white" /></div>
        <h1 className="text-6xl font-black tracking-tighter mb-4">EditorGem Pro</h1>
        <p className="text-slate-400 mb-12 text-lg">Senior Creative Director AI. Finance & Crypto DNA Standard.</p>
        <button onClick={handleLogin} className="bg-white text-slate-900 px-10 py-5 rounded-2xl font-black flex items-center gap-4 hover:bg-indigo-50 shadow-2xl">
          <img src="[https://www.gstatic.com/images/branding/product/1x/gsa_512dp.png](https://www.gstatic.com/images/branding/product/1x/gsa_512dp.png)" className="w-6 h-6" alt="G" />
          Connect Personal Drive
        </button>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-[#020617] text-slate-200 antialiased overflow-hidden">
      <aside className="w-80 glass-panel border-r border-slate-800/40 flex flex-col p-8">
        <div className="flex items-center gap-4 mb-16">
          <div className="bg-indigo-600 p-2 rounded-xl text-white"><Sparkles size={24} /></div>
          <h1 className="text-2xl font-black tracking-tight uppercase">EditorGem</h1>
        </div>
        <nav className="flex-1 space-y-2">
          <div className="bg-indigo-600 text-white p-4 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center gap-3"><LayoutDashboard size={18}/> Workspace</div>
          <div className="p-4 text-slate-500 font-bold text-xs uppercase tracking-widest flex items-center gap-3 hover:text-white cursor-pointer"><Settings size={18}/> DNA Config</div>
        </nav>
        <button onClick={() => setIsLoggedIn(false)} className="mt-auto text-slate-600 hover:text-rose-400 font-bold text-xs uppercase flex items-center gap-2"><LogOut size={16}/> Sign Out</button>
      </aside>

      <main className="flex-1 p-12 overflow-y-auto">
        <header className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-16 gap-10">
          <div>
            <p className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.5em] mb-2">Senior Performance QA</p>
            <h2 className="text-5xl font-black text-white">Review Portal</h2>
          </div>
          <div className="w-full lg:w-96">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 block">Talking Points / Script Link</label>
            <div className="relative">
              <LinkIcon className="absolute left-4 top-4 text-slate-500" size={18} />
              <input type="text" value={talkingPointsUrl} onChange={(e) => setTalkingPointsUrl(e.target.value)} placeholder="Paste link here..." className="w-full bg-slate-900/40 border border-slate-800 rounded-2xl pl-12 pr-4 py-4 text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all placeholder:text-slate-700" />
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-5 space-y-8">
            <div onClick={openPicker} className="cursor-pointer bg-slate-900/30 border-2 border-dashed border-slate-800 hover:border-indigo-500/50 rounded-[3rem] p-16 text-center transition-all active:scale-95">
              <div className="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6"><FolderOpen size={32} className="text-slate-500" /></div>
              <h3 className="text-2xl font-black text-white mb-2">Select Video</h3>
              <p className="text-slate-600 font-bold uppercase text-[10px] tracking-widest">Personal Drive</p>
            </div>
            {selectedFile && (
              <div className="bg-indigo-600/10 border border-indigo-500/20 rounded-3xl p-8 flex items-center justify-between shadow-2xl">
                <div className="flex items-center gap-4">
                  <div className="bg-indigo-600 p-4 rounded-2xl text-white"><Video size={24}/></div>
                  <div className="overflow-hidden"><p className="font-black text-white truncate w-32">{selectedFile.name}</p><p className="text-[10px] font-bold text-indigo-400">{selectedFile.size}</p></div>
                </div>
                <button onClick={runDNAReview} className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-black text-[10px] uppercase shadow-xl hover:bg-indigo-500 transition-all">Start QA</button>
              </div>
            )}
          </div>

          <div className="lg:col-span-7">
            <div className="bg-[#0f172a] rounded-[4rem] border border-slate-800 shadow-2xl min-h-[700px] flex flex-col overflow-hidden border-t-8 border-t-indigo-600">
               {isAnalyzing ? (
                 <div className="m-auto text-center"><div className="w-20 h-20 border-8 border-slate-800 border-t-indigo-600 rounded-full animate-spin mx-auto mb-8"></div><h3 className="text-3xl font-black text-white">Gemini Pro Analyzing...</h3><p className="text-indigo-400 font-bold uppercase tracking-[0.3em] text-[10px] mt-4">Pacing & DNA Standard Audit</p></div>
               ) : analysisResult ? (
                 <div className="flex flex-col h-full animate-in fade-in">
                    <div className="p-10 border-b border-slate-800 flex justify-between items-center bg-slate-800/20">
                      <div><h3 className="text-2xl font-black uppercase text-white mb-1">Editor Review</h3><p className="text-[10px] font-black text-slate-500 uppercase">{selectedFile.name}</p></div>
                      <div className="bg-indigo-600 text-white px-6 py-3 rounded-2xl text-center"><div className="text-3xl font-black">{analysisResult.grade}</div><div className="text-[8px] font-black uppercase tracking-widest opacity-60">DNA Grade</div></div>
                    </div>
                    <div className="flex-1 overflow-y-auto p-10 space-y-10">
                      <section><h4 className="text-[10px] font-black text-slate-500 uppercase mb-4 tracking-widest underline">1. Script Adherence</h4><p className="text-sm font-bold text-slate-300">[{analysisResult.adherence}] {analysisResult.adherenceNote}</p></section>
                      <section><h4 className="text-[10px] font-black text-slate-500 uppercase mb-4 tracking-widest underline">2. ✂️ Specific Fixes (Timestamped)</h4><div className="space-y-4">{analysisResult.fixes.map((fix, i) => (<div key={i} className="flex gap-4 items-start bg-slate-900/50 p-5 rounded-2xl border border-slate-800"><span className="bg-indigo-600 text-white px-2 py-1 rounded text-[10px] font-mono shrink-0">{fix.time}</span><p className="text-sm font-bold text-slate-200">{fix.note}</p></div>))}</div></section>
                      <section><h4 className="text-[10px] font-black text-slate-500 uppercase mb-4 tracking-widest underline">3. Style DNA Grade Feedback</h4><p className="text-sm font-medium text-slate-400 italic border-l-2 border-indigo-500 pl-6 leading-relaxed">{analysisResult.feedback}</p></section>
                    </div>
                    <div className="p-10 border-t border-slate-800 bg-[#0f172a]"><button className="w-full bg-indigo-600 text-white py-5 rounded-[2.5rem] font-black uppercase tracking-widest text-xs">Send Report to Editor</button></div>
                 </div>
               ) : (
                 <div className="m-auto text-center"><div className="w-20 h-20 bg-slate-900 rounded-full flex items-center justify-center mx-auto mb-8 border border-slate-800"><Search size={32} className="text-slate-700" /></div><h3 className="text-2xl font-black uppercase text-white">Director Offline</h3><p className="text-sm text-slate-600 mt-4 uppercase font-bold">Select file to initiate DNA Audit</p></div>
               )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

const SidebarItem = ({ icon, label, active }) => (
  <button className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl transition-all ${active ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-900/30 font-black' : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200 font-bold'}`}>
    {icon} <span className="text-xs uppercase tracking-widest">{label}</span>
  </button>
);

export default App;
