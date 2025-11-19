import { Song, VibeMode, VibeTheme, FriendActivity, MarketplaceItem } from './types';
import { Palette, Zap, Ghost, Music, Radio, Crown } from 'lucide-react';

// Reliable audio sources for demo purposes
export const DEMO_AUDIO_URLS = [
  'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
  'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
  'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3',
  'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-15.mp3',
  'https://cdn.pixabay.com/download/audio/2022/03/15/audio_c8c8a73467.mp3?filename=relaxing-mountains-rivers-streams-running-water-18178.mp3', 
  'https://cdn.pixabay.com/download/audio/2022/01/18/audio_d0a13f69d0.mp3?filename=lofi-study-112191.mp3'
];

export const INITIAL_SONGS: Song[] = [
  {
    id: 'init-1',
    title: 'Blinding Lights',
    artist: 'The Weeknd',
    cover: 'https://upload.wikimedia.org/wikipedia/en/e/e6/The_Weeknd_-_Blinding_Lights.png',
    url: DEMO_AUDIO_URLS[0],
    color: '#ef4444'
  },
  {
    id: 'init-2',
    title: 'Midnight City',
    artist: 'M83',
    cover: 'https://upload.wikimedia.org/wikipedia/en/7/75/M83_-_Midnight_City.jpg',
    url: DEMO_AUDIO_URLS[1],
    color: '#a855f7'
  },
  {
    id: 'init-3',
    title: 'Do I Wanna Know?',
    artist: 'Arctic Monkeys',
    cover: 'https://upload.wikimedia.org/wikipedia/commons/e/e7/Arctic_Monkeys_-_AM.jpg',
    url: DEMO_AUDIO_URLS[2],
    color: '#000000'
  }
];

export const MOCK_FRIENDS: FriendActivity[] = [
  { id: '1', name: 'Alex Chen', avatar: 'https://i.pravatar.cc/150?u=1', song: 'Levitating', artist: 'Dua Lipa', status: 'listening', timestamp: '2m ago' },
  { id: '2', name: 'Sarah Jenkins', avatar: 'https://i.pravatar.cc/150?u=2', song: 'Bohemian Rhapsody', artist: 'Queen', status: 'listening', timestamp: 'Now' },
  { id: '3', name: 'Mike Ross', avatar: 'https://i.pravatar.cc/150?u=3', song: 'Paused', artist: '', status: 'offline', timestamp: '1h ago' },
  { id: '4', name: 'Jessica Pearson', avatar: 'https://i.pravatar.cc/150?u=4', song: 'Empire State of Mind', artist: 'Jay-Z', status: 'listening', timestamp: '5m ago' },
];

export const MARKETPLACE_ITEMS: MarketplaceItem[] = [
  { id: 'm1', name: 'Neon Tokyo Theme', description: 'Cyberpunk aesthetics for your player.', type: 'THEME', author: 'VibeCorp', downloads: '1.2M', icon: Palette, installed: false },
  { id: 'm2', name: 'Bass Booster Pro', description: 'Enhance the low end frequencies.', type: 'PLUGIN', author: 'AudioLabs', downloads: '850k', icon: Zap, installed: true },
  { id: 'm3', name: 'Ghost Mode', description: 'Listen without your friends knowing.', type: 'PLUGIN', author: 'AnonUser', downloads: '2.1M', icon: Ghost, installed: false },
  { id: 'm4', name: 'Retro Vinyl', description: 'Add crackle and pop sounds.', type: 'WIDGET', author: 'HipsterDev', downloads: '300k', icon: Music, installed: false },
  { id: 'm5', name: 'Global Radio', description: 'Access stations from around the world.', type: 'PLUGIN', author: 'VibeCheck', downloads: '5M', icon: Radio, installed: false },
  { id: 'm6', name: 'Golden Vibe', description: 'Exclusive gold UI for premium users.', type: 'THEME', author: 'VibeCheck', downloads: '10k', icon: Crown, installed: false },
];

export const THEMES: Record<VibeMode, VibeTheme> = {
  [VibeMode.CHILL]: {
    background: 'bg-gradient-to-br from-blue-900 via-gray-900 to-slate-900',
    accent: 'text-blue-400',
    visualizerColor: '#60a5fa'
  },
  [VibeMode.PARTY]: {
    background: 'bg-gradient-to-br from-purple-900 via-fuchsia-900 to-pink-900',
    accent: 'text-fuchsia-400',
    visualizerColor: '#e879f9'
  },
  [VibeMode.FOCUS]: {
    background: 'bg-gradient-to-br from-emerald-900 via-green-900 to-teal-900',
    accent: 'text-emerald-400',
    visualizerColor: '#34d399'
  },
  [VibeMode.CHAOS]: {
    background: 'bg-[conic-gradient(at_top,_var(--tw-gradient-stops))] from-red-900 via-orange-900 to-yellow-900',
    accent: 'text-yellow-400',
    visualizerColor: '#facc15'
  }
};