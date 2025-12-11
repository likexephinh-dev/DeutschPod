import React from 'react';
import { PodcastEpisode, Speaker } from '../types';
import { BookOpen, User, Mic } from 'lucide-react';

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
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-24">
      {/* Left Column: Script */}
      <div className="lg:col-span-2 space-y-6">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
            <Mic className="w-5 h-5 mr-2 text-blue-500" />
            Transkript
          </h2>
          <div className="space-y-6">
            {episode.dialogue.map((line, index) => (
              <div key={index} className={`flex gap-4 ${line.speaker === Speaker.Host ? 'flex-row' : 'flex-row-reverse'}`}>
                {/* Avatar / Icon */}
                <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                  line.speaker === Speaker.Host ? 'bg-pink-100 text-pink-600' : 'bg-blue-100 text-blue-600'
                }`}>
                  <User className="w-5 h-5" />
                </div>
                
                {/* Bubble */}
                <div className={`flex-1 p-4 rounded-2xl text-base leading-relaxed ${
                  line.speaker === Speaker.Host 
                    ? 'bg-gray-50 text-gray-800 rounded-tl-none' 
                    : 'bg-blue-50 text-blue-900 rounded-tr-none'
                }`}>
                  <div className="text-xs font-bold mb-1 opacity-50 uppercase tracking-wider">
                    {line.speaker}
                  </div>
                  {line.text}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Column: Vocabulary & Info */}
      <div className="lg:col-span-1 space-y-6">
        {/* Episode Info */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
           <h3 className="text-lg font-bold text-gray-800 mb-2">Details zur Episode</h3>
           <div className="space-y-3">
             <div>
               <span className="text-xs font-semibold text-gray-400 uppercase">Thema</span>
               <p className="text-gray-700 font-medium">{episode.topic}</p>
             </div>
             <div>
               <span className="text-xs font-semibold text-gray-400 uppercase">Niveau</span>
               <span className="inline-block px-2 py-1 mt-1 rounded text-xs font-bold bg-green-100 text-green-700">
                 {levelMap[episode.level] || episode.level}
               </span>
             </div>
             <div>
               <span className="text-xs font-semibold text-gray-400 uppercase">Zusammenfassung</span>
               <p className="text-sm text-gray-600 mt-1">{episode.summary}</p>
             </div>
           </div>
        </div>

        {/* Vocabulary List */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 sticky top-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
            <BookOpen className="w-5 h-5 mr-2 text-indigo-500" />
            Wichtige Vokabeln
          </h2>
          <div className="space-y-4">
            {episode.vocabulary.map((item, index) => (
              <div key={index} className="border-b border-gray-100 last:border-0 pb-4 last:pb-0">
                <div className="mb-2">
                   <h4 className="font-bold text-indigo-700 text-base">{item.word}</h4>
                   {item.vietnameseDefinition && (
                     <p className="text-sm font-semibold text-gray-800 mt-0.5">{item.vietnameseDefinition}</p>
                   )}
                </div>
                <p className="text-sm text-gray-600 mb-2 leading-relaxed">{item.definition}</p>
                <div className="bg-gray-50 p-2 rounded border-l-2 border-indigo-200">
                  <p className="text-xs text-gray-500 italic">"{item.example}"</p>
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