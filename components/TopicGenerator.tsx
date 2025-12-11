import React, { useState } from 'react';
import { Sparkles, ArrowRight, Book, Layers } from 'lucide-react';

interface TopicGeneratorProps {
  onGenerate: (topic: string, level: string) => void;
  isGenerating: boolean;
}

const TopicGenerator: React.FC<TopicGeneratorProps> = ({ onGenerate, isGenerating }) => {
  const [topic, setTopic] = useState('');
  const [level, setLevel] = useState('Intermediate');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (topic.trim()) {
      onGenerate(topic, level);
    }
  };

  const suggestions = [
    "Currywurst bestellen", 
    "Zugreisen in Deutschland", 
    "Oktoberfest Guide",
    "Wohnungssuche"
  ];

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-3xl shadow-xl shadow-indigo-100 border border-white overflow-hidden relative">
        
        {/* Decorative Top Gradient */}
        <div className="h-2 w-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500"></div>
        
        <div className="p-8 md:p-10">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-slate-900 mb-3">Lerne Deutsch mit KI</h2>
            <p className="text-slate-500 text-lg">Erstellen Sie Ihren persönlichen Podcast.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                <Book className="w-4 h-4 text-indigo-500" />
                Thema
              </label>
              <div className="relative group">
                <input
                  type="text"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="z.B. Ein Tag in Berlin..."
                  className="w-full px-5 py-4 rounded-xl border border-slate-200 bg-slate-50 text-lg focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all pl-12 shadow-sm group-hover:border-slate-300"
                  disabled={isGenerating}
                />
                <Sparkles className="absolute left-4 top-4.5 w-5 h-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
               <div className="space-y-2">
                 <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                   <Layers className="w-4 h-4 text-indigo-500" />
                   Niveau
                 </label>
                 <div className="relative">
                   <select 
                     value={level}
                     onChange={(e) => setLevel(e.target.value)}
                     className="w-full px-4 py-4 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none appearance-none transition-all font-medium text-slate-700 cursor-pointer shadow-sm"
                     disabled={isGenerating}
                   >
                     <option value="Beginner">Anfänger (A1-A2)</option>
                     <option value="Intermediate">Mittelstufe (B1-B2)</option>
                     <option value="Advanced">Fortgeschritten (C1-C2)</option>
                   </select>
                   <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                     <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                   </div>
                 </div>
               </div>
               
               <div className="flex items-end">
                  <button
                    type="submit"
                    disabled={isGenerating || !topic.trim()}
                    className="w-full h-[58px] bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold text-lg rounded-xl transition-all flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed shadow-lg shadow-indigo-500/30 transform active:scale-[0.98] hover:-translate-y-0.5"
                  >
                    {isGenerating ? (
                      <span className="flex items-center gap-2">
                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        KI denkt nach...
                      </span>
                    ) : (
                      <>
                        Generieren <ArrowRight className="w-5 h-5 ml-2" />
                      </>
                    )}
                  </button>
               </div>
            </div>
          </form>
          
          {!isGenerating && (
            <div className="mt-8 pt-6 border-t border-slate-100">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3 text-center">Beliebte Themen</p>
              <div className="flex flex-wrap gap-2 justify-center">
                {suggestions.map((s) => (
                  <button
                    key={s}
                    onClick={() => setTopic(s)}
                    className="text-sm bg-slate-50 hover:bg-white hover:border-indigo-200 border border-transparent text-slate-600 py-2 px-4 rounded-full transition-all shadow-sm hover:shadow hover:text-indigo-600"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TopicGenerator;