import React, { useEffect, useRef, useState } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, Loader2, RefreshCw } from 'lucide-react';

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

  // Clean up on unmount
  useEffect(() => {
    return () => stopAudio();
  }, []);

  const playAudio = () => {
    if (!audioBuffer) return;

    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
    }

    // Resume context if suspended (browser autoplay policy)
    if (audioContextRef.current.state === 'suspended') {
      audioContextRef.current.resume();
    }

    const ctx = audioContextRef.current;
    const source = ctx.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(ctx.destination);
    
    // Start from where we left off
    const offset = pausedTimeRef.current;
    source.start(0, offset);
    
    startTimeRef.current = ctx.currentTime - offset;
    sourceNodeRef.current = source;
    setIsPlaying(true);

    source.onended = () => {
       // Only handle natural end, not manual stop
       if (ctx.currentTime - startTimeRef.current >= audioBuffer.duration - 0.1) {
         setIsPlaying(false);
         pausedTimeRef.current = 0;
         setCurrentTime(0);
         setProgress(0);
       }
    };

    // Animation loop for progress
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
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-lg z-50">
      <div className="max-w-4xl mx-auto flex items-center gap-4">
        
        {/* Play/Pause Button Area */}
        <div className="flex-shrink-0">
          {!audioBuffer ? (
            <button
              onClick={onGenerateAudio}
              disabled={isLoading}
              className="w-14 h-14 rounded-full bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center transition-colors shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : <Play className="w-6 h-6 ml-1" />}
            </button>
          ) : (
             <button
              onClick={togglePlay}
              className="w-14 h-14 rounded-full bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center transition-colors shadow-md"
            >
              {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-1" />}
            </button>
          )}
        </div>

        {/* Progress Bar & Info */}
        <div className="flex-grow">
           <div className="flex justify-between text-xs text-gray-500 mb-1 font-medium">
             <span>{audioBuffer ? formatTime(currentTime) : '--:--'}</span>
             <span>{audioBuffer ? formatTime(duration) : '--:--'}</span>
           </div>
           <div className="h-2 bg-gray-200 rounded-full overflow-hidden w-full relative">
             <div 
                className="absolute top-0 left-0 h-full bg-blue-500 transition-all duration-100 ease-linear"
                style={{ width: `${progress}%` }}
             />
           </div>
           <div className="mt-2 text-sm text-gray-600 flex justify-between items-center">
             <div className="flex gap-1">
                <span className="font-semibold text-gray-800">
                  {!audioBuffer 
                    ? (isLoading ? "Audio wird generiert..." : "Bereit für Audio") 
                    : (isPlaying ? "Wiedergabe" : "Pausiert")}
                </span>
             </div>
             {audioBuffer && (
               <button onClick={onGenerateAudio} className="text-xs flex items-center text-gray-400 hover:text-blue-600">
                 <RefreshCw className="w-3 h-3 mr-1" /> Neu generieren
               </button>
             )}
           </div>
        </div>

        {/* Volume/Extras (Visual only for now) */}
        <div className="hidden sm:flex items-center text-gray-400">
          <Volume2 className="w-5 h-5" />
        </div>
      </div>
    </div>
  );
};

export default Player;