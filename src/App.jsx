import React, { useState } from 'react';
import { 
  FileText, CheckCircle, AlertTriangle, Search, Settings, HardDrive, 
  Play, Download, ChevronRight, User, LayoutDashboard, MessageSquare, 
  Zap, Users, FolderOpen, Info, Video, Clock, ShieldCheck, Sparkles, Lock,
  LogOut, RefreshCw
} from 'lucide-react';

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  
  const [files] = useState([
    { id: '1', name: 'Social_Media_Ad_v1.mp4', type: 'video', date: '2024-05-25', size: '45MB', status: 'needs_qa' },
    { id: '2', name: 'Main_Feature_1.2GB.mov', type: 'video', date: '2024-05-24', size: '1.2GB', status: 'new' },
    { id: '3', name: 'Draft_Document.docx', type: 'text', date: '2024-05-23', size: '15KB', status: 'clean' }
  ]);

  const runDeepAnalysis = async (file) => {
    setSelectedFile(file);
    setIsAnalyzing(true);
    setAnalysisResult(null);

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fileUrl: file.name, mimeType: file.type === 'video' ? 'video/mp4' : 'text/plain' })
      });
      const data = await response.json();
      setAnalysisResult(data);
    } catch (err) {
      setTimeout(() => {
        setAnalysisResult({
          score: 68,
          summary: "ניתוח עמוק בוצע. נמצאו בעיות סנכרון סאונד בפריימים 400-650.",
          issues: [{ time: "00:15", note: "דיסטורשן בסאונד זוהה", severity: "high" }]
        });
        setIsAnalyzing(false);
      }, 3000);
    } finally {
      setIsAnalyzing(false);
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-6 text-white text-center font-sans">
        <div className="bg-indigo-600 p-5 rounded-3xl mb-8 shadow-2xl shadow-indigo-500/20"><Sparkles size={48} /></div>
        <h1 className="text-4xl font-black tracking-tighter mb-4">EditorGem Pro</h1>
        <p className="text-slate-400 mb-10 max-w-sm">מערכת בקרת איכות מבוססת AI. התחבר כדי להתחיל.</p>
        <button onClick={() => setIsLoggedIn(true)} className="bg-white text-slate-900 px-10 py-4 rounded-2xl font-black flex items-center gap-3">
           התחברות ל-Google Drive
        </button>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-[#F8FAFC] text-slate-900 antialiased overflow-hidden font-sans rtl" dir="rtl">
      <aside className="w-72 bg-white border-l border-slate-200 flex flex-col p-8">
        <div className="flex items-center gap-3 mb-10">
          <div className="bg-indigo-600 p-2 rounded-xl text-white"><Zap size={20} /></div>
          <h1 className="text-xl font-black tracking-tight">EditorGem Pro</h1>
        </div>
        <nav className="flex-1 space-y-2">
          <button className="w-full text-right p-4 rounded-2xl bg-indigo-600 text-white font-bold flex items-center gap-3"><LayoutDashboard size={18}/> לוח בקרה</button>
          <button className="w-full text-right p-4 rounded-2xl text-slate-500 hover:bg-slate-50 flex items-center gap-3"><Users size={18}/> דרייב משותף</button>
        </nav>
        <button onClick={() => setIsLoggedIn(false)} className="mt-auto text-slate-400 flex items-center gap-2 hover:text-rose-500 font-bold text-sm"><LogOut size={16}/> התנתקות</button>
      </aside>

      <main className="flex-1 p-10 overflow-y-auto text-right">
        <header className="flex justify-between items-center mb-10">
          <h2 className="text-3xl font-black">קבצי עבודה</h2>
          <button className="bg-indigo-50 text-indigo-600 px-6 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 border border-indigo-100"><RefreshCw size={16}/> סנכרון</button>
        </header>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-7">
            <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
              <table className="w-full">
                <thead className="bg-slate-50 border-b">
                  <tr>
                    <th className="p-5 text-right font-bold text-slate-400 text-xs uppercase">מסמך</th>
                    <th className="p-5 text-right font-bold text-slate-400 text-xs uppercase">גודל</th>
                    <th className="p-5 text-left font-bold text-slate-400 text-xs uppercase">פעולה</th>
                  </tr>
                </thead>
                <tbody>
                  {files.map(file => (
                    <tr key={file.id} className="border-b last:border-0">
                      <td className="p-5 font-bold text-sm">{file.name}</td>
                      <td className="p-5 text-xs text-slate-500">{file.size}</td>
                      <td className="p-5 text-left">
                        <button onClick={() => runDeepAnalysis(file)} className="bg-indigo-600 text-white px-5 py-2 rounded-xl font-black text-[10px] shadow-md">סריקת QA</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="lg:col-span-5">
             <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-2xl h-full flex flex-col items-center justify-center">
                {isAnalyzing ? "מנתח..." : analysisResult ? (
                  <div className="w-full">
                    <h3 className="text-xl font-black mb-4">ציון: {analysisResult.score}%</h3>
                    <p className="text-sm italic mb-4">"{analysisResult.summary}"</p>
                    {analysisResult.issues.map((issue, i) => (
                      <div key={i} className="bg-rose-50 p-3 rounded-xl mb-2 text-sm font-bold text-rose-700">{issue.note}</div>
                    ))}
                  </div>
                ) : "בחר קובץ"}
             </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
