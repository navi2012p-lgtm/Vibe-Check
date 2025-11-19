import React from 'react';
import { FriendActivity as FriendType } from '../types';
import { UserPlus, Users } from 'lucide-react';

interface FriendActivityProps {
  friends: FriendType[];
}

const FriendActivity: React.FC<FriendActivityProps> = ({ friends }) => {
  return (
    <div className="hidden xl:flex flex-col w-72 h-full bg-black/60 backdrop-blur-xl border-l border-white/10 p-6 z-30">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-white font-bold text-sm tracking-widest uppercase flex items-center gap-2">
          <Users className="w-4 h-4" /> Friend Activity
        </h2>
        <button className="text-white/50 hover:text-white transition-colors">
          <UserPlus className="w-4 h-4" />
        </button>
      </div>

      <div className="space-y-6 overflow-y-auto custom-scrollbar">
        {friends.map((friend) => (
          <div key={friend.id} className="flex gap-3 group cursor-pointer">
            <div className="relative">
              <img src={friend.avatar} alt={friend.name} className="w-10 h-10 rounded-full border border-white/10 group-hover:border-white/50 transition-colors" />
              {friend.status === 'listening' && (
                <div className="absolute -top-1 -right-1">
                   <div className="w-3 h-3 bg-green-500 rounded-full border-2 border-black animate-pulse"></div>
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-baseline">
                <h3 className="text-white font-bold text-sm truncate hover:underline">{friend.name}</h3>
                <span className="text-[10px] text-white/30 whitespace-nowrap ml-1">{friend.timestamp}</span>
              </div>
              
              {friend.status === 'listening' ? (
                <div className="text-xs text-white/60 truncate">
                  Listening to <span className="text-white font-medium">{friend.song}</span>
                  <div className="text-[10px] text-white/40 truncate">• {friend.artist}</div>
                </div>
              ) : (
                <div className="text-xs text-white/40 italic">Offline</div>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-auto pt-6 border-t border-white/10">
        <button className="w-full py-2 bg-white/5 hover:bg-white/10 rounded-full text-xs text-white/70 font-bold transition-colors">
          Find Friends
        </button>
      </div>
    </div>
  );
};

export default FriendActivity;