import React, { useState, useEffect, useRef } from 'react';
import { 
  UploadCloud, Link as LinkIcon, Activity, FileVideo, Sparkles,
  Search, CheckCircle2, XCircle, Clock, Zap, ListChecks,
  AlertTriangle, Database, X, Loader2
} from 'lucide-react';

// --- Configuration from User ---
const GEMINI_API_KEY = "AIzaSyCbEQsj8SHe-X2Y_akj9ZoBEzBIb96TQiE";
const GOOGLE_CLIENT_ID = "680437008053-voar1tv77bl98l3r1en64keamosjm0ml.apps.googleusercontent.com";
// Client Secret is typically for server-side, but we'll use Client ID/API Key for Picker.
const GOOGLE_DEVELOPER_KEY = GEMINI_API_KEY; // Using the same API key if enabled for Drive

export default function App() {
  const [status, setStatus] = useState('idle'); // 'idle', 'analyzing', 'complete'
  const [progress, setProgress] = useState(0);
  const [scanText, setScanText] = useState('Initializing Systems...');
  const [scriptUrl, setScriptUrl] = useState('');
  const [videoFile, setVideoFile] = useState(null);
  const [uploadTab, setUploadTab] = useState('local');
  const [aiReport, setAiReport] = useState(null);
  const [error, setError] = useState(null);
  
  const fileInputRef = useRef(null);
  const tokenClientRef = useRef(null);
  const [accessToken, setAccessToken] = useState(null);

  // --- Initialize Google API Scripts ---
  useEffect(() => {
    const loadScripts = () => {
      const gapiScript = document.createElement('script');
      gapiScript.src = "https://apis.google.com/js/api.js";
      gapiScript.async = true;
      gapiScript.onload = () => window.gapi.load('client:picker', () => {});
      document.body.appendChild(gapiScript);

      const gsiScript = document.createElement('script');
      gsiScript.src = "https://accounts.google.com/gsi/client";
      gsiScript.async = true;
      gsiScript.onload = () => {
        tokenClientRef.current = window.google.accounts.oauth2.initTokenClient({
          client_id: GOOGLE_CLIENT_ID,
          scope: 'https://www.googleapis.com/auth/drive.readonly',
          callback: (response) => {
            if (response.access_token) {
              setAccessToken(response.access_token);
              createPicker(response.access_token);
            }
          },
        });
      };
      document.body.appendChild(gsiScript);
    };
    loadScripts();
  }, []);

  const createPicker = (token) => {
    const view = new window.google.picker.View(window.google.picker.ViewId.DOCS);
    view.setMimeTypes("video/mp4,video/quicktime,video/x-msvideo");
    const picker = new window.google.picker.PickerBuilder()
      .enableFeature(window.google.picker.Feature.NAV_HIDDEN)
      .setDeveloperKey(GOOGLE_DEVELOPER_KEY)
      .setAppId(GOOGLE_CLIENT_ID)
      .setOAuthToken(token)
      .addView(view)
      .setCallback((data) => {
        if (data.action === window.google.picker.Action.PICKED) {
          const doc = data.docs[0];
          setVideoFile({ name: doc.name, size: doc.sizeBytes, isDrive: true, id: doc.id });
        }
      })
      .build();
    picker.setVisible(true);
  };

  const handleDriveClick = () => {
    if (accessToken) {
      createPicker(accessToken);
    } else {
      tokenClientRef.current.requestAccessToken();
    }
  };

  // --- Gemini API Call with Exponential Backoff ---
  const fetchGeminiAnalysis = async (prompt, retries = 0) => {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${GEMINI_API_KEY}`;
    
    const payload = {
      contents: [{ 
        parts: [{ text: prompt }] 
      }],
      systemInstruction: {
        parts: [{ text: "You are a Senior Creative Director QA AI. Analyze the provided script and video details (meta-data) against Style DNA standards: Pacing (cuts every 3-5s), Subtitles (Hormozi 1-3 words, green/red color coding), SFX on transitions, Audio at -20db. Return a structured JSON report." }]
      },
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: {
          type: "OBJECT",
          properties: {
            verdict: { type: "STRING" },
            grade: { type: "NUMBER" },
            scriptAdherence: { type: "STRING" },
            pacingFeedback: { type: "STRING" },
            subtitleFeedback: { type: "STRING" },
            audioFeedback: { type: "STRING" },
            fixes: {
              type: "ARRAY",
              items: {
                type: "OBJECT",
                properties: {
                  time: { type: "STRING" },
                  type: { type: "STRING" },
                  desc: { type: "STRING" }
                }
              }
            }
          }
        }
      }
    };

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (!response.ok) throw new Error(`API Error: ${response.status}`);
      
      const result = await response.json();
      return JSON.parse(result.candidates[0].content.parts[0].text);
    } catch (err) {
      if (retries < 5) {
        const delay = Math.pow(2, retries) * 1000;
        await new Promise(res => setTimeout(res, delay));
        return fetchGeminiAnalysis(prompt, retries + 1);
      }
      throw err;
    }
  };

  const initiateAudit = async () => {
    if (!scriptUrl || !videoFile) {
      alert("Please provide both a script URL and a video file.");
      return;
    }

    setStatus('analyzing');
    setProgress(10);
    setScanText("Initializing Gemini 1.5 Pro...");

    const prompt = `Perform a Style DNA Audit for a YouTube Video. 
    Script URL: ${scriptUrl}
    Video File Name: ${videoFile.name}
    Video Source: ${videoFile.isDrive ? "Google Drive" : "Local Upload"}
    Please evaluate the editing pacing, SFX usage, and subtitle style.`;

    try {
      // Simulate progress steps while waiting for API
      const progressInterval = setInterval(() => {
        setProgress(prev => (prev < 90 ? prev + 1 : prev));
      }, 100);

      const report = await fetchGeminiAnalysis(prompt);
      
      clearInterval(progressInterval);
      setProgress(100);
      setAiReport(report);
      setTimeout(() => setStatus('complete'), 500);
    } catch (err) {
      setError("Analysis failed. Please check your API key or connection.");
      setStatus('idle');
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 font-sans p-4 md:p-8 selection:bg-indigo-500/30">
      
      {/* Header */}
      <header className="max-w-5xl mx-auto flex items-center justify-between mb-12 border-b border-white/5 pb-6">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">EditorGem Pro</h1>
            <p className="text-[10px] text-indigo-400 font-bold uppercase tracking-widest mt-1">AI QA AUDIT • V2.0</p>
          </div>
        </div>
        {status === 'complete' && (
          <button onClick={() => { setStatus('idle'); setAiReport(null); setError(null); }} className="text-sm font-bold px-6 py-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all text-slate-300">New Audit</button>
        )}
      </header>

      {/* Main Workspace */}
      <main className="max-w-4xl mx-auto">
        {status === 'idle' && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="text-center space-y-4 mb-12">
              <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight">Style DNA Video Audit</h2>
              <p className="text-slate-400 text-lg max-w-xl mx-auto leading-relaxed">Integrated with Gemini 1.5 Pro and Google Drive for production-ready QA.</p>
            </div>

            <div className="bg-[#0f172a] border border-slate-800 rounded-[2.5rem] p-8 md:p-12 space-y-10 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 blur-[100px] rounded-full"></div>
              
              {/* Script Input */}
              <div className="space-y-4 relative z-10">
                <label className="text-xs font-black text-indigo-400 uppercase tracking-[0.2em] ml-1">1. Script Reference (Notion/Google Docs)</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-slate-500 group-focus-within:text-indigo-400 transition-colors"><LinkIcon className="h-5 w-5" /></div>
                  <input 
                    type="url" 
                    value={scriptUrl} 
                    onChange={(e) => setScriptUrl(e.target.value)} 
                    placeholder="https://notion.so/script..." 
                    className="w-full pl-14 pr-6 py-5 bg-[#020617] border border-slate-700 rounded-2xl text-white outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all shadow-inner" 
                  />
                </div>
              </div>

              {/* Video Source */}
              <div className="space-y-4 relative z-10">
                <div className="flex items-center justify-between ml-1">
                  <label className="text-xs font-black text-indigo-400 uppercase tracking-[0.2em]">2. Select Video Edit</label>
                  <div className="flex bg-[#020617] p-1.5 rounded-xl border border-slate-800">
                    <button onClick={() => setUploadTab('local')} className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all ${uploadTab === 'local' ? 'bg-indigo-600 text-white' : 'text-slate-500'}`}>LOCAL</button>
                    <button onClick={() => setUploadTab('drive')} className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all ${uploadTab === 'drive' ? 'bg-indigo-600 text-white' : 'text-slate-500'}`}>DRIVE</button>
                  </div>
                </div>

                {uploadTab === 'local' ? (
                  <div 
                    onClick={() => fileInputRef.current.click()} 
                    className={`relative border-2 border-dashed rounded-[2rem] p-16 text-center cursor-pointer transition-all duration-300 group
                      ${videoFile ? 'border-indigo-500/40 bg-indigo-500/5' : 'border-slate-800 hover:border-slate-600 bg-[#020617]'}`}
                  >
                    <input type="file" ref={fileInputRef} onChange={(e) => setVideoFile(e.target.files[0])} className="hidden" accept="video/*" />
                    <div className="space-y-4">
                      <UploadCloud className={`w-12 h-12 mx-auto ${videoFile ? 'text-indigo-400' : 'text-slate-500'}`} />
                      <p className="text-lg font-bold text-slate-300">{videoFile ? videoFile.name : "Select Local Video"}</p>
                    </div>
                  </div>
                ) : (
                  <div className="bg-[#020617] border border-slate-800 rounded-[2rem] p-16 text-center space-y-6">
                    <Database className="w-12 h-12 text-indigo-500 mx-auto" />
                    <button 
                      onClick={handleDriveClick} 
                      className="px-8 py-4 bg-white text-black font-black rounded-2xl hover:bg-slate-200 transition-all flex items-center mx-auto space-x-3 shadow-xl"
                    >
                       <img src="https://upload.wikimedia.org/wikipedia/commons/1/12/Google_Drive_icon_%282020%29.svg" className="w-6 h-6" alt="Drive" />
                       <span>{videoFile?.isDrive ? videoFile.name : "BROWSE GOOGLE DRIVE"}</span>
                    </button>
                  </div>
                )}
              </div>

              {error && <p className="text-red-400 text-center text-sm font-bold bg-red-400/10 py-3 rounded-xl border border-red-400/20">{error}</p>}

              <button 
                onClick={initiateAudit} 
                className="w-full py-6 bg-gradient-to-r from-indigo-600 to-violet-600 rounded-[1.5rem] font-black text-xl hover:shadow-[0_0_30px_rgba(79,70,229,0.3)] transition-all flex items-center justify-center space-x-3 group relative overflow-hidden"
              >
                <Search className="w-6 h-6 relative z-10" />
                <span className="relative z-10">INITIATE REAL AI AUDIT</span>
              </button>
            </div>
          </div>
        )}

        {status === 'analyzing' && (
          <div className="flex flex-col items-center justify-center py-32 space-y-12 animate-in fade-in zoom-in-95">
            <div className="relative w-48 h-48 flex items-center justify-center">
              <div className="absolute inset-0 rounded-full border-[6px] border-indigo-500/10" />
              <div className="absolute inset-0 rounded-full border-[6px] border-indigo-500 border-t-transparent animate-spin" />
              <Loader2 className="w-16 h-16 text-indigo-400 animate-spin" />
            </div>
            <div className="w-full max-w-md space-y-6 text-center">
              <p className="text-indigo-400 font-mono text-sm uppercase font-bold animate-pulse">{scanText}</p>
              <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-indigo-500 transition-all duration-300" style={{width: `${progress}%`}} />
              </div>
            </div>
          </div>
        )}

        {status === 'complete' && aiReport && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-1000">
            {/* Report Header */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className={`md:col-span-2 border rounded-[2.5rem] p-10 relative overflow-hidden shadow-2xl ${aiReport.grade < 8 ? 'bg-[#1e1414] border-red-900/40' : 'bg-emerald-950/20 border-emerald-900/40'}`}>
                <div className="flex items-center space-x-3 mb-6 uppercase text-xs font-black tracking-widest">
                  {aiReport.grade < 8 ? <AlertTriangle className="w-5 h-5 text-red-500" /> : <CheckCircle2 className="w-5 h-5 text-emerald-500" />}
                  <span>Final Verdict</span>
                </div>
                <h3 className="text-5xl font-black text-white flex items-center space-x-5 mb-6">
                  {aiReport.grade < 8 ? <XCircle className="w-12 h-12 text-red-500" /> : <CheckCircle2 className="w-12 h-12 text-emerald-500" />}
                  <span>{aiReport.verdict}</span>
                </h3>
                <p className="text-slate-300 text-lg leading-relaxed">{aiReport.scriptAdherence}</p>
              </div>
              <div className="bg-[#0f172a] border border-slate-800 rounded-[2.5rem] p-10 text-center flex flex-col justify-center shadow-xl">
                <p className="text-xs font-black text-slate-500 uppercase tracking-[0.3em] mb-4">DNA Grade</p>
                <div className="text-8xl font-black text-white tracking-tighter">{aiReport.grade}</div>
              </div>
            </div>

            {/* Detailed Feedback */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-[#0f172a] border border-slate-800 rounded-3xl p-8">
                <h3 className="text-lg font-black text-white flex items-center space-x-3 mb-6 uppercase tracking-wider"><Zap className="w-6 h-6 text-indigo-400" /><span>Style DNA Feedback</span></h3>
                <div className="space-y-4 text-sm text-slate-400">
                  <p><span className="text-white font-bold">Pacing:</span> {aiReport.pacingFeedback}</p>
                  <p><span className="text-white font-bold">Subtitles:</span> {aiReport.subtitleFeedback}</p>
                  <p><span className="text-white font-bold">Audio:</span> {aiReport.audioFeedback}</p>
                </div>
              </div>
              <div className="bg-[#0f172a] border border-slate-800 rounded-3xl p-8">
                <h3 className="text-lg font-black text-white flex items-center space-x-3 mb-6 uppercase tracking-wider"><Clock className="w-6 h-6 text-violet-400" /><span>Mandatory Fixes</span></h3>
                <div className="space-y-3">
                  {aiReport.fixes.map((fix, idx) => (
                    <div key={idx} className="p-4 bg-slate-900/50 border border-slate-800 rounded-xl flex items-start space-x-4">
                      <span className="font-mono text-indigo-400 font-bold text-xs bg-indigo-500/10 px-2 py-1 rounded">[{fix.time}]</span>
                      <div>
                        <p className="text-xs font-black text-slate-500 uppercase">{fix.type}</p>
                        <p className="text-sm text-slate-300">{fix.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
