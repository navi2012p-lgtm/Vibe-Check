import React, { useState, useRef, useEffect } from 'react';
import { INITIAL_SONGS, THEMES, MOCK_FRIENDS, MARKETPLACE_ITEMS } from './constants';
import { Song, VibeMode, User } from './types';
import Visualizer from './components/Visualizer';
import Player from './components/Player';
import CustomContextMenu from './components/CustomContextMenu';
import Lyrics from './components/Lyrics';
import Sidebar from './components/Sidebar';
import FriendActivity from './components/FriendActivity';
import Marketplace from './components/Marketplace';
import { generateAiPlaylist, searchSongDetails, identifySongFromAudio } from './services/geminiService';
import { Search, Mic, Waves, Loader2, ListPlus, ArrowLeft, PlayCircle, Music2, X, AlertCircle } from 'lucide-react';

const App: React.FC = () => {
  // --- Authentication State ---
  const [user, setUser] = useState<User | null>(null);
  const [showLoginModal, setShowLoginModal] = useState(true);

  // --- Audio State ---
  const [songs, setSongs] = useState<Song[]>(INITIAL_SONGS);
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [playbackSpeed, setPlaybackSpeed] = useState(1.0);
  const [audioError, setAudioError] = useState(false);
  
  // --- UI/Navigation State ---
  const [view, setView] = useState<'PLAYER' | 'SEARCH_RESULTS' | 'HOME' | 'MARKETPLACE' | 'LIBRARY'>('HOME');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [showRecommendations, setShowRecommendations] = useState(false);
  const [lyricsFullscreen, setLyricsFullscreen] = useState(false);
  const [showPlaylistInput, setShowPlaylistInput] = useState(false);
  
  // --- Feature State ---
  const [marketplaceItems, setMarketplaceItems] = useState(MARKETPLACE_ITEMS);
  const [isEatingPlaylist, setIsEatingPlaylist] = useState(false);
  const [isVisualNuke, setIsVisualNuke] = useState(false);
  
  const audioRef = useRef<HTMLAudioElement>(null);
  const theme = THEMES[VibeMode.CHILL]; // Default to CHILL for now

  const currentSong = songs[currentSongIndex];

  // --- Audio Management ---
  useEffect(() => {
    if (audioRef.current) {
        audioRef.current.playbackRate = playbackSpeed;
        audioRef.current.volume = volume;
    }
  }, [playbackSpeed, volume]);

  useEffect(() => {
      // Reset error state when song changes
      setAudioError(false);
  }, [currentSongIndex]);

  useEffect(() => {
    const playAudio = async () => {
        if (isPlaying && audioRef.current) {
            try {
                await audioRef.current.play();
                setAudioError(false);
            } catch (error) {
                console.warn("Playback blocked or failed:", error);
                // Don't set isPlaying to false immediately to allow UI to show "playing" state while we try to fix
            }
        }
    };
    playAudio();
  }, [currentSongIndex, isPlaying]);

  const handleAudioError = () => {
      console.error("Audio source failed to load.");
      setAudioError(true);
      // Auto skip to next song if one fails (playlist continuity)
      setTimeout(() => handleNext(), 1000);
  };

  const handleTimeUpdate = () => {
      if (audioRef.current) {
          setCurrentTime(audioRef.current.currentTime);
      }
  };

  const handleSeek = (time: number) => {
      if (audioRef.current) {
          audioRef.current.currentTime = time;
          setCurrentTime(time);
          if (!isPlaying) setIsPlaying(true);
      }
  };

  const handlePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleNext = () => {
    if (songs.length === 0) return;
    setCurrentSongIndex((prev) => (prev + 1) % songs.length);
    setIsPlaying(true);
  };

  const handlePrev = () => {
    if (songs.length === 0) return;
    setCurrentSongIndex((prev) => (prev - 1 + songs.length) % songs.length);
    setIsPlaying(true);
  };

  // --- Feature Logic ---
  const handleEatPlaylist = () => {
      setIsEatingPlaylist(true);
      setTimeout(() => {
          setSongs([]); 
          setIsPlaying(false);
          setIsEatingPlaylist(false);
          setView('HOME');
      }, 2000);
  };

  const handleVisualNuke = () => {
      setIsVisualNuke(true);
      setTimeout(() => setIsVisualNuke(false), 500);
  };

  const handleInstallItem = (id: string) => {
      setMarketplaceItems(items => items.map(item => 
          item.id === id ? { ...item, installed: true } : item
      ));
      // Mock notification could go here
  };

  const handleInstallApp = () => {
      // Simulate PWA install
      const confirmed = window.confirm("Do you want to install Vibe Check 2.0 to your device?");
      if (confirmed) {
          alert("App added to home screen! (Simulated)");
      }
  };

  const handleLogin = () => {
      setUser({
          name: "Vibe User",
          avatar: "https://i.pravatar.cc/150?img=12",
          isPremium: true
      });
      setShowLoginModal(false);
  };

  // --- Search Logic ---
  const handleSearch = async (e?: React.FormEvent, overrideQuery?: string) => {
      if (e) e.preventDefault();
      const query = overrideQuery || searchQuery;
      if (!query.trim()) return;

      setIsSearching(true);
      setShowRecommendations(false);

      if (showPlaylistInput) {
        const newSongs = await generateAiPlaylist(query);
        if (newSongs.length > 0) {
          setSongs(newSongs);
          setCurrentSongIndex(0);
          setIsPlaying(true);
          setView('PLAYER');
        }
      } else {
          const results = await searchSongDetails(query);
          if (results.length > 0) {
               // Store results as "available to play" but don't overwrite main playlist yet
               // For this UI we just overwrite for simplicity of the grid view
              setSongs(results);
              setView('SEARCH_RESULTS');
          }
      }
      setIsSearching(false);
  };

  const playSearchResult = (index: number) => {
      setCurrentSongIndex(index);
      setIsPlaying(true);
      setView('PLAYER');
  };

  // --- Render ---
  return (
    <div className={`min-h-screen w-full bg-black overflow-hidden font-['Outfit'] flex ${isVisualNuke ? 'animate-shake invert' : ''}`}>
      
      {/* Login Modal */}
      {showLoginModal && !user && (
          <div className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-3xl flex items-center justify-center p-4">
              <div className="bg-white/5 border border-white/10 rounded-3xl p-8 max-w-md w-full text-center shadow-2xl">
                  <div className="w-20 h-20 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full mx-auto mb-6 flex items-center justify-center animate-bounce-slow">
                      <Music2 className="w-10 h-10 text-white" />
                  </div>
                  <h2 className="text-4xl font-black text-white mb-2">VIBE CHECK 2.0</h2>
                  <p className="text-white/50 mb-8">The ultimate social music experience.</p>
                  
                  <button 
                    onClick={handleLogin}
                    className="w-full bg-white text-black font-bold py-4 rounded-xl mb-4 hover:scale-105 transition-transform flex items-center justify-center gap-2"
                  >
                      <img src="https://www.google.com/favicon.ico" className="w-5 h-5" alt="G" />
                      Continue with Google
                  </button>
                  <button 
                    onClick={() => setShowLoginModal(false)}
                    className="text-white/40 hover:text-white text-sm font-bold"
                  >
                      Skip for now
                  </button>
              </div>
          </div>
      )}

      <CustomContextMenu 
        onEatPlaylist={handleEatPlaylist} 
        onSetSpeed={setPlaybackSpeed}
        onVisualNuke={handleVisualNuke}
      />
      
      <audio 
        ref={audioRef} 
        src={currentSong?.url} 
        crossOrigin="anonymous"
        onEnded={handleNext}
        onTimeUpdate={handleTimeUpdate}
        onError={handleAudioError}
      />

      {/* Left Sidebar */}
      <Sidebar 
        onNavigate={(v) => {
            setView(v as any);
            if (v === 'SEARCH') { 
                setView('HOME'); // Reset to home search state but focus?
                setTimeout(() => document.getElementById('search-input')?.focus(), 100);
            }
        }}
        currentView={view}
        onInstallApp={handleInstallApp}
        isLoggedIn={!!user}
        onLogout={() => { setUser(null); setShowLoginModal(true); }}
      />

      {/* Main Content Area */}
      <div className="flex-1 relative flex flex-col h-screen overflow-hidden">
          
          {/* Dynamic Background */}
          {currentSong && (
            <div className={`absolute inset-0 z-0 transition-opacity duration-1000 ${view === 'PLAYER' ? 'opacity-100' : 'opacity-20'}`}>
                <div className="absolute inset-0 bg-black/60 z-10"></div>
                <img 
                    src={currentSong.cover} 
                    alt="bg" 
                    className="w-full h-full object-cover blur-3xl scale-110 animate-pulse-slow" 
                />
            </div>
          )}
          
          {/* Visualizer Layer */}
          <div className="absolute bottom-0 left-0 right-0 h-64 z-0 opacity-30 pointer-events-none">
             <Visualizer audioRef={audioRef} isPlaying={isPlaying} color={theme.visualizerColor} />
          </div>

          {/* Top Search Bar */}
          <div className="z-20 w-full p-6 flex justify-center shrink-0">
             <div className="w-full max-w-3xl relative group">
                 <div className={`relative flex items-center bg-white/10 backdrop-blur-xl border border-white/10 rounded-2xl p-2 transition-all duration-300 focus-within:bg-black/80 shadow-2xl`}>
                     <button 
                        onClick={() => setShowPlaylistInput(!showPlaylistInput)}
                        className={`p-3 rounded-xl transition-colors ${showPlaylistInput ? 'bg-purple-500 text-white' : 'text-white/60 hover:text-white'}`}
                     >
                         {showPlaylistInput ? <ListPlus className="w-5 h-5" /> : <Search className="w-5 h-5" />}
                     </button>
                     <input 
                        id="search-input"
                        type="text"
                        value={searchQuery}
                        onChange={(e) => { setSearchQuery(e.target.value); setShowRecommendations(true); }}
                        onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                        placeholder={showPlaylistInput ? "✨ Describe a vibe to GENERATE..." : "🔍 Search for real songs..."}
                        className="flex-1 bg-transparent border-none outline-none text-white px-4 placeholder-white/40 font-bold text-lg h-10"
                     />
                 </div>
             </div>
          </div>

          {/* Audio Error Toast */}
          {audioError && (
              <div className="absolute top-24 left-1/2 -translate-x-1/2 bg-red-500/90 text-white px-6 py-3 rounded-full z-50 flex items-center gap-3 animate-bounce">
                  <AlertCircle className="w-5 h-5" />
                  <span>Song unavailable in your region. Skipping...</span>
              </div>
          )}

          {/* Main View Container */}
          <div className={`flex-1 relative z-10 overflow-hidden flex flex-col transition-all duration-500 ${isEatingPlaylist ? 'animate-zoom-out opacity-0' : ''}`}>
              
              {isSearching && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50">
                      <div className="flex flex-col items-center">
                        <Loader2 className="w-16 h-16 text-purple-500 animate-spin mb-4" />
                        <p className="text-white font-black text-2xl tracking-widest animate-pulse">VIBE CHECKING...</p>
                      </div>
                  </div>
              )}

              {/* --- VIEW: MARKETPLACE --- */}
              {view === 'MARKETPLACE' && (
                  <Marketplace items={marketplaceItems} onInstall={handleInstallItem} />
              )}

              {/* --- VIEW: LIBRARY --- */}
              {view === 'LIBRARY' && (
                  <div className="p-10 text-center">
                      <h2 className="text-3xl font-bold text-white mb-8">Your Library</h2>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          {[1,2,3,4].map(i => (
                              <div key={i} className="bg-white/5 rounded-2xl aspect-square flex items-center justify-center hover:bg-white/10 cursor-pointer">
                                  <Music2 className="w-12 h-12 text-white/20" />
                              </div>
                          ))}
                      </div>
                      <p className="mt-8 text-white/50">Log in to sync your library across devices.</p>
                  </div>
              )}

              {/* --- VIEW: SEARCH RESULTS --- */}
              {view === 'SEARCH_RESULTS' && (
                  <div className="container mx-auto px-8 py-4 overflow-y-auto custom-scrollbar h-full pb-32">
                      <button onClick={() => setView('PLAYER')} className="flex items-center gap-2 text-white/50 hover:text-white mb-6 font-bold">
                          <ArrowLeft className="w-5 h-5" /> Return to Player
                      </button>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                          {songs.map((song, idx) => (
                              <div 
                                key={song.id} 
                                onClick={() => playSearchResult(idx)}
                                className="group relative bg-white/5 border border-white/5 hover:bg-white/10 rounded-3xl p-4 cursor-pointer transition-all hover:-translate-y-2 overflow-hidden"
                              >
                                  <div className="aspect-square mb-4 overflow-hidden rounded-2xl relative">
                                      <img src={song.cover} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={song.title} />
                                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                          <PlayCircle className="w-16 h-16 text-white drop-shadow-lg" />
                                      </div>
                                  </div>
                                  <h3 className="text-xl font-bold text-white mb-1 truncate">{song.title}</h3>
                                  <p className="text-white/60 font-medium">{song.artist}</p>
                              </div>
                          ))}
                      </div>
                  </div>
              )}

              {/* --- VIEW: PLAYER --- */}
              {view === 'PLAYER' && currentSong && (
                  <div className="h-full flex flex-col items-center justify-center pb-20 overflow-y-auto custom-scrollbar">
                      <div className={`transition-all duration-700 w-full ${lyricsFullscreen ? 'opacity-0 scale-75 h-0 overflow-hidden' : 'opacity-100 scale-100'}`}>
                          <Player 
                              currentSong={currentSong}
                              isPlaying={isPlaying}
                              onNext={handleNext}
                              onPrev={handlePrev}
                              onPlayPause={handlePlayPause}
                              themeColor={theme.accent}
                              onVolumeChange={(vol) => { setVolume(vol); if(audioRef.current) audioRef.current.volume = vol; }}
                          />
                      </div>

                      <div className={`w-full max-w-4xl transition-all duration-500 ${lyricsFullscreen ? 'fixed inset-0 z-50 bg-black/95' : ''}`}>
                          <Lyrics 
                              lyrics={currentSong.lyrics || []}
                              currentTime={currentTime}
                              onSeek={handleSeek}
                              isFullscreen={lyricsFullscreen}
                              onToggleFullscreen={() => setLyricsFullscreen(!lyricsFullscreen)}
                          />
                      </div>
                  </div>
              )}

              {/* --- VIEW: HOME --- */}
              {(view === 'HOME') && (
                  <div className="h-full flex flex-col items-center justify-center text-center p-8">
                      <div className="w-32 h-32 bg-gradient-to-br from-purple-600 to-blue-600 rounded-full flex items-center justify-center mb-8 animate-bounce-slow shadow-[0_0_50px_rgba(100,100,255,0.3)]">
                          <Music2 className="w-16 h-16 text-white" />
                      </div>
                      <h1 className="text-6xl font-black text-white mb-4 tracking-tighter">Vibe Check 2.0</h1>
                      <p className="text-xl text-white/50 max-w-md mb-8">
                        Real Songs. Real Vibes. <br/>
                        <span className="text-purple-400 font-bold">Connect with friends</span> and <span className="text-pink-400 font-bold">customize your world</span>.
                      </p>
                      <button 
                        onClick={() => { setView('MARKETPLACE'); }}
                        className="px-8 py-3 bg-white text-black font-bold rounded-full hover:scale-105 transition-transform"
                      >
                          Open Vibe Store
                      </button>
                  </div>
              )}
          </div>
      </div>

      {/* Right Sidebar (Friend Activity) */}
      <FriendActivity friends={MOCK_FRIENDS} />

      <style>{`
        .animate-spin-slow { animation: spin 8s linear infinite; }
        .animate-pulse-slow { animation: pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite; }
        .animate-bounce-slow { animation: bounce 3s infinite; }
        .animate-shake { animation: shake 0.5s cubic-bezier(.36,.07,.19,.97) both; }
        .animate-zoom-out { animation: zoomOut 0.5s forwards; }
        .mask-image-gradient { mask-image: linear-gradient(transparent, black 20%, black 80%, transparent); }
        
        @keyframes zoomOut {
            to { transform: scale(0); opacity: 0; }
        }
        
        @keyframes shake {
            10%, 90% { transform: translate3d(-4px, 0, 0); }
            20%, 80% { transform: translate3d(6px, 0, 0); }
            30%, 50%, 70% { transform: translate3d(-8px, 0, 0); }
            40%, 60% { transform: translate3d(8px, 0, 0); }
        }
      `}</style>
    </div>
  );
};

export default App;