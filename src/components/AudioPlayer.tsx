import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, Volume2, Settings, RotateCcw, Loader2 } from 'lucide-react';
import { generateSpeech } from '../services/ttsService';

interface AudioPlayerProps {
  text: string;
  title?: string;
}

export const AudioPlayer: React.FC<AudioPlayerProps> = ({ text, title }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);

  // Estimate duration based on word count (average 150 words per minute)
  useEffect(() => {
    const words = text.split(/\s+/).length;
    setDuration(Math.ceil((words / 150) * 60));
  }, [text]);

  useEffect(() => {
    return () => {
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      window.speechSynthesis.cancel();
    };
  }, [audioUrl]);

  const formatTime = (seconds: number) => {
    if (isNaN(seconds) || seconds === Infinity) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handlePlayPause = async () => {
    if (isPlaying) {
      if (audioRef.current) {
        audioRef.current.pause();
      } else {
        window.speechSynthesis.pause();
      }
      setIsPlaying(false);
    } else {
      if (audioRef.current) {
        audioRef.current.play().catch(err => console.error("Audio play failed:", err));
        setIsPlaying(true);
      } else if (window.speechSynthesis.speaking && window.speechSynthesis.paused) {
        window.speechSynthesis.resume();
        setIsPlaying(true);
      } else {
        setIsLoading(true);
        try {
          // Add a longer timeout to the TTS generation to prevent premature fallback
          const timeoutPromise = new Promise<never>((_, reject) => 
            setTimeout(() => reject(new Error("TTS generation timed out")), 25000)
          );
          
          const base64Audio = await Promise.race([
            generateSpeech(text),
            timeoutPromise
          ]);

          const binaryString = window.atob(base64Audio);
          const bytes = new Uint8Array(binaryString.length);
          for (let i = 0; i < binaryString.length; i++) {
            bytes[i] = binaryString.charCodeAt(i);
          }
          const blob = new Blob([bytes], { type: 'audio/mp3' });
          const url = URL.createObjectURL(blob);
          setAudioUrl(url);

          const audio = new Audio(url);
          audio.playbackRate = playbackRate;
          
          audio.onloadedmetadata = () => {
            setDuration(audio.duration);
          };

          audio.ontimeupdate = () => {
            setCurrentTime(audio.currentTime);
            setProgress((audio.currentTime / audio.duration) * 100);
          };

          audio.onended = () => {
            setIsPlaying(false);
            setProgress(0);
            setCurrentTime(0);
          };

          audioRef.current = audio;
          await audio.play();
          setIsPlaying(true);
        } catch (error) {
          console.error("Gemini TTS failed or timed out, falling back to browser speech:", error);
          
          // Fallback to browser speech
          window.speechSynthesis.cancel();
          const utterance = new SpeechSynthesisUtterance(text);
          utterance.rate = playbackRate;
          
          // Try to find a more natural browser voice if available
          const voices = window.speechSynthesis.getVoices();
          const naturalVoice = voices.find(v => 
            (v.name.includes('Google') || v.name.includes('Natural') || v.name.includes('Premium')) && 
            v.lang.startsWith('en')
          );
          if (naturalVoice) {
            utterance.voice = naturalVoice;
          }
          
          utterance.onstart = () => {
            setIsPlaying(true);
            setIsLoading(false);
          };

          utterance.onend = () => {
            setIsPlaying(false);
            setProgress(0);
            setCurrentTime(0);
          };

          utterance.onerror = (event) => {
            console.error("SpeechSynthesis error:", event);
            setIsPlaying(false);
            setIsLoading(false);
          };

          utterance.onboundary = (event) => {
            if (event.name === 'word') {
              const charIndex = event.charIndex;
              const totalChars = text.length;
              setProgress((charIndex / totalChars) * 100);
              setCurrentTime((charIndex / totalChars) * duration);
            }
          };

          window.speechSynthesis.speak(utterance);
          // Note: we don't set isLoading(false) here yet, we wait for onstart or catch
        } finally {
          // If we didn't start the fallback, or if it failed immediately, clear loading
          setTimeout(() => {
            if (!window.speechSynthesis.speaking && !isPlaying) {
              setIsLoading(false);
            }
          }, 100);
        }
      }
    }
  };

  const handleReset = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsPlaying(false);
      setProgress(0);
      setCurrentTime(0);
    }
  };

  const toggleRate = () => {
    const rates = [1, 1.25, 1.5, 2];
    const nextRate = rates[(rates.indexOf(playbackRate) + 1) % rates.length];
    setPlaybackRate(nextRate);
    if (audioRef.current) {
      audioRef.current.playbackRate = nextRate;
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto mb-12 bg-slate-50/80 backdrop-blur-md rounded-3xl p-4 md:p-6 border border-slate-100 flex flex-col md:flex-row items-center gap-4 md:gap-8 shadow-sm">
      <div className="flex items-center gap-4 w-full md:w-auto">
        <button 
          onClick={handlePlayPause}
          disabled={isLoading}
          className="w-12 h-12 bg-fm-blue text-white rounded-full flex items-center justify-center hover:bg-blue-700 transition-all shadow-lg active:scale-95 disabled:opacity-50"
          aria-label={isPlaying ? "Pause" : "Play"}
        >
          {isLoading ? (
            <Loader2 size={24} className="animate-spin" />
          ) : isPlaying ? (
            <Pause size={24} fill="currentColor" />
          ) : (
            <Play size={24} fill="currentColor" className="ml-1" />
          )}
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
            const newProgress = parseFloat(e.target.value);
            if (audioRef.current) {
              const newTime = (newProgress / 100) * audioRef.current.duration;
              audioRef.current.currentTime = newTime;
              setProgress(newProgress);
              setCurrentTime(newTime);
            }
          }}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
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
