import React, { useState } from 'react';
import { Sparkles, ArrowRight } from 'lucide-react';

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
    <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-xl p-8 border border-gray-100 mb-10 transform transition-all hover:scale-[1.01]">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Erstellen Sie Ihren Podcast</h2>
        <p className="text-gray-500">Geben Sie ein Thema ein und die KI generiert einen Dialog, Audio und eine Vokabelliste auf Deutsch.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Worüber möchten Sie lernen?</label>
          <div className="relative">
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="z.B. Besuch in Berlin, Fußball-Vokabeln..."
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all pl-11"
              disabled={isGenerating}
            />
            <Sparkles className="absolute left-3 top-3.5 w-5 h-5 text-blue-400" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
           <div>
             <label className="block text-sm font-medium text-gray-700 mb-1">Schwierigkeitsgrad</label>
             <select 
               value={level}
               onChange={(e) => setLevel(e.target.value)}
               className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none bg-white"
               disabled={isGenerating}
             >
               <option value="Beginner">Anfänger (A1-A2)</option>
               <option value="Intermediate">Mittelstufe (B1-B2)</option>
               <option value="Advanced">Fortgeschritten (C1-C2)</option>
             </select>
           </div>
           
           <div className="flex items-end">
              <button
                type="submit"
                disabled={isGenerating || !topic.trim()}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-xl transition-all flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg active:scale-95"
              >
                {isGenerating ? 'Generiere...' : (
                  <>
                    Episode erstellen <ArrowRight className="w-5 h-5 ml-2" />
                  </>
                )}
              </button>
           </div>
        </div>
      </form>
      
      {!isGenerating && (
        <div className="mt-6 flex flex-wrap gap-2 justify-center">
          {suggestions.map((s) => (
            <button
              key={s}
              onClick={() => setTopic(s)}
              className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-600 py-1.5 px-3 rounded-full transition-colors"
            >
              {s}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default TopicGenerator;