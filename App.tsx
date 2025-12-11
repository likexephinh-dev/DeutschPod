import React, { useState } from 'react';
import { PodcastEpisode, GenerationState } from './types';
import { generatePodcastScript, generatePodcastAudio } from './services/geminiService';
import Player from './components/Player';
import Transcript from './components/Transcript';
import TopicGenerator from './components/TopicGenerator';
import { Headphones, Sparkles, BookOpen, Volume2 } from 'lucide-react';

const App: React.FC = () => {
  const [currentEpisode, setCurrentEpisode] = useState<PodcastEpisode | null>(null);
  const [generationState, setGenerationState] = useState<GenerationState>({
    isGeneratingScript: false,
    isGeneratingAudio: false,
    error: null,
  });

  const handleGenerateScript = async (topic: string, level: string) => {
    setGenerationState(prev => ({ ...prev, isGeneratingScript: true, error: null }));
    try {
      const episodeData = await generatePodcastScript(topic, level);
      setCurrentEpisode({
        ...episodeData,
        audioBuffer: null // Reset audio
      });
    } catch (err: any) {
      setGenerationState(prev => ({ ...prev, error: err.message || "Fehler beim Generieren des Skripts" }));
    } finally {
      setGenerationState(prev => ({ ...prev, isGeneratingScript: false }));
    }
  };

  const handleGenerateAudio = async () => {
    if (!currentEpisode) return;

    setGenerationState(prev => ({ ...prev, isGeneratingAudio: true, error: null }));
    try {
      const audioBuffer = await generatePodcastAudio(currentEpisode.dialogue);
      setCurrentEpisode(prev => prev ? ({ ...prev, audioBuffer }) : null);
    } catch (err: any) {
      setGenerationState(prev => ({ ...prev, error: err.message || "Fehler beim Generieren des Audios" }));
    } finally {
      setGenerationState(prev => ({ ...prev, isGeneratingAudio: false }));
    }
  };

  return (
    <div className="min-h-screen font-sans selection:bg-indigo-100 selection:text-indigo-900 pb-32">
      {/* Header with Glassmorphism */}
      <header className="fixed top-0 left-0 right-0 z-40 bg-white/70 backdrop-blur-md border-b border-white/20 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-tr from-indigo-600 to-violet-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-500/30 transform transition-transform hover:scale-105">
              <Headphones className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-slate-900 leading-none">
                Deutsch<span className="text-indigo-600">Pod</span> AI
              </h1>
              <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">German Learning</span>
            </div>
          </div>
          <div className="hidden sm:flex items-center gap-2">
            <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2 py-1 rounded-full border border-slate-200">
              Gemini 2.5 Powered
            </span>
          </div>
        </div>
      </header>

      {/* Spacer for fixed header */}
      <div className="h-16"></div>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        
        {/* Error Notification */}
        {generationState.error && (
          <div className="bg-red-50 border border-red-100 p-4 mb-8 rounded-2xl shadow-sm animate-fade-in">
            <div className="flex">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center text-red-500">
                   <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                     <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                   </svg>
                </div>
              </div>
              <div className="ml-3 flex-1 md:flex md:justify-between items-center">
                <p className="text-sm font-medium text-red-800">{generationState.error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Generator (Always visible until an episode is created) */}
        {!currentEpisode ? (
           <div className="py-8 md:py-16 animate-fade-in">
             <TopicGenerator 
               onGenerate={handleGenerateScript} 
               isGenerating={generationState.isGeneratingScript} 
             />
             
             {/* Features / Onboarding */}
             <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mt-16">
                {[
                  {
                    icon: <Sparkles className="w-6 h-6" />,
                    color: "bg-blue-50 text-blue-600",
                    title: "Thema wählen",
                    desc: "Geben Sie ein beliebiges Thema ein. Die KI passt sich Ihrem Niveau an."
                  },
                  {
                    icon: <BookOpen className="w-6 h-6" />,
                    color: "bg-indigo-50 text-indigo-600",
                    title: "KI-Generierung",
                    desc: "Gemini erstellt Dialoge, Vokabellisten und Lernsituationen."
                  },
                  {
                    icon: <Volume2 className="w-6 h-6" />,
                    color: "bg-purple-50 text-purple-600",
                    title: "Hören & Lernen",
                    desc: "Realistische Stimmen helfen Ihnen, die Aussprache zu meistern."
                  }
                ].map((feature, i) => (
                  <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                     <div className={`w-12 h-12 ${feature.color} rounded-xl flex items-center justify-center mb-4`}>
                       {feature.icon}
                     </div>
                     <h3 className="font-bold text-slate-900 mb-2">{feature.title}</h3>
                     <p className="text-sm text-slate-500 leading-relaxed">{feature.desc}</p>
                  </div>
                ))}
             </div>
           </div>
        ) : (
          <div className="animate-fade-in space-y-8">
             {/* Navigation */}
             <div className="flex justify-between items-end border-b border-slate-200 pb-4">
                <button 
                  onClick={() => setCurrentEpisode(null)}
                  className="group flex items-center text-sm font-medium text-slate-500 hover:text-indigo-600 transition-colors"
                >
                  <span className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center mr-2 group-hover:border-indigo-200 shadow-sm">
                    ←
                  </span>
                  Neues Thema
                </button>
                <div className="text-xs font-medium text-slate-400 bg-slate-50 px-2 py-1 rounded">
                  {new Date(currentEpisode.createdAt).toLocaleDateString('de-DE')}
                </div>
             </div>

             {/* Header Section */}
             <div className="text-center space-y-4 max-w-3xl mx-auto">
                <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
                  {currentEpisode.title}
                </h2>
                <p className="text-lg text-slate-600 leading-relaxed">
                  {currentEpisode.summary}
                </p>
             </div>

             <Transcript episode={currentEpisode} />
          </div>
        )}
      </main>

      {/* Player */}
      <Player 
        audioBuffer={currentEpisode?.audioBuffer || null} 
        isLoading={generationState.isGeneratingAudio}
        onGenerateAudio={handleGenerateAudio}
        hasScript={!!currentEpisode}
      />
    </div>
  );
};

export default App;