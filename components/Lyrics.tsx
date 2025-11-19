import React, { useRef, useEffect } from 'react';
import { LyricLine } from '../types';
import { Maximize2, Minimize2 } from 'lucide-react';

interface LyricsProps {
  lyrics: LyricLine[];
  currentTime: number;
  onSeek: (time: number) => void;
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
}

const Lyrics: React.FC<LyricsProps> = ({ 
  lyrics, 
  currentTime, 
  onSeek,
  isFullscreen,
  onToggleFullscreen
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const activeLineRef = useRef<HTMLParagraphElement>(null);

  // Find active line index
  const activeIndex = lyrics.reduce((acc, line, idx) => {
    if (currentTime >= line.time) return idx;
    return acc;
  }, -1);

  useEffect(() => {
    if (activeLineRef.current && containerRef.current) {
        activeLineRef.current.scrollIntoView({
            behavior: 'smooth',
            block: 'center'
        });
    }
  }, [activeIndex]);

  if (!lyrics || lyrics.length === 0) {
      return (
          <div className="mt-12 text-white/40 text-center font-medium animate-pulse">
              Creating vibe-matched lyrics...
          </div>
      );
  }

  return (
    <div className={`relative transition-all duration-500 ${isFullscreen ? 'fixed inset-0 z-50 bg-black/90 backdrop-blur-xl flex items-center justify-center' : 'w-full mt-8 h-32'}`}>
        
        {/* Toggle Button */}
        <button 
            onClick={onToggleFullscreen}
            className="absolute top-4 right-4 p-2 text-white/50 hover:text-white bg-white/10 hover:bg-white/20 rounded-full transition-all z-50"
        >
            {isFullscreen ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
        </button>

        <div 
            ref={containerRef}
            className={`overflow-y-auto custom-scrollbar text-center px-4 scroll-smooth mask-image-gradient ${isFullscreen ? 'h-full py-20 w-full max-w-4xl' : 'h-full'}`}
            style={{ maskImage: isFullscreen ? 'none' : 'linear-gradient(transparent, black 20%, black 80%, transparent)' }}
        >
            {lyrics.map((line, idx) => {
                const isActive = idx === activeIndex;
                const isPast = idx < activeIndex;

                return (
                    <p
                        key={idx}
                        ref={isActive ? activeLineRef : null}
                        onClick={() => onSeek(line.time)}
                        className={`
                            cursor-pointer transition-all duration-500 my-4 font-bold tracking-tight
                            ${isFullscreen ? 'text-3xl md:text-5xl' : 'text-lg'}
                            ${isActive ? 'text-white scale-105 opacity-100 blur-0' : 'text-white/30 scale-100 blur-[1px] hover:text-white/60 hover:blur-0'}
                            ${isActive ? 'animate-[bounce-subtle_1s_infinite]' : ''}
                        `}
                    >
                        {line.text}
                    </p>
                );
            })}
        </div>
    </div>
  );
};

export default Lyrics;