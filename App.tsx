import React, { useState } from 'react';
import { PodcastEpisode, GenerationState } from './types';
import { generatePodcastScript, generatePodcastAudio } from './services/geminiService';
import Player from './components/Player';
import Transcript from './components/Transcript';
import TopicGenerator from './components/TopicGenerator';
import { Headphones } from 'lucide-react';

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
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans selection:bg-blue-100 selection:text-blue-900">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center text-white shadow-md">
              <Headphones className="w-6 h-6" />
            </div>
            <h1 className="text-xl font-bold tracking-tight text-gray-900">
              Deutsch<span className="text-blue-600">Pod</span> AI
            </h1>
          </div>
          <div className="text-sm text-gray-500 hidden sm:block">
            Unterstützt durch Gemini 2.5
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 py-8">
        
        {/* Error Notification */}
        {generationState.error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded-r">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{generationState.error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Generator (Always visible until an episode is created, then maybe collapsible or just top) */}
        {!currentEpisode ? (
           <div className="py-12">
             <TopicGenerator 
               onGenerate={handleGenerateScript} 
               isGenerating={generationState.isGeneratingScript} 
             />
             
             {/* Features / Onboarding */}
             <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center max-w-4xl mx-auto mt-12">
                <div className="p-6">
                   <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                     <span className="text-xl font-bold">1</span>
                   </div>
                   <h3 className="font-semibold text-gray-900 mb-2">Thema wählen</h3>
                   <p className="text-sm text-gray-500">Geben Sie ein beliebiges Thema ein, das Sie üben möchten. Von Alltagssituationen bis zu Fachgesprächen.</p>
                </div>
                <div className="p-6">
                   <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
                     <span className="text-xl font-bold">2</span>
                   </div>
                   <h3 className="font-semibold text-gray-900 mb-2">KI-Generierung</h3>
                   <p className="text-sm text-gray-500">Gemini erstellt einen realistischen deutschen Dialog, extrahiert Vokabeln und bereitet ein Skript vor.</p>
                </div>
                <div className="p-6">
                   <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                     <span className="text-xl font-bold">3</span>
                   </div>
                   <h3 className="font-semibold text-gray-900 mb-2">Hören & Lernen</h3>
                   <p className="text-sm text-gray-500">Hochwertige Sprecherstimmen erwecken das Gespräch zum Leben.</p>
                </div>
             </div>
           </div>
        ) : (
          <div className="animate-fade-in">
             <div className="flex justify-between items-center mb-6">
                <button 
                  onClick={() => setCurrentEpisode(null)}
                  className="text-sm font-medium text-gray-500 hover:text-gray-900 flex items-center"
                >
                  ← Neu erstellen
                </button>
                <div className="text-xs text-gray-400">
                  Generiert am {new Date(currentEpisode.createdAt).toLocaleTimeString()}
                </div>
             </div>

             <div className="mb-8 text-center">
                <h2 className="text-3xl font-extrabold text-gray-900 mb-2">{currentEpisode.title}</h2>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">{currentEpisode.summary}</p>
             </div>

             <Transcript episode={currentEpisode} />
          </div>
        )}
      </main>

      {/* Sticky Player */}
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