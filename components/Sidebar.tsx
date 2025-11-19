import React from 'react';
import { Home, Search, Library, PlusSquare, Heart, Disc, ShoppingBag, Settings, LogOut, MonitorDown } from 'lucide-react';

interface SidebarProps {
  onNavigate: (view: string) => void;
  currentView: string;
  onInstallApp: () => void;
  isLoggedIn: boolean;
  onLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onNavigate, currentView, onInstallApp, isLoggedIn, onLogout }) => {
  const isActive = (view: string) => currentView === view ? 'text-white bg-white/10' : 'text-white/70 hover:text-white hover:bg-white/5';

  return (
    <div className="hidden md:flex w-60 flex-col h-full bg-black/80 backdrop-blur-2xl border-r border-white/10 p-4 z-40">
        <div className="flex items-center gap-3 mb-8 px-2 cursor-pointer hover:scale-105 transition-transform" onClick={() => onNavigate('HOME')}>
             <div className="w-9 h-9 bg-gradient-to-br from-fuchsia-600 to-purple-600 rounded-full flex items-center justify-center animate-spin-slow shadow-[0_0_15px_rgba(192,38,211,0.5)]">
                <Disc className="text-white w-5 h-5" />
             </div>
             <h1 className="text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400 tracking-tighter">VIBE CHECK</h1>
        </div>

        <nav className="space-y-1 mb-8">
            <button onClick={() => onNavigate('HOME')} className={`flex items-center gap-3 font-bold text-sm transition-all w-full p-3 rounded-lg ${isActive('PLAYER')} ${isActive('HOME')}`}>
                <Home className="w-5 h-5" />
                <span>Home</span>
            </button>
             <button onClick={() => onNavigate('SEARCH')} className={`flex items-center gap-3 font-bold text-sm transition-all w-full p-3 rounded-lg ${isActive('SEARCH_RESULTS')}`}>
                <Search className="w-5 h-5" />
                <span>Search</span>
            </button>
             <button onClick={() => onNavigate('LIBRARY')} className={`flex items-center gap-3 font-bold text-sm transition-all w-full p-3 rounded-lg ${isActive('LIBRARY')}`}>
                <Library className="w-5 h-5" />
                <span>Your Library</span>
            </button>
             <button onClick={() => onNavigate('MARKETPLACE')} className={`flex items-center gap-3 font-bold text-sm transition-all w-full p-3 rounded-lg ${isActive('MARKETPLACE')}`}>
                <ShoppingBag className="w-5 h-5" />
                <span>Vibe Store</span>
                <span className="ml-auto text-[10px] bg-pink-600 text-white px-1.5 py-0.5 rounded-full">NEW</span>
            </button>
        </nav>

        <div className="mt-2 pt-4 border-t border-white/10 space-y-2">
            <button className="flex items-center gap-3 text-white/70 hover:text-white font-bold text-sm transition-colors w-full p-3 rounded-lg hover:bg-white/5 group">
                <div className="w-6 h-6 bg-white/10 rounded flex items-center justify-center group-hover:bg-white group-hover:text-black transition-colors">
                    <PlusSquare className="w-4 h-4" />
                </div>
                <span>Create Playlist</span>
            </button>
            <button className="flex items-center gap-3 text-white/70 hover:text-white font-bold text-sm transition-colors w-full p-3 rounded-lg hover:bg-white/5 group">
                 <div className="w-6 h-6 bg-gradient-to-br from-indigo-700 to-blue-300 rounded flex items-center justify-center opacity-70 group-hover:opacity-100 transition-opacity">
                    <Heart className="w-3 h-3 text-white fill-white" />
                </div>
                <span>Liked Songs</span>
            </button>
        </div>
        
        <div className="mt-auto pt-4 border-t border-white/10 space-y-1">
             <button onClick={onInstallApp} className="flex items-center gap-3 text-white/60 hover:text-white font-medium text-xs transition-colors w-full p-2 rounded hover:bg-white/5">
                <MonitorDown className="w-4 h-4" />
                <span>Install App</span>
             </button>
             
             {isLoggedIn && (
               <button onClick={onLogout} className="flex items-center gap-3 text-red-400/60 hover:text-red-400 font-medium text-xs transition-colors w-full p-2 rounded hover:bg-red-500/10">
                  <LogOut className="w-4 h-4" />
                  <span>Log Out</span>
               </button>
             )}
        </div>
    </div>
  );
};

export default Sidebar;