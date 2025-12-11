import React, { useEffect, useRef, useState } from 'react';
import { Play, Pause, RefreshCw, Loader2, Volume2, Download } from 'lucide-react';

interface PlayerProps {
  audioBuffer: AudioBuffer | null;
  isLoading: boolean;
  onGenerateAudio: () => void;
  hasScript: boolean;
}

const Player: React.FC<PlayerProps> = ({ audioBuffer, isLoading, onGenerateAudio, hasScript }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  
  const audioContextRef = useRef<AudioContext | null>(null);
  const sourceNodeRef = useRef<AudioBufferSourceNode | null>(null);
  const startTimeRef = useRef<number>(0);
  const pausedTimeRef = useRef<number>(0);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    if (audioBuffer) {
      setDuration(audioBuffer.duration);
      // Reset state when new buffer arrives
      stopAudio();
      pausedTimeRef.current = 0;
      setCurrentTime(0);
      setProgress(0);
    }
  }, [audioBuffer]);

  useEffect(() => {
    return () => stopAudio();
  }, []);

  const playAudio = () => {
    if (!audioBuffer) return;

    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
    }

    if (audioContextRef.current.state === 'suspended') {
      audioContextRef.current.resume();
    }

    const ctx = audioContextRef.current;
    const source = ctx.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(ctx.destination);
    
    const offset = pausedTimeRef.current;
    source.start(0, offset);
    
    startTimeRef.current = ctx.currentTime - offset;
    sourceNodeRef.current = source;
    setIsPlaying(true);

    source.onended = () => {
       if (ctx.currentTime - startTimeRef.current >= audioBuffer.duration - 0.1) {
         setIsPlaying(false);
         pausedTimeRef.current = 0;
         setCurrentTime(0);
         setProgress(0);
       }
    };

    const updateProgress = () => {
      if (ctx && isPlaying) {
        const now = ctx.currentTime;
        const current = now - startTimeRef.current;
        if (current <= audioBuffer.duration) {
          setCurrentTime(current);
          setProgress((current / audioBuffer.duration) * 100);
          rafRef.current = requestAnimationFrame(updateProgress);
        }
      }
    };
    rafRef.current = requestAnimationFrame(updateProgress);
  };

  const pauseAudio = () => {
    if (sourceNodeRef.current && audioContextRef.current) {
      sourceNodeRef.current.stop();
      sourceNodeRef.current = null;
      pausedTimeRef.current = audioContextRef.current.currentTime - startTimeRef.current;
      setIsPlaying(false);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    }
  };

  const stopAudio = () => {
    if (sourceNodeRef.current) {
      sourceNodeRef.current.stop();
      sourceNodeRef.current = null;
    }
    setIsPlaying(false);
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
  };

  const togglePlay = () => {
    if (isPlaying) {
      pauseAudio();
    } else {
      playAudio();
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!hasScript) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 p-4 z-50 pointer-events-none">
      <div className="max-w-4xl mx-auto pointer-events-auto">
        <div className="bg-slate-900/90 backdrop-blur-xl text-white rounded-3xl shadow-2xl shadow-indigo-500/20 border border-white/10 p-4 sm:p-5 flex items-center gap-5 md:gap-8 transform transition-transform animate-fade-in hover:scale-[1.01]">
          
          {/* Play/Pause Control */}
          <div className="flex-shrink-0">
            {!audioBuffer ? (
              <button
                onClick={onGenerateAudio}
                disabled={isLoading}
                className="w-16 h-16 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white flex items-center justify-center transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed group"
              >
                {isLoading ? <Loader2 className="w-8 h-8 animate-spin" /> : <Play className="w-8 h-8 ml-1 fill-current group-hover:scale-110 transition-transform" />}
              </button>
            ) : (
               <button
                onClick={togglePlay}
                className="w-16 h-16 rounded-2xl bg-white text-indigo-600 hover:bg-indigo-50 flex items-center justify-center transition-all shadow-lg group"
              >
                {isPlaying ? <Pause className="w-8 h-8 fill-current" /> : <Play className="w-8 h-8 ml-1 fill-current group-hover:scale-110 transition-transform" />}
              </button>
            )}
          </div>

          {/* Progress & Metadata */}
          <div className="flex-grow min-w-0">
             <div className="flex items-center justify-between mb-2">
               <h3 className="font-semibold truncate text-slate-200 text-sm md:text-base pr-4">
                 {!audioBuffer ? "Audio wird generiert..." : "Podcast Episode"}
               </h3>
               <div className="font-mono text-xs text-indigo-200">
                 {audioBuffer ? `${formatTime(currentTime)} / ${formatTime(duration)}` : '--:--'}
               </div>
             </div>
             
             {/* Progress Bar Container */}
             <div className="h-2 bg-slate-700/50 rounded-full overflow-hidden w-full relative cursor-pointer group">
               {/* Progress Fill */}
               <div 
                  className="absolute top-0 left-0 h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-100 ease-linear rounded-full"
                  style={{ width: `${progress}%` }}
               />
               {/* Loading Indeterminate Bar */}
               {!audioBuffer && isLoading && (
                 <div className="absolute top-0 left-0 h-full w-full bg-slate-700/50 overflow-hidden">
                    <div className="animate-shimmer absolute top-0 left-0 h-full w-1/2 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12" style={{animation: 'shimmer 2s infinite'}}></div>
                 </div>
               )}
             </div>
             
             <div className="mt-2 flex items-center justify-between">
                <span className="text-xs text-slate-400">
                  {isLoading ? 'Die KI spricht das Skript ein...' : (audioBuffer ? 'Bereit zum Abspielen' : 'Warte auf Generierung')}
                </span>
                {audioBuffer && (
                 <button onClick={onGenerateAudio} className="text-xs flex items-center text-slate-400 hover:text-white transition-colors">
                   <RefreshCw className="w-3 h-3 mr-1" /> Neu
                 </button>
               )}
             </div>
          </div>

          {/* Volume Icon Decoration */}
          <div className="hidden sm:flex items-center justify-center w-10 h-10 rounded-full bg-white/5 border border-white/5 text-indigo-300">
            <Volume2 className="w-5 h-5" />
          </div>

        </div>
      </div>
      <style>{`
        @keyframes shimmer {
          0% { transform: translateX(-150%) skewX(-12deg); }
          100% { transform: translateX(250%) skewX(-12deg); }
        }
        .animate-shimmer {
          animation: shimmer 1.5s infinite;
        }
      `}</style>
    </div>
  );
};

export default Player;