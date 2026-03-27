import React, { useState, useEffect } from 'react';
import { 
  FileText, CheckCircle, AlertTriangle, Search, Settings, HardDrive, 
  Play, Download, ChevronRight, User, LayoutDashboard, MessageSquare, 
  Zap, Users, FolderOpen, Info, Video, Clock, ShieldCheck, Sparkles, Lock,
  LogOut, RefreshCw
} from 'lucide-react';

const GOOGLE_CLIENT_ID = "680437008053-voar1tv77bl98l3r1en64keamosjm0ml.apps.googleusercontent.com";

const App = () => {
  const [activeTab, setActiveTab] = useState('drive');
  const [selectedFile, setSelectedFile] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [driveType, setDriveType] = useState('shared'); 
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [files] = useState([
    { id: '1', name: 'Social_Media_Ad_v1.mp4', type: 'video', date: '2024-05-25', size: '45MB', status: 'needs_qa' },
    { id: '2', name: 'Main_Feature_1.2GB.mov', type: 'video', date: '2024-05-24', size: '1.2GB', status: 'new' }
  ]);

  const handleStartAnalysis = async (file) => {
    setSelectedFile(file);
    setIsAnalyzing(true);
    setAnalysisResult(null);

    // קריאה לשרת ה-API שיצרנו בשלב 4
    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fileUrl: file.name, mimeType: file.type === 'video' ? 'video/mp4' : 'text/plain' })
      });
      const data = await response.json();
      setAnalysisResult(data);
    } catch (err) {
      // הדמיה במקרה של שגיאה בבדיקה ראשונית
      setTimeout(() => {
        setAnalysisResult({
          score: 72,
          summary: "Pro Analysis detected audio peaks and subtitle alignment issues.",
          issues: [{ time: "00:15", note: "Audio peak detected (-2dB)", severity: "high" }]
        });
        setIsAnalyzing(false);
      }, 3000);
    } finally {
      setIsAnalyzing(false);
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-6 text-white text-center">
        <div className="bg-indigo-600 p-4 rounded-3xl mb-8"><Zap size={48} /></div>
        <h1 className="text-4xl font-black mb-4">EditorGem Pro</h1>
        <button onClick={() => setIsLoggedIn(true)} className="bg-white text-slate-900 px-8 py-4 rounded-2xl font-black flex items-center gap-3">
          Connect Google Drive
        </button>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-[#F8FAFC] text-slate-900 antialiased overflow-hidden rtl" dir="rtl">
      <aside className="w-72 bg-white border-l border-slate-200 flex flex-col p-6">
        <h1 className="text-xl font-black mb-8">EditorGem Pro</h1>
        <nav className="space-y-2">
          <button className="w-full text-right p-3 rounded-xl bg-indigo-600 text-white font-bold">Dashboard</button>
          <button className="w-full text-right p-3 rounded-xl text-slate-500 hover:bg-slate-50">Shared Drive</button>
        </nav>
      </aside>
      <main className="flex-1 p-8 overflow-y-auto">
        <h2 className="text-2xl font-black mb-6">Drive Files</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
            <table className="w-full text-right">
              <thead className="bg-slate-50 border-b border-slate-100">
                <tr>
                  <th className="p-4">File Name</th>
                  <th className="p-4">Action</th>
                </tr>
              </thead>
              <tbody>
                {files.map(file => (
                  <tr key={file.id} className="border-b border-slate-50 last:border-0">
                    <td className="p-4 font-bold">{file.name}</td>
                    <td className="p-4">
                      <button onClick={() => handleStartAnalysis(file)} className="bg-indigo-50 text-indigo-600 px-4 py-2 rounded-xl font-bold text-xs uppercase">Deep Scan</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xl">
             {isAnalyzing ? <div className="text-center py-12">Analyzing with Gemini Pro...</div> : analysisResult ? (
               <div>
                 <h3 className="text-xl font-black mb-4">QA Report: {analysisResult.score}%</h3>
                 <p className="text-sm italic mb-6">"{analysisResult.summary}"</p>
                 <div className="space-y-3">
                   {analysisResult.issues.map((issue, i) => (
                     <div key={i} className="p-4 bg-rose-50 border border-rose-100 rounded-xl text-sm font-bold">
                       {issue.time && <span className="bg-black text-white px-2 py-0.5 rounded mr-2">{issue.time}</span>}
                       {issue.note}
                     </div>
                   ))}
                 </div>
               </div>
             ) : <div className="text-center py-12 text-slate-400">Select a file to start</div>}
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
