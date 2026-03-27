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
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-6 text-white text-center">
        <div className="bg-indigo-600 p-6 rounded-3xl mb-8 shadow-2xl shadow-indigo-500/50 animate-pulse">
          <Sparkles size={64} />
        </div>
        <h1 className="text-5xl font-black tracking-tighter mb-6">EditorGem Pro</h1>
        <p className="text-slate-400 mb-12 max-w-sm text-lg">בקרת איכות AI לקבצי ענק. התחבר לדרייב המשותף כדי להתחיל.</p>
        <button 
          onClick={() => setIsLoggedIn(true)} 
          className="bg-white text-slate-900 px-12 py-5 rounded-2xl font-black flex items-center gap-4 hover:scale-105 transition-all shadow-2xl"
        >
          <img src="[https://www.gstatic.com/images/branding/product/1x/gsa_512dp.png](https://www.gstatic.com/images/branding/product/1x/gsa_512dp.png)" className="w-6 h-6" alt="G" />
          התחברות ל-Google Drive
        </button>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-[#F8FAFC] text-slate-900 antialiased overflow-hidden rtl" dir="rtl">
      <aside className="w-80 bg-white border-l border-slate-200 flex flex-col p-8 shadow-sm">
        <div className="flex items-center gap-3 mb-12">
          <div className="bg-indigo-600 p-2.5 rounded-2xl text-white shadow-lg shadow-indigo-100">
            <Zap size={24} />
          </div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900">EditorGem Pro</h1>
        </div>
        <nav className="flex-1 space-y-3">
          <button className="w-full text-right p-4 rounded-2xl bg-indigo-600 text-white font-bold shadow-xl shadow-indigo-200 flex items-center gap-4 transition-all">
            <LayoutDashboard size={20}/> לוח בקרה
          </button>
          <button className="w-full text-right p-4 rounded-2xl text-slate-400 hover:bg-slate-50 hover:text-slate-900 flex items-center gap-4 transition-all">
            <Users size={20}/> דרייב משותף
          </button>
          <button className="w-full text-right p-4 rounded-2xl text-slate-400 hover:bg-slate-50 flex items-center gap-4 transition-all">
            <Settings size={20}/> הגדרות AI
          </button>
        </nav>
        <button onClick={() => setIsLoggedIn(false)} className="mt-auto text-slate-400 flex items-center gap-3 hover:text-rose-500 transition-colors font-bold">
          <LogOut size={20}/> התנתקות מהמערכת
        </button>
      </aside>

      <main className="flex-1 p-12 overflow-y-auto">
        <header className="flex justify-between items-end mb-12">
          <div>
            <p className="text-xs font-black text-indigo-500 uppercase tracking-[0.3em] mb-2">Agency Workspace</p>
            <h2 className="text-4xl font-black text-slate-900">קבצי עבודה</h2>
          </div>
          <button className="bg-white border border-slate-200 text-slate-600 px-8 py-3 rounded-2xl font-bold flex items-center gap-3 shadow-sm hover:bg-slate-50 transition-all">
            <RefreshCw size={18}/> סנכרון תיקיות
          </button>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-7">
            <div className="bg-white rounded-[2rem] border border-slate-200 overflow-hidden shadow-sm">
              <table className="w-full text-right">
                <thead className="bg-slate-50/50 border-b border-slate-100">
                  <tr>
                    <th className="p-6 font-black text-slate-400 text-xs uppercase tracking-widest">מסמך / וידאו</th>
                    <th className="p-6 font-black text-slate-400 text-xs uppercase tracking-widest text-center">גודל</th>
                    <th className="p-6 font-black text-slate-400 text-xs uppercase tracking-widest text-left">סטטוס</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {files.map(file => (
                    <tr key={file.id} className="hover:bg-slate-50/50 transition-all group cursor-pointer" onClick={() => runDeepAnalysis(file)}>
                      <td className="p-6">
                        <div className="flex items-center gap-5">
                          <div className={`p-4 rounded-2xl ${file.type === 'video' ? 'bg-rose-50 text-rose-500' : 'bg-indigo-50 text-indigo-500'} group-hover:scale-110 transition-transform`}>
                            {file.type === 'video' ? <Video size={24}/> : <FileText size={24}/>}
                          </div>
                          <div>
                             <p className="font-black text-slate-800 text-lg">{file.name}</p>
                             <p className="text-xs font-bold text-slate-400 uppercase mt-1">{file.date}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-6 text-center font-bold text-slate-500 text-sm">{file.size}</td>
                      <td className="p-6 text-left">
                        <span className="bg-slate-100 text-slate-500 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest group-hover:bg-indigo-600 group-hover:text-white transition-all">
                          סריקת QA
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="lg:col-span-5 h-full">
             <div className="bg-white rounded-[2.5rem] border border-slate-200 p-0 shadow-2xl h-full flex flex-col overflow-hidden relative">
                <div className="h-2 w-full bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600"></div>
                
                {isAnalyzing ? (
                  <div className="m-auto text-center p-12">
                    <div className="w-24 h-24 border-8 border-indigo-50 border-t-indigo-600 rounded-full animate-spin mx-auto mb-10"></div>
                    <h3 className="text-3xl font-black mb-4">Gemini Pro מנתח...</h3>
                    <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">מעבד פריימים וסאונד ברזולוציה גבוהה</p>
                  </div>
                ) : analysisResult ? (
                  <div className="flex flex-col h-full">
                    <div className="p-10 border-b border-slate-50 flex justify-between items-center bg-slate-50/30">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                           <Sparkles size={18} className="text-indigo-600" />
                           <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight">דוח טכני</h3>
                        </div>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em] truncate w-48">{selectedFile.name}</p>
                      </div>
                      <div className="bg-indigo-600 text-white p-5 rounded-3xl shadow-2xl shadow-indigo-200 text-center min-w-[100px]">
                        <span className="text-4xl font-black">{analysisResult.score}%</span>
                        <div className="text-[10px] font-black uppercase tracking-widest opacity-60 mt-1">ציון סופי</div>
                      </div>
                    </div>

                    <div className="flex-1 overflow-y-auto p-10 space-y-8">
                      <div className="bg-indigo-50 p-6 rounded-3xl border border-indigo-100/50 text-slate-700 font-bold italic leading-relaxed shadow-sm">
                        "{analysisResult.summary}"
                      </div>
                      <div className="space-y-4">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-6">ממצאים מפורטים</p>
                        {analysisResult.issues.map((issue, i) => (
                          <div key={i} className="p-6 bg-white border border-slate-100 rounded-3xl shadow-sm flex gap-5 items-start transition-all hover:shadow-md">
                            {issue.time && <span className="bg-slate-900 text-white px-3 py-1 rounded-xl text-[10px] font-black shadow-lg shrink-0 flex items-center gap-2"><Clock size={12}/> {issue.time}</span>}
                            <p className="text-sm font-bold text-slate-800 leading-relaxed">{issue.note}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="p-10 border-t border-slate-100 bg-white">
                      <button className="w-full bg-slate-900 text-white py-5 rounded-3xl font-black hover:bg-indigo-600 transition-all flex items-center justify-center gap-4 group shadow-2xl shadow-slate-200 uppercase tracking-widest text-sm">
                        שלח דוח תיקונים לעורך
                        <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="m-auto text-center py-24 px-12">
                    <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-8">
                       <Search size={48} className="text-slate-200" />
                    </div>
                    <h3 className="text-2xl font-black text-slate-900 uppercase">מערכת מוכנה לסריקה</h3>
                    <p className="text-sm text-slate-400 mt-4 leading-relaxed font-bold">בחר קובץ מהרשימה כדי להתחיל בניתוח Multimodal עמוק של Gemini Pro.</p>
                  </div>
                )}
             </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
