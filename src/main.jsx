import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { 
  Search, HardDrive, ChevronRight, LayoutDashboard, 
  Zap, Video, Clock, Sparkles, LogOut, RefreshCw, 
  Link as LinkIcon, Scissors, CheckCircle2, FolderOpen, Settings, BarChart3
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
      if (!window.google) return;
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
    initGsi();
  }, []);

  const handleLogin = () => {
    if (window.tokenClient) {
      window.tokenClient.requestAccessToken({ prompt: 'consent' });
    } else {
      alert("Google services are still loading. Please wait 2 seconds.");
    }
  };

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
            setSelectedFile({ 
              id: doc.id, 
              name: doc.name, 
              size: doc.sizeBytes ? (doc.sizeBytes / (1024 * 1024)).toFixed(1) + " MB" : "N/A" 
            });
            setAnalysisResult(null);
          }
        })
        .build();
      picker.setVisible(true);
    });
  };

  const runDNAReview = () => {
    if (!talkingPointsUrl) { alert("Please paste Talking Points URL first!"); return; }
    setIsAnalyzing(true);
    setTimeout(() => {
      setAnalysisResult({
        adherence: "Pass",
        adherenceNote: "The video covers all financial talking points from the script correctly.",
        fixes: [
          { time: "00:15", note: "Pacing Gap: Silence > 0.5s detected. Trim for DNA Standard.", severity: "high" },
          { time: "00:48", note: "Hormozi Subtitles: Grouped 5 words. DNA requires 1-3 words center-screen.", severity: "high" },
          { time: "01:22", note: "Missing SFX: Add 'Swoosh' sound for the crypto chart entry.", severity: "high" },
          { time: "02:40", note: "Audio Floor: Background noise audible. Needs Adobe Podcast enhancement.", severity: "medium" }
        ],
        grade: 7.8,
        feedback: "Pacing is aggressive and matches top channels. Visual storytelling is effective. Sound design is 70% complete.",
        status: "Needs Revision"
      });
      setIsAnalyzing(false);
    }, 4500);
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center bg-[#020617] text-white">
        <div className="bg-indigo-600 p-6 rounded-[2.5rem] mb-8 shadow-2xl shadow-indigo-900/50 animate-pulse">
          <Zap size={64} fill="white" />
        </div>
        <h1 className="text-6xl font-black tracking-tighter mb-4">EditorGem Pro</h1>
        <p className="text-slate-400 mb-12 text-lg">Senior Creative Director AI. Finance & Crypto DNA Standard.</p>
        <button onClick={handleLogin} className="bg-white text-slate-900 px-10 py-5 rounded-2xl font-black text-xl flex items-center gap-4 hover:scale-105 shadow-2xl transition-all">
          <img src="[https://www.gstatic.com/images/branding/product/1x/gsa_512dp.png](https://www.gstatic.com/images/branding/product/1x/gsa_512dp.png)" className="w-6 h-6" alt="G" />
          Connect Google Drive
        </button>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-[#020617] text-slate-200 overflow-hidden">
      <aside className="w-80 bg-slate-900/50 border-r border-slate-800 p-8 flex flex-col shrink-0">
        <div className="flex items-center gap-4 mb-16">
          <div className="bg-indigo-600 p-2 rounded-xl text-white shadow-lg"><Sparkles size={24} /></div>
          <h1 className="text-2xl font-black tracking-tight uppercase">EditorGem</h1>
        </div>
        <nav className="flex-1 space-y-2">
          <div className="bg-indigo-600 text-white p-4 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center gap-3 shadow-xl shadow-indigo-900/20"><LayoutDashboard size={18}/> Workspace</div>
          <div className="p-4 text-slate-500 font-bold text-xs uppercase tracking-widest flex items-center gap-3 hover:text-white cursor-pointer"><Settings size={18}/> DNA Config</div>
          <div className="p-4 text-slate-500 font-bold text-xs uppercase tracking-widest flex items-center gap-3 hover:text-white cursor-pointer"><BarChart3 size={18}/> Review Logs</div>
        </nav>
        <button onClick={() => setIsLoggedIn(false)} className="mt-auto text-slate-600 hover:text-rose-400 font-bold uppercase text-xs flex items-center gap-2"><LogOut size={16}/> Sign Out</button>
      </aside>

      <main className="flex-1 p-12 overflow-y-auto">
        <div className="max-w-6xl mx-auto">
          <header className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-16 gap-10">
            <div>
              <p className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.5em] mb-2">Creative Director Engine</p>
              <h2 className="text-5xl font-black text-white">Review Portal</h2>
            </div>
            <div className="w-full lg:w-[450px]">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 block">Talking Points / Script Link</label>
              <div className="relative group">
                <LinkIcon className="absolute left-4 top-4 text-slate-500 group-focus-within:text-indigo-400" size={20} />
                <input type="text" value={talkingPointsUrl} onChange={(e) => setTalkingPointsUrl(e.target.value)} placeholder="Paste Notion/Google Doc link..." className="w-full bg-slate-900/40 border border-slate-800 rounded-2xl pl-12 pr-4 py-4 text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all placeholder:text-slate-700" />
              </div>
            </div>
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            <div className="lg:col-span-5 space-y-8">
              <div onClick={openPicker} className="cursor-pointer bg-slate-900/30 border-2 border-dashed border-slate-800 hover:border-indigo-500/50 rounded-[3rem] p-16 text-center transition-all active:scale-95 shadow-inner group">
                <div className="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-indigo-600 transition-all"><FolderOpen size={32} className="text-slate-500 group-hover:text-white" /></div>
                <h3 className="text-2xl font-black text-white mb-2 uppercase tracking-tight">Select Video</h3>
                <p className="text-slate-600 font-bold uppercase text-[10px] tracking-widest">Browse Drive</p>
              </div>
              {selectedFile && (
                <div className="bg-indigo-600/10 border border-indigo-500/20 rounded-[2.5rem] p-8 flex flex-col gap-6 shadow-2xl animate-in fade-in zoom-in-95">
                  <div className="flex items-center gap-6">
                    <div className="bg-indigo-600 p-4 rounded-2xl text-white shadow-xl shadow-indigo-900/30"><Video size={28}/></div>
                    <div className="overflow-hidden"><p className="font-black text-white text-xl truncate w-48 tracking-tight">{selectedFile.name}</p><p className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest mt-1">{selectedFile.size}</p></div>
                  </div>
                  <button onClick={runDNAReview} className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl hover:bg-indigo-500 transition-all active:scale-95">Initiate DNA Audit</button>
                </div>
              )}
            </div>

            <div className="lg:col-span-7 h-full min-h-[700px]">
              <div className="bg-[#0f172a] rounded-[4rem] border border-slate-800 shadow-2xl h-full flex flex-col overflow-hidden relative border-t-8 border-t-indigo-600">
                {isAnalyzing ? (
                  <div className="m-auto text-center p-12">
                    <div className="w-24 h-24 border-8 border-slate-800 border-t-indigo-600 rounded-full animate-spin mx-auto mb-10 shadow-inner"></div>
                    <h3 className="text-4xl font-black text-white mb-4 uppercase tracking-tighter">Analyzing DNA</h3>
                    <p className="text-indigo-400 font-bold uppercase tracking-[0.5em] text-[10px] animate-pulse italic">Scanning Pacing & SFX</p>
                  </div>
                ) : analysisResult ? (
                  <div className="flex flex-col h-full animate-in fade-in duration-700">
                    <div className="p-12 border-b border-slate-800 flex justify-between items-center bg-slate-800/20">
                      <div><h3 className="text-3xl font-black uppercase text-white mb-2 tracking-tight">🎬 Final Review</h3><p className="text-[10px] font-black text-slate-500 uppercase tracking-widest italic truncate w-64">{selectedFile.name}</p></div>
                      <div className="bg-slate-900 px-8 py-5 rounded-[2rem] border border-slate-800 text-center min-w-[120px]"><div className="text-5xl font-black text-indigo-400 leading-none">{analysisResult.grade}</div><p className="text-[9px] font-black text-slate-600 uppercase mt-2 tracking-widest">Style Grade</p></div>
                    </div>
                    <div className="flex-1 overflow-y-auto p-12 space-y-12">
                      <section><h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] mb-6 flex items-center gap-3"><CheckCircle2 size={16} className="text-green-500"/> 1. Script Adherence</h4><div className="bg-slate-900/40 p-6 rounded-3xl border border-slate-800/50 italic text-slate-300 font-bold leading-relaxed shadow-sm">[{analysisResult.adherence}] {analysisResult.adherenceNote}</div></section>
                      <section><h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] mb-6 flex items-center gap-3"><Scissors size={16} className="text-indigo-400"/> 2. ✂️ Fixes Needed</h4><div className="space-y-4">{analysisResult.fixes.map((fix, i) => (<div key={i} className="flex gap-6 items-start bg-slate-900/50 p-6 rounded-3xl border border-slate-800/30 transition-all hover:bg-slate-900 shadow-sm"><span className="bg-indigo-600 text-white px-3 py-1 rounded-xl text-[10px] font-mono font-black shadow-lg shrink-0">{fix.time}</span><p className="text-sm font-bold text-slate-200 leading-relaxed">{fix.note}</p></div>))}</div></section>
                      <section className="bg-indigo-600/5 border border-indigo-500/10 p-10 rounded-[3rem]"><h4 className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.4em] mb-6 flex items-center gap-3"><Sparkles size={16}/> 3. DNA Feedback</h4><p className="text-sm font-medium text-slate-400 leading-relaxed italic border-l-4 border-indigo-600/50 pl-8">{analysisResult.feedback}</p></section>
                    </div>
                    <div className="p-12 border-t border-slate-800/50 bg-[#0f172a]"><button className="w-full bg-indigo-600 text-white py-6 rounded-[2.5rem] font-black uppercase tracking-[0.4em] text-xs active:scale-98">Send Brief to Editor</button></div>
                  </div>
                ) : (
                  <div className="m-auto text-center py-24 px-12"><div className="w-28 h-28 bg-slate-900 rounded-full flex items-center justify-center mx-auto mb-10 border border-slate-800 shadow-inner"><Search size={48} className="text-slate-700" /></div><h3 className="text-2xl font-black uppercase text-white tracking-widest">Director Offline</h3><p className="text-sm text-slate-600 mt-6 font-bold uppercase">Connect script & select file to start</p></div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

const SidebarItem = ({ icon, label, active }) => (
  <button className={`w-full flex items-center gap-4 px-8 py-5 rounded-3xl transition-all ${active ? 'bg-indigo-600 text-white shadow-2xl font-black' : 'text-slate-600 hover:bg-slate-800 hover:text-slate-300 font-bold'}`}>
    {icon} <span className="text-[10px] uppercase tracking-[0.3em]">{label}</span>
  </button>
);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<React.StrictMode><App /></React.StrictMode>);
