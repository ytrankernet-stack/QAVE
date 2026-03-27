import React, { useState, useEffect, useRef } from 'react';
import { 
  UploadCloud, Link as LinkIcon, Activity, FileVideo, Sparkles,
  Search, CheckCircle2, XCircle, Clock, Zap, ListChecks,
  AlertTriangle, Database, X, Loader2
} from 'lucide-react';

/**
 * EditorGem Pro V2.7 - Hybrid Upload Support
 * תמיכה גם בהעלאה מקומית וגם מגוגל דרייב עבור קבצי ענק (1GB+)
 */

const GEMINI_API_KEY = "AIzaSyCbEQsj8SHe-X2Y_akj9ZoBEzBIb96TQiE";
const GOOGLE_API_KEY = "AIzaSyDjFy0HBho-S5pYIHJN7dl2cVd0W_TawTA"; 
const GOOGLE_CLIENT_ID = "680437008053-voar1tv77bl98l3r1en64keamosjm0ml.apps.googleusercontent.com";

export default function App() {
  const [status, setStatus] = useState('idle'); 
  const [progress, setProgress] = useState(0);
  const [scanText, setScanText] = useState('Waiting for selection...');
  const [scriptUrl, setScriptUrl] = useState('');
  const [videoFile, setVideoFile] = useState(null); // יכול להיות File מהמחשב או מטא-דאטה מהדרייב
  const [aiReport, setAiReport] = useState(null);
  const [error, setError] = useState(null);
  const [uploadSource, setUploadSource] = useState('local'); // 'local' or 'drive'
  
  const tokenClientRef = useRef(null);
  const fileInputRef = useRef(null);
  const [accessToken, setAccessToken] = useState(null);

  // אתחול סקריפטים של גוגל
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
        if (window.google) {
          tokenClientRef.current = window.google.accounts.oauth2.initTokenClient({
            client_id: GOOGLE_CLIENT_ID,
            scope: 'https://www.googleapis.com/auth/drive.readonly',
            callback: (response) => {
              if (response.access_token) {
                setAccessToken(response.access_token);
                openPicker(response.access_token);
              }
            },
          });
        }
      };
      document.body.appendChild(gsiScript);
    };
    loadScripts();
  }, []);

  const openPicker = (token) => {
    if (!window.gapi) return;
    const view = new window.google.picker.View(window.google.picker.ViewId.DOCS);
    view.setMimeTypes("video/mp4,video/quicktime,video/x-matroska");
    const picker = new window.google.picker.PickerBuilder()
      .enableFeature(window.google.picker.Feature.NAV_HIDDEN)
      .setDeveloperKey(GOOGLE_API_KEY)
      .setAppId(GOOGLE_CLIENT_ID)
      .setOAuthToken(token)
      .addView(view)
      .setCallback((data) => {
        if (data.action === window.google.picker.Action.PICKED) {
          const doc = data.docs[0];
          setVideoFile({ 
            name: doc.name, 
            id: doc.id,
            mimeType: doc.mimeType || 'video/mp4',
            size: doc.sizeBytes,
            source: 'drive'
          });
        }
      })
      .build();
    picker.setVisible(true);
  };

  const handleLocalFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setVideoFile({
        file: file,
        name: file.name,
        size: file.size,
        mimeType: file.type,
        source: 'local'
      });
    }
  };

  /**
   * Gemini File API - העלאת הקובץ (מכל מקור) לשרת ה-AI
   */
  const uploadToGeminiFiles = async (blob, mimeType, displayName) => {
    const url = `https://generativelanguage.googleapis.com/upload/v1beta/files?key=${GEMINI_API_KEY}`;
    const metadata = JSON.stringify({ file: { display_name: displayName } });
    const formData = new FormData();
    formData.append("metadata", new Blob([metadata], { type: "application/json" }));
    formData.append("file", blob);

    const response = await fetch(url, { method: "POST", body: formData });
    if (!response.ok) throw new Error("Failed to upload file to Gemini AI servers.");
    const result = await response.json();
    return result.file;
  };

  const waitForFileActive = async (fileUri) => {
    const url = `${fileUri}?key=${GEMINI_API_KEY}`;
    let attempts = 0;
    while (attempts < 60) {
      const response = await fetch(url);
      const fileStatus = await response.json();
      if (fileStatus.state === 'ACTIVE') return fileStatus;
      if (fileStatus.state === 'FAILED') throw new Error("Video processing failed on AI side.");
      await new Promise(r => setTimeout(r, 5000));
      attempts++;
    }
    throw new Error("Processing timeout.");
  };

  const generateFinalAudit = async (prompt, fileUri) => {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key=${GEMINI_API_KEY}`;
    const payload = {
      contents: [{
        parts: [{ text: prompt }, { file_data: { mime_type: "video/mp4", file_uri: fileUri } }]
      }],
      systemInstruction: {
        parts: [{ text: "Senior Creative Director Mode. Audit the video based on the script. Pacing: 3-5s rule. Subtitles: Hormozi style. SFX: Swoosh/Pop on transitions. Return JSON only." }]
      },
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: {
          type: "OBJECT",
          properties: {
            verdict: { type: "STRING" }, grade: { type: "NUMBER" },
            scriptAdherence: { type: "STRING" }, pacingFeedback: { type: "STRING" },
            subtitleFeedback: { type: "STRING" }, audioFeedback: { type: "STRING" },
            fixes: { type: "ARRAY", items: { type: "OBJECT", properties: { time: { type: "STRING" }, type: { type: "STRING" }, desc: { type: "STRING" } } } }
          }
        }
      }
    };
    const response = await fetch(url, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
    const result = await response.json();
    return JSON.parse(result.candidates[0].content.parts[0].text);
  };

  const initiateAudit = async () => {
    if (!scriptUrl || !videoFile) return alert("Missing script or video file.");
    setError(null);
    setStatus('analyzing');
    setProgress(5);
    
    try {
      let blob;
      if (videoFile.source === 'drive') {
        setScanText("Downloading master from Google Drive...");
        const response = await fetch(`https://www.googleapis.com/drive/v3/files/${videoFile.id}?alt=media`, {
          headers: { Authorization: `Bearer ${accessToken}` }
        });
        blob = await response.blob();
      } else {
        setScanText("Reading local file from disk...");
        blob = videoFile.file;
      }

      setProgress(30);
      setScanText("Transferring file to Gemini AI Engine...");
      const geminiFile = await uploadToGeminiFiles(blob, videoFile.mimeType, videoFile.name);
      
      setProgress(60);
      setScanText("AI is watching and analyzing (this takes 1-2 mins for large edits)...");
      await waitForFileActive(geminiFile.uri);

      setProgress(90);
      const report = await generateFinalAudit(`Audit: ${scriptUrl}`, geminiFile.uri);
      setAiReport(report);
      setProgress(100);
      setTimeout(() => setStatus('complete'), 500);
    } catch (err) {
      setError(`Audit Error: ${err.message}`);
      setStatus('idle');
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 font-sans p-4 md:p-8" dir="ltr">
      <header className="max-w-5xl mx-auto flex items-center justify-between mb-12 border-b border-white/5 pb-6">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">EditorGem Pro</h1>
            <p className="text-[10px] text-indigo-400 font-bold uppercase tracking-widest mt-1">Hybrid Upload Engine • V2.7</p>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto">
        {status === 'idle' && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="text-center space-y-4 mb-12">
              <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight">DNA Style Audit</h2>
              <p className="text-slate-400 text-lg max-w-xl mx-auto">Choose your preferred upload method for large 1.5GB+ project files.</p>
            </div>

            <div className="bg-[#0f172a] border border-slate-800 rounded-[2.5rem] p-8 md:p-12 space-y-10 shadow-2xl relative overflow-hidden">
              <div className="space-y-4 relative z-10">
                <label className="text-xs font-black text-indigo-400 uppercase tracking-widest ml-1">1. Script Reference</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-slate-500"><LinkIcon className="h-5 w-5" /></div>
                  <input type="url" value={scriptUrl} onChange={(e) => setScriptUrl(e.target.value)} placeholder="https://notion.so/..." className="w-full pl-14 pr-6 py-5 bg-[#020617] border border-slate-700 rounded-2xl text-white outline-none focus:ring-2 focus:ring-indigo-500/50" />
                </div>
              </div>

              <div className="space-y-4 relative z-10">
                <div className="flex items-center justify-between ml-1">
                  <label className="text-xs font-black text-indigo-400 uppercase tracking-widest">2. Select Video Master</label>
                  <div className="flex bg-[#020617] p-1.5 rounded-xl border border-slate-800">
                    <button onClick={() => setUploadSource('local')} className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all ${uploadSource === 'local' ? 'bg-indigo-600 text-white' : 'text-slate-500'}`}>LOCAL</button>
                    <button onClick={() => setUploadSource('drive')} className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all ${uploadSource === 'drive' ? 'bg-indigo-600 text-white' : 'text-slate-500'}`}>DRIVE</button>
                  </div>
                </div>

                {uploadSource === 'local' ? (
                  <div onClick={() => fileInputRef.current.click()} className={`bg-[#020617] border-2 border-dashed rounded-[2rem] p-16 text-center cursor-pointer hover:border-indigo-500/50 transition-all ${videoFile?.source === 'local' ? 'border-indigo-500 bg-indigo-500/5' : 'border-slate-800'}`}>
                    <input type="file" ref={fileInputRef} onChange={handleLocalFileSelect} className="hidden" accept="video/*" />
                    <UploadCloud className="w-12 h-12 mx-auto mb-4 text-slate-500" />
                    <p className="text-xl font-bold text-white">{videoFile?.source === 'local' ? videoFile.name : "Drop 1.5GB Master Here"}</p>
                  </div>
                ) : (
                  <div onClick={() => tokenClientRef.current.requestAccessToken()} className={`bg-[#020617] border-2 border-dashed rounded-[2rem] p-16 text-center cursor-pointer hover:border-indigo-500/50 transition-all ${videoFile?.source === 'drive' ? 'border-indigo-500 bg-indigo-500/5' : 'border-slate-800'}`}>
                    <Database className="w-12 h-12 mx-auto mb-4 text-slate-500" />
                    <p className="text-xl font-bold text-white">{videoFile?.source === 'drive' ? videoFile.name : "Select From Google Drive"}</p>
                  </div>
                )}
              </div>

              {error && <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-2xl text-red-400 text-sm font-bold text-center">{error}</div>}

              <button onClick={initiateAudit} disabled={!videoFile || !scriptUrl} className="w-full py-6 bg-gradient-to-r from-indigo-600 to-violet-600 rounded-[1.5rem] font-black text-xl hover:shadow-[0_0_30px_rgba(79,70,229,0.3)] transition-all flex items-center justify-center space-x-3 group disabled:opacity-50">
                <Search className="w-6 h-6" /><span className="tracking-tight uppercase">Analyze Master Edit</span>
              </button>
            </div>
          </div>
        )}

        {status === 'analyzing' && (
          <div className="flex flex-col items-center justify-center py-32 space-y-12">
            <Loader2 className="w-16 h-16 text-indigo-400 animate-spin" />
            <div className="w-full max-w-md space-y-6 text-center">
              <p className="text-indigo-400 font-mono text-sm uppercase font-bold animate-pulse">{scanText}</p>
              <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden shadow-inner"><div className="h-full bg-gradient-to-r from-indigo-500 to-violet-500 transition-all duration-300" style={{width: `${progress}%`}} /></div>
            </div>
          </div>
        )}

        {status === 'complete' && aiReport && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700 text-left">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
              <div className={`md:col-span-2 border rounded-[2.5rem] p-10 shadow-2xl ${aiReport.grade < 8 ? 'bg-[#1e1414] border-red-900/40' : 'bg-emerald-950/20 border-emerald-900/40'}`}>
                <h3 className="text-5xl font-black text-white flex items-center space-x-5 mb-6">
                  {aiReport.grade < 8 ? <XCircle className="w-12 h-12 text-red-500" /> : <CheckCircle2 className="w-12 h-12 text-emerald-500" />}
                  <span>{aiReport.verdict}</span>
                </h3>
                <p className="text-slate-300 text-lg leading-relaxed">{aiReport.scriptAdherence}</p>
              </div>
              <div className="bg-[#0f172a] border border-slate-800 rounded-[2.5rem] p-10 text-center flex flex-col justify-center">
                <p className="text-xs font-black text-slate-500 uppercase tracking-[0.3em] mb-4">Final Grade</p>
                <div className="text-8xl font-black text-white tracking-tighter">{aiReport.grade}</div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-[#0f172a] border border-slate-800 rounded-3xl p-8 shadow-md">
                <h3 className="text-lg font-black text-white flex items-center space-x-3 mb-6 uppercase tracking-wider"><Zap className="w-6 h-6 text-indigo-400" /><span>Detailed Feedback</span></h3>
                <div className="space-y-4 text-sm text-slate-400">
                  <p><strong className="text-white block mb-1">Pacing:</strong> {aiReport.pacingFeedback}</p>
                  <p><strong className="text-white block mb-1">Subtitles:</strong> {aiReport.subtitleFeedback}</p>
                  <p><strong className="text-white block mb-1">Audio:</strong> {aiReport.audioFeedback}</p>
                </div>
              </div>
              <div className="bg-[#0f172a] border border-slate-800 rounded-3xl p-8 shadow-md">
                <h3 className="text-lg font-black text-white flex items-center space-x-3 mb-6 uppercase tracking-wider"><Clock className="w-6 h-6 text-violet-400" /><span>Fix List</span></h3>
                <div className="space-y-3">
                  {aiReport.fixes.map((fix, idx) => (
                    <div key={idx} className="p-4 bg-slate-900/50 border border-slate-800 rounded-xl flex items-start space-x-4">
                      <span className="font-mono text-indigo-400 font-bold text-xs bg-indigo-500/10 px-2 py-1 rounded border border-indigo-500/20">[{fix.time}]</span>
                      <div><p className="text-xs font-black text-slate-500 uppercase">{fix.type}</p><p className="text-sm text-slate-300">{fix.desc}</p></div>
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
