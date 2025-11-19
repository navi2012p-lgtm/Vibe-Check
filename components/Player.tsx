import React, { useState } from 'react';
import { Play, Pause, SkipBack, SkipForward, Repeat, Shuffle, Volume2, VolumeX } from 'lucide-react';
import { Song } from '../types';

interface PlayerProps {
  currentSong: Song;
  isPlaying: boolean;
  onPlayPause: () => void;
  onNext: () => void;
  onPrev: () => void;
  themeColor: string;
  onVolumeChange: (vol: number) => void;
}

const Player: React.FC<PlayerProps> = ({ 
  currentSong, 
  isPlaying, 
  onPlayPause, 
  onNext, 
  onPrev,
  themeColor,
  onVolumeChange
}) => {
  const [volume, setVolume] = useState(0.8);
  const [isMuted, setIsMuted] = useState(false);

  const handleVolChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const val = parseFloat(e.target.value);
      setVolume(val);
      setIsMuted(val === 0);
      onVolumeChange(val);
  };

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-3xl mx-auto z-20 relative">
      
      {/* Album Art - Floating and Glowing */}
      <div className="relative group mb-10 w-full max-w-[300px] aspect-square perspective-1000">
        <div className={`absolute inset-0 bg-gradient-to-tr from-${themeColor}-500 to-white rounded-full blur-3xl opacity-30 animate-pulse`}></div>
        <img 
          src={currentSong.cover} 
          alt={currentSong.title} 
          className={`w-full h-full object-cover rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] transition-all duration-700 ${isPlaying ? 'scale-100 rotate-0' : 'scale-90 rotate-1 grayscale-[0.5]'}`}
        />
      </div>

      {/* Song Info */}
      <div className="text-center mb-10">
        <h2 className="text-5xl font-black text-white tracking-tighter mb-2 drop-shadow-[0_0_10px_rgba(255,255,255,0.5)] animate-fade-in-up">{currentSong.title}</h2>
        <p className="text-xl text-white/70 font-bold uppercase tracking-widest">{currentSong.artist}</p>
      </div>

      {/* Main Controls */}
      <div className="flex flex-col items-center w-full gap-8">
          
          <div className="flex items-center justify-center gap-10">
            <button className="text-white/30 hover:text-white transition-colors hover:rotate-180 duration-500">
                <Shuffle className="w-5 h-5" />
            </button>

            <button 
                onClick={onPrev}
                className="text-white hover:text-white/80 hover:scale-110 active:scale-90 transition-all"
            >
            <SkipBack className="w-10 h-10 fill-current" />
            </button>

            <button 
                onClick={onPlayPause}
                className={`w-20 h-20 rounded-full bg-white text-black flex items-center justify-center hover:scale-110 transition-all shadow-[0_0_40px_rgba(255,255,255,0.3)] active:scale-95`}
            >
            {isPlaying ? (
                <Pause className="w-8 h-8 fill-black" />
            ) : (
                <Play className="w-8 h-8 fill-black ml-1" />
            )}
            </button>

            <button 
                onClick={onNext}
                className="text-white hover:text-white/80 hover:scale-110 active:scale-90 transition-all"
            >
            <SkipForward className="w-10 h-10 fill-current" />
            </button>

            <button className="text-white/30 hover:text-white transition-colors hover:rotate-180 duration-500">
                <Repeat className="w-5 h-5" />
            </button>
          </div>

          {/* Volume Slider */}
          <div className="flex items-center gap-3 w-64 group">
             <button onClick={() => onVolumeChange(isMuted ? 0.8 : 0)} className="text-white/50 group-hover:text-white transition-colors">
                 {isMuted || volume === 0 ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
             </button>
             <input 
                type="range" 
                min="0" 
                max="1" 
                step="0.01" 
                value={volume}
                onChange={handleVolChange}
                className="w-full h-1 bg-white/20 rounded-full appearance-none cursor-pointer hover:h-2 transition-all [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:rounded-full"
             />
          </div>
      </div>
    </div>
  );
};

export default Player;