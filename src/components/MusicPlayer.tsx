import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Play, Pause, SkipForward, SkipBack, Music2, Volume2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface Track {
  id: number;
  title: string;
  artist: string;
  url: string;
  color: string;
}

const TRACKS: Track[] = [
  {
    id: 1,
    title: "NEON PULSE",
    artist: "AI_SYNTH_01",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    color: "var(--color-neon-cyan)"
  },
  {
    id: 2,
    title: "CYBER DRIP",
    artist: "GLITCH_HOPPER",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
    color: "var(--color-neon-magenta)"
  },
  {
    id: 3,
    title: "DIGITAL GHOST",
    artist: "ECHO_UNIT",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3",
    color: "var(--color-neon-yellow)"
  }
];

export const MusicPlayer: React.FC = () => {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const currentTrack = TRACKS[currentTrackIndex];

  const handleTogglePlay = () => {
    if (isPlaying) {
      audioRef.current?.pause();
    } else {
      audioRef.current?.play().catch(e => console.log("Audio play blocked", e));
    }
    setIsPlaying(!isPlaying);
  };

  const handleNext = useCallback(() => {
    setCurrentTrackIndex((prev) => (prev + 1) % TRACKS.length);
    setIsPlaying(true);
  }, []);

  const handlePrev = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + TRACKS.length) % TRACKS.length);
    setIsPlaying(true);
  };

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.src = currentTrack.url;
      if (isPlaying) {
        audioRef.current.play().catch(e => console.log("Audio play blocked", e));
      }
    }
  }, [currentTrackIndex, isPlaying]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateProgress = () => {
      const p = (audio.currentTime / audio.duration) * 100;
      setProgress(isNaN(p) ? 0 : p);
    };

    audio.addEventListener('timeupdate', updateProgress);
    audio.addEventListener('ended', handleNext);
    return () => {
      audio.removeEventListener('timeupdate', updateProgress);
      audio.removeEventListener('ended', handleNext);
    };
  }, [handleNext]);

  return (
    <div className="flex flex-col gap-4">
      <audio ref={audioRef} />
      
      <div className="flex items-center gap-4">
        <div 
          className="w-16 h-16 rounded-xl flex items-center justify-center relative overflow-hidden backdrop-blur-md"
          style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)', border: `1px solid ${currentTrack.color}` }}
        >
          <Music2 className="w-8 h-8 opacity-50" style={{ color: currentTrack.color }} />
          {isPlaying && (
            <div className="absolute inset-x-0 bottom-0 flex items-end justify-around h-8 px-1">
              {[1, 2, 3, 4].map(i => (
                <motion.div
                  key={i}
                  className="w-1 bg-white"
                  animate={{ height: [4, 16, 8, 20, 4] }}
                  transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.1 }}
                  style={{ backgroundColor: currentTrack.color }}
                />
              ))}
            </div>
          )}
        </div>

        <div className="flex-1 overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentTrack.id}
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -10, opacity: 0 }}
              className="flex flex-col"
            >
              <h3 className="text-lg font-bold tracking-tight text-white mb-0.5">{currentTrack.title}</h3>
              <p className="text-[10px] font-mono tracking-widest text-[#00f2ff] uppercase">{currentTrack.artist} • 03:42</p>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="flex items-center gap-4">
          <button onClick={handlePrev} className="p-2 text-white/30 hover:text-white transition-colors">
            <SkipBack className="w-5 h-5" />
          </button>
          <button 
            onClick={handleTogglePlay}
            className="w-14 h-14 rounded-full border border-neon-cyan flex items-center justify-center text-neon-cyan bg-neon-cyan/5 hover:bg-neon-cyan hover:text-black transition-all shadow-[0_0_15px_rgba(0,242,255,0.2)]"
          >
            {isPlaying ? <Pause className="w-6 h-6" fill="currentColor" /> : <Play className="w-6 h-6 translate-x-0.5" fill="currentColor" />}
          </button>
          <button onClick={handleNext} className="p-2 text-white/30 hover:text-white transition-colors">
            <SkipForward className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="space-y-1">
        <div className="h-1 bg-white/10 rounded-full overflow-hidden">
          <motion.div 
            className="h-full bg-neon-cyan shadow-[0_0_10px_#00f2ff]"
            style={{ width: `${progress}%`, backgroundColor: currentTrack.color }}
          />
        </div>
      </div>
    </div>
  );
};
