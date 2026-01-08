
import React, { useState, useRef } from 'react';
import { STORY_DATA } from './constants';
import StoryCard from './components/StoryCard';
import { analyzeStory } from './services/geminiService';
import { AnalysisResponse } from './types';

const App: React.FC = () => {
  const [activeChapterIndex, setActiveChapterIndex] = useState(0);
  const [analysis, setAnalysis] = useState<AnalysisResponse | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showCopyAllSuccess, setShowCopyAllSuccess] = useState(false);

  const activeChapter = STORY_DATA[activeChapterIndex];

  const handleAnalysis = async () => {
    setIsAnalyzing(true);
    try {
      const fullText = STORY_DATA.map(ch => ch.content).join("\n");
      const result = await analyzeStory(fullText);
      setAnalysis(result);
    } catch (error) {
      console.error("Analysis failed", error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const copyFullStory = () => {
    const fullStory = STORY_DATA.map((ch, i) => 
      `ជំពូកទី ${i + 1}: ${ch.title}\n\n${ch.content}`
    ).join("\n\n---\n\n");
    
    const formatted = `🎬 【 រឿង៖ អន្ទាក់ស្នេហ៍ក្នុងក្រញាំច្បាប់ (រឿងពេញ) 】 🎬\n\n${fullStory}\n\n#អន្ទាក់ស្នេហ៍ក្នុងក្រញាំច្បាប់ #សីហា #កញ្ញា #រឿងនិទាន #ច្បាប់ #បច្ចេកវិទ្យា`;
    
    navigator.clipboard.writeText(formatted).then(() => {
      setShowCopyAllSuccess(true);
      setTimeout(() => setShowCopyAllSuccess(false), 3000);
    });
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-zinc-100 flex flex-col font-['Kantumruy_Pro']">
      {/* Success Notification */}
      {showCopyAllSuccess && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[60] bg-green-600 text-white px-6 py-3 rounded-full shadow-2xl animate-bounce border border-green-400">
          ✨ បានចម្លងសាច់រឿងទាំងមូលសម្រាប់ផុស!
        </div>
      )}

      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-black/80 backdrop-blur-xl border-b border-zinc-800 p-4">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-tr from-cyan-600 to-amber-600 rounded-lg flex items-center justify-center font-bold text-white">
              S|K
            </div>
            <h1 className="text-xl md:text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-zinc-100 to-zinc-400">
              អន្ទាក់ស្នេហ៍ក្នុងក្រញាំច្បាប់
            </h1>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={copyFullStory}
              className="hidden md:flex px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-full transition-all items-center gap-2 text-sm font-bold shadow-lg shadow-blue-900/20"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
              </svg>
              ផុសរឿងពេញ
            </button>
            <button 
              onClick={handleAnalysis}
              disabled={isAnalyzing}
              className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-100 rounded-full border border-zinc-700 transition-all flex items-center gap-2 text-sm"
            >
              {isAnalyzing ? "កំពុងវិភាគ..." : "វិភាគដោយ AI"}
            </button>
          </div>
        </div>
      </nav>

      <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-8 md:py-12 space-y-16">
        
        {/* Story Focus Section */}
        <section className="grid lg:grid-cols-2 gap-12 items-start">
          <div className="space-y-8 sticky top-24">
            <div className={`p-8 rounded-3xl border-2 transition-all duration-500 bg-zinc-900/40 backdrop-blur-md ${
              activeChapter.theme === 'it' ? 'border-cyan-500/50 shadow-2xl shadow-cyan-900/10' : 
              activeChapter.theme === 'law' ? 'border-amber-600/50 shadow-2xl shadow-amber-900/10' : 'border-zinc-800'
            }`}>
              <div className="flex items-center justify-between mb-6">
                <span className="px-3 py-1 rounded-full bg-zinc-800 text-zinc-400 text-xs font-mono tracking-widest uppercase">
                  Chapter {activeChapterIndex + 1}
                </span>
                <div className="flex gap-2">
                   <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${
                    activeChapter.theme === 'it' ? 'bg-cyan-500/20 text-cyan-400' : 
                    activeChapter.theme === 'law' ? 'bg-amber-600/20 text-amber-500' : 'bg-zinc-800 text-zinc-400'
                  }`}>
                    {activeChapter.theme} Focus
                  </span>
                </div>
              </div>
              <h2 className="text-3xl font-bold mb-6 text-white leading-tight">
                {activeChapter.title}
              </h2>
              <div className="prose prose-invert prose-lg max-w-none">
                <p className="text-zinc-200 leading-relaxed text-xl whitespace-pre-wrap">
                  {activeChapter.content}
                </p>
              </div>
              
              <div className="mt-12 flex items-center gap-4">
                <button 
                  onClick={() => setActiveChapterIndex(p => Math.max(0, p-1))}
                  disabled={activeChapterIndex === 0}
                  className="p-4 rounded-xl bg-zinc-800 hover:bg-zinc-700 disabled:opacity-20 transition-all border border-zinc-700"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <div className="flex-1 h-1 bg-zinc-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-blue-500 transition-all duration-500" 
                    style={{ width: `${((activeChapterIndex + 1) / STORY_DATA.length) * 100}%` }}
                  />
                </div>
                <button 
                  onClick={() => setActiveChapterIndex(p => Math.min(STORY_DATA.length - 1, p+1))}
                  disabled={activeChapterIndex === STORY_DATA.length - 1}
                  className="p-4 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-20 transition-all border border-blue-500 shadow-lg shadow-blue-500/20"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>

            {analysis && (
              <div className="bg-gradient-to-br from-indigo-900/20 to-purple-900/20 p-8 rounded-3xl border border-indigo-500/30 animate-in fade-in slide-in-from-bottom-4 duration-700">
                <h3 className="text-lg font-bold text-indigo-300 mb-6 flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  វិភាគដោយឆ្លាតវៃ (AI Insights)
                </h3>
                <div className="space-y-6">
                  <div>
                    <h4 className="text-zinc-500 text-[10px] uppercase font-bold tracking-[0.2em] mb-2">អត្ថន័យអប់រំ</h4>
                    <p className="text-zinc-100 text-lg">{analysis.moral}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-black/40 rounded-2xl border border-zinc-800/50">
                      <h4 className="text-zinc-500 text-[10px] uppercase font-bold mb-2">សីហា (Seha)</h4>
                      <p className="text-zinc-300 text-sm leading-relaxed">{analysis.characterAnalysis.seha}</p>
                    </div>
                    <div className="p-4 bg-black/40 rounded-2xl border border-zinc-800/50">
                      <h4 className="text-zinc-500 text-[10px] uppercase font-bold mb-2">កញ្ញា (Kanhchana)</h4>
                      <p className="text-zinc-300 text-sm leading-relaxed">{analysis.characterAnalysis.kanhchana}</p>
                    </div>
                  </div>
                  <div className="pt-4 border-t border-zinc-800/50">
                    <h4 className="text-zinc-500 text-[10px] uppercase font-bold tracking-[0.2em] mb-2">បច្ចេកវិទ្យា vs ច្បាប់</h4>
                    <p className="text-zinc-200 text-sm italic leading-relaxed">{analysis.itVsLaw}</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div className="flex items-center justify-between mb-4 px-2">
              <h3 className="text-sm font-bold text-zinc-500 uppercase tracking-widest">ជំពូកទាំងអស់</h3>
              <span className="text-xs text-zinc-600">{STORY_DATA.length} ជំពូក</span>
            </div>
            {STORY_DATA.map((chapter, idx) => (
              <StoryCard 
                key={chapter.id}
                chapter={chapter}
                isActive={activeChapterIndex === idx}
                onNavigate={() => setActiveChapterIndex(idx)}
              />
            ))}
          </div>
        </section>

        {/* Closing Quote */}
        <section className="py-20 text-center space-y-12 border-t border-zinc-900">
          <div className="inline-block p-[1px] rounded-full bg-gradient-to-r from-transparent via-zinc-700 to-transparent w-full max-w-xl"></div>
          <blockquote className="text-3xl md:text-5xl font-bold italic text-zinc-500 leading-tight max-w-4xl mx-auto px-4">
            "ភស្តុតាងសំខាន់ជាងពាក្យសន្យា"
          </blockquote>
          <div className="flex justify-center gap-8 text-zinc-600 text-[10px] font-bold tracking-[0.4em] uppercase">
            <span>Evidence Over Emotion</span>
            <span className="text-zinc-800">•</span>
            <span>Law Over Lies</span>
          </div>
        </section>
      </main>

      <footer className="bg-zinc-950 border-t border-zinc-900 p-12 text-center">
        <div className="max-w-xl mx-auto space-y-4">
          <p className="text-zinc-500 text-sm">© 2024 Love Trap Content Creator Toolkit.</p>
          <p className="text-zinc-700 text-xs">សាច់រឿងនេះត្រូវបានរៀបចំឡើងសម្រាប់ការចែករំលែកចំណេះដឹងផ្នែកច្បាប់ និងបច្ចេកវិទ្យា តាមរយៈសិល្បៈនៃការនិពន្ធ។</p>
        </div>
      </footer>
    </div>
  );
};

export default App;
