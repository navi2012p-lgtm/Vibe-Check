export interface LyricLine {
  time: number; // seconds
  text: string;
}

export interface Song {
  id: string;
  title: string;
  artist: string;
  cover: string;
  url: string;
  color: string; // Dominant color for UI theming
  lyrics?: LyricLine[];
}

export interface ContextMenuPosition {
  x: number;
  y: number;
}

export enum VibeMode {
  CHILL = 'CHILL',
  PARTY = 'PARTY',
  FOCUS = 'FOCUS',
  CHAOS = 'CHAOS'
}

export interface VibeTheme {
  background: string;
  accent: string;
  visualizerColor: string;
}

export interface User {
  name: string;
  avatar: string;
  isPremium: boolean;
}

export interface FriendActivity {
  id: string;
  name: string;
  avatar: string;
  song: string;
  artist: string;
  status: 'online' | 'offline' | 'listening';
  timestamp: string;
}

export interface MarketplaceItem {
  id: string;
  name: string;
  description: string;
  type: 'THEME' | 'PLUGIN' | 'WIDGET';
  author: string;
  downloads: string;
  icon: React.ElementType;
  installed: boolean;
}