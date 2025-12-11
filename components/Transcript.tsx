import React from 'react';
import { PodcastEpisode, Speaker } from '../types';
import { BookOpen, User, Mic, PlayCircle } from 'lucide-react';

interface TranscriptProps {
  episode: PodcastEpisode;
}

const Transcript: React.FC<TranscriptProps> = ({ episode }) => {
  const levelMap: Record<string, string> = {
    'Beginner': 'Anfänger',
    'Intermediate': 'Mittelstufe',
    'Advanced': 'Fortgeschritten'
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* Left Column: Script (Chat Style) */}
      <div className="lg:col-span-8 space-y-6">
        <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-100 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-slate-200 to-slate-100"></div>
          
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-bold text-slate-800 flex items-center">
              <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center mr-3">
                <Mic className="w-5 h-5" />
              </div>
              Transkript
            </h2>
            <div className="text-xs font-medium text-slate-400 bg-slate-50 px-3 py-1.5 rounded-full">
              {episode.dialogue.length} Zeilen
            </div>
          </div>

          <div className="space-y-8">
            {episode.dialogue.map((line, index) => {
              const isHost = line.speaker === Speaker.Host;
              return (
                <div key={index} className={`flex gap-4 md:gap-6 ${isHost ? 'flex-row' : 'flex-row-reverse'}`}>
                  {/* Avatar */}
                  <div className={`flex-shrink-0 w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm border-2 ${
                    isHost 
                      ? 'bg-amber-100 border-white text-amber-700' 
                      : 'bg-indigo-100 border-white text-indigo-700'
                  }`}>
                    <span className="font-bold text-lg">{isHost ? 'L' : 'S'}</span>
                  </div>
                  
                  {/* Bubble */}
                  <div className={`flex-1 max-w-[85%] group`}>
                    <div className={`flex items-baseline gap-2 mb-1 ${isHost ? 'flex-row' : 'flex-row-reverse'}`}>
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-wide">
                        {isHost ? 'Lehrerin' : 'Schüler'}
                      </span>
                    </div>
                    <div className={`p-5 rounded-3xl shadow-sm border ${
                      isHost 
                        ? 'bg-amber-50/50 border-amber-100 text-slate-800 rounded-tl-none' 
                        : 'bg-indigo-50/50 border-indigo-100 text-slate-800 rounded-tr-none'
                    }`}>
                      <p className="text-[17px] leading-relaxed font-medium">
                        {line.text}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Right Column: Vocabulary & Info */}
      <div className="lg:col-span-4 space-y-6">
        {/* Episode Info Card */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
           <h3 className="text-lg font-bold text-slate-800 mb-4 border-b border-slate-100 pb-2">Überblick</h3>
           <div className="space-y-4">
             <div className="flex justify-between items-center">
               <span className="text-sm font-medium text-slate-500">Kategorie</span>
               <span className="text-sm font-semibold text-slate-800 bg-slate-100 px-2 py-1 rounded">{episode.topic}</span>
             </div>
             <div className="flex justify-between items-center">
               <span className="text-sm font-medium text-slate-500">Schwierigkeit</span>
               <span className={`text-sm font-bold px-2 py-1 rounded ${
                 episode.level === 'Beginner' ? 'bg-green-100 text-green-700' :
                 episode.level === 'Intermediate' ? 'bg-yellow-100 text-yellow-700' :
                 'bg-red-100 text-red-700'
               }`}>
                 {levelMap[episode.level] || episode.level}
               </span>
             </div>
           </div>
        </div>

        {/* Vocabulary List */}
        <div className="bg-white rounded-3xl shadow-lg shadow-slate-200/50 border border-slate-100 sticky top-24 overflow-hidden">
          <div className="p-6 bg-slate-50 border-b border-slate-100">
            <h2 className="text-lg font-bold text-slate-800 flex items-center">
              <BookOpen className="w-5 h-5 mr-2 text-indigo-600" />
              Wortschatz
            </h2>
          </div>
          
          <div className="divide-y divide-slate-100 max-h-[calc(100vh-200px)] overflow-y-auto">
            {episode.vocabulary.map((item, index) => (
              <div key={index} className="p-5 hover:bg-slate-50 transition-colors group">
                <div className="mb-2 flex items-baseline justify-between">
                   <h4 className="font-bold text-indigo-700 text-lg">{item.word}</h4>
                </div>
                {item.vietnameseDefinition && (
                   <p className="text-sm font-semibold text-slate-800 mb-1">{item.vietnameseDefinition}</p>
                )}
                <p className="text-sm text-slate-500 mb-3 leading-relaxed">{item.definition}</p>
                <div className="relative pl-3 border-l-2 border-indigo-200">
                  <p className="text-xs text-slate-500 italic">"{item.example}"</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Transcript;