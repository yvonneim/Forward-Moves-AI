import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, Volume2, Settings, RotateCcw } from 'lucide-react';

interface AudioPlayerProps {
  text: string;
  title?: string;
}

export const AudioPlayer: React.FC<AudioPlayerProps> = ({ text, title }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Estimate duration based on word count (average 150 words per minute)
  useEffect(() => {
    const words = text.split(/\s+/).length;
    setDuration(Math.ceil((words / 150) * 60));
  }, [text]);

  useEffect(() => {
    return () => {
      window.speechSynthesis.cancel();
    };
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handlePlayPause = () => {
    if (isPlaying) {
      window.speechSynthesis.pause();
      setIsPlaying(false);
    } else {
      if (window.speechSynthesis.paused) {
        window.speechSynthesis.resume();
      } else {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = playbackRate;
        
        utterance.onend = () => {
          setIsPlaying(false);
          setProgress(100);
          setCurrentTime(duration);
        };
        
        utterance.onboundary = (event) => {
          if (event.name === 'word') {
            const charIndex = event.charIndex;
            const totalChars = text.length;
            const newProgress = (charIndex / totalChars) * 100;
            setProgress(newProgress);
            setCurrentTime((charIndex / totalChars) * duration);
          }
        };
        
        utteranceRef.current = utterance;
        window.speechSynthesis.speak(utterance);
      }
      setIsPlaying(true);
    }
  };

  const handleReset = () => {
    window.speechSynthesis.cancel();
    setIsPlaying(false);
    setProgress(0);
    setCurrentTime(0);
  };

  const toggleRate = () => {
    const rates = [1, 1.25, 1.5, 2];
    const nextRate = rates[(rates.indexOf(playbackRate) + 1) % rates.length];
    setPlaybackRate(nextRate);
    
    // If playing, we need to restart to apply the new rate
    if (isPlaying) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text.substring(Math.floor((progress / 100) * text.length)));
      utterance.rate = nextRate;
      utterance.onend = () => {
        setIsPlaying(false);
        setProgress(100);
        setCurrentTime(duration);
      };
      utterance.onboundary = (event) => {
        if (event.name === 'word') {
          const charIndex = event.charIndex + Math.floor((progress / 100) * text.length);
          const totalChars = text.length;
          setProgress((charIndex / totalChars) * 100);
          setCurrentTime((charIndex / totalChars) * duration);
        }
      };
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto mb-12 bg-slate-50/80 backdrop-blur-md rounded-3xl p-4 md:p-6 border border-slate-100 flex flex-col md:flex-row items-center gap-4 md:gap-8 shadow-sm">
      <div className="flex items-center gap-4 w-full md:w-auto">
        <button 
          onClick={handlePlayPause}
          className="w-12 h-12 bg-fm-blue text-white rounded-full flex items-center justify-center hover:bg-blue-700 transition-all shadow-lg active:scale-95"
          aria-label={isPlaying ? "Pause" : "Play"}
        >
          {isPlaying ? <Pause size={24} fill="currentColor" /> : <Play size={24} fill="currentColor" className="ml-1" />}
        </button>
        
        <div className="text-sm font-mono font-medium text-slate-600 tabular-nums">
          {formatTime(currentTime)} / {formatTime(duration)}
        </div>
      </div>
      
      <div className="flex-1 w-full relative h-12 flex items-center">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-fm-blue transition-all duration-300 relative" 
              style={{ width: `${progress}%` }}
            >
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 bg-white border-2 border-fm-blue rounded-full shadow-md" />
            </div>
          </div>
        </div>
        <input 
          type="range" 
          min="0" 
          max="100" 
          value={progress}
          onChange={(e) => {
            // Manual seeking is complex with SpeechSynthesis, so we'll just show the progress for now
            // or we could implement seeking by restarting the utterance from a specific index
          }}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          disabled
        />
      </div>

      <div className="flex items-center gap-4">
        <button 
          onClick={toggleRate}
          className="px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-50 transition-all shadow-sm min-w-[50px]"
        >
          {playbackRate}x
        </button>
        
        <div className="flex items-center gap-2 text-slate-400">
          <Volume2 size={20} />
          <Settings size={20} className="cursor-pointer hover:text-slate-600" />
        </div>
        
        <button 
          onClick={handleReset}
          className="p-2 text-slate-400 hover:text-slate-600 transition-all"
          title="Reset"
        >
          <RotateCcw size={18} />
        </button>
      </div>
    </div>
  );
};
