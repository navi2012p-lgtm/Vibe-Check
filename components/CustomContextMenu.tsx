import React, { useEffect, useState, useRef } from 'react';
import { Zap, Music, Ghost, Trash2, FastForward, Rewind, EyeOff, Disc } from 'lucide-react';
import { ContextMenuPosition } from '../types';

interface CustomContextMenuProps {
  onEatPlaylist: () => void;
  onSetSpeed: (speed: number) => void;
  onVisualNuke: () => void;
}

const CustomContextMenu: React.FC<CustomContextMenuProps> = ({ onEatPlaylist, onSetSpeed, onVisualNuke }) => {
  const [visible, setVisible] = useState(false);
  const [position, setPosition] = useState<ContextMenuPosition>({ x: 0, y: 0 });
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      setVisible(true);
      setPosition({ x: e.clientX, y: e.clientY });
    };

    const handleClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setVisible(false);
      }
    };

    window.addEventListener('contextmenu', handleContextMenu);
    window.addEventListener('click', handleClick);

    return () => {
      window.removeEventListener('contextmenu', handleContextMenu);
      window.removeEventListener('click', handleClick);
    };
  }, []);

  if (!visible) return null;

  return (
    <div
      ref={menuRef}
      style={{ top: position.y, left: position.x }}
      className="fixed z-[100] min-w-[240px] bg-black/90 backdrop-blur-2xl border border-white/20 rounded-2xl shadow-[0_0_50px_rgba(120,0,255,0.3)] p-2 animate-[scale-in_0.2s_ease-out] overflow-hidden text-white font-['Outfit']"
    >
        <div className="px-4 py-3 text-xs font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 uppercase tracking-widest mb-1 border-b border-white/10">
            Vibe Controls
        </div>
      
      <div className="grid grid-cols-1 gap-1 mt-1">
          <button 
            onClick={() => { onEatPlaylist(); setVisible(false); }}
            className="group w-full flex items-center gap-3 px-3 py-3 text-sm font-bold text-red-400 hover:bg-red-500/20 rounded-xl transition-all hover:scale-105"
          >
            <Trash2 className="w-5 h-5 group-hover:animate-bounce" />
            <span>EAT PLAYLIST</span>
          </button>

          <div className="h-px bg-white/10 my-1" />

          <div className="px-3 py-1 text-[10px] text-gray-500 uppercase tracking-wider font-bold">Time Warp</div>
          
          <div className="flex gap-2 px-2">
            <button 
                onClick={() => onSetSpeed(0.5)}
                className="flex-1 flex flex-col items-center justify-center p-2 bg-white/5 hover:bg-white/20 rounded-lg transition-colors"
            >
                <Rewind className="w-4 h-4 mb-1 text-blue-400" />
                <span className="text-xs">Slow Mo</span>
            </button>
             <button 
                onClick={() => onSetSpeed(1.0)}
                className="flex-1 flex flex-col items-center justify-center p-2 bg-white/5 hover:bg-white/20 rounded-lg transition-colors"
            >
                <Disc className="w-4 h-4 mb-1 text-green-400" />
                <span className="text-xs">Normal</span>
            </button>
            <button 
                onClick={() => onSetSpeed(1.5)}
                className="flex-1 flex flex-col items-center justify-center p-2 bg-white/5 hover:bg-white/20 rounded-lg transition-colors"
            >
                <FastForward className="w-4 h-4 mb-1 text-yellow-400" />
                <span className="text-xs">Nightcore</span>
            </button>
          </div>

          <div className="h-px bg-white/10 my-1" />

           <button 
            onClick={() => { onVisualNuke(); setVisible(false); }}
            className="w-full flex items-center gap-3 px-3 py-3 text-sm font-bold text-purple-300 hover:bg-purple-500/20 rounded-xl transition-colors group"
          >
            <EyeOff className="w-5 h-5 group-hover:animate-spin" />
            <span>VISUAL NUKE</span>
          </button>
      </div>
    </div>
  );
};

export default CustomContextMenu;