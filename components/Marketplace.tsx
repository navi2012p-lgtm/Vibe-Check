import React from 'react';
import { MarketplaceItem } from '../types';
import { Download, Star, CheckCircle } from 'lucide-react';

interface MarketplaceProps {
  items: MarketplaceItem[];
  onInstall: (id: string) => void;
}

const Marketplace: React.FC<MarketplaceProps> = ({ items, onInstall }) => {
  return (
    <div className="p-8 pb-32 h-full overflow-y-auto custom-scrollbar">
      <div className="flex items-center justify-between mb-8">
        <div>
           <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-violet-500 mb-2">Vibe Store</h1>
           <p className="text-white/60">Customize your player. All vibes are free.</p>
        </div>
        <div className="flex gap-2">
            <span className="px-4 py-1 rounded-full bg-white/10 text-xs font-bold text-white border border-white/10">Balance: ∞ Vibes</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
        {items.map((item) => (
          <div key={item.id} className="bg-white/5 border border-white/5 rounded-2xl p-6 hover:bg-white/10 transition-all hover:-translate-y-1 group">
            <div className="flex justify-between items-start mb-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${item.type === 'THEME' ? 'bg-pink-500/20 text-pink-400' : 'bg-blue-500/20 text-blue-400'}`}>
                <item.icon className="w-6 h-6" />
              </div>
              {item.type === 'THEME' && <span className="text-[10px] bg-pink-500 text-white px-2 py-0.5 rounded-full font-bold">THEME</span>}
              {item.type === 'PLUGIN' && <span className="text-[10px] bg-blue-500 text-white px-2 py-0.5 rounded-full font-bold">PLUGIN</span>}
              {item.type === 'WIDGET' && <span className="text-[10px] bg-yellow-500 text-black px-2 py-0.5 rounded-full font-bold">WIDGET</span>}
            </div>
            
            <h3 className="text-xl font-bold text-white mb-1">{item.name}</h3>
            <p className="text-sm text-white/50 mb-4 h-10 line-clamp-2">{item.description}</p>
            
            <div className="flex items-center justify-between mt-auto">
                <div className="flex items-center gap-1 text-xs text-white/40">
                    <Star className="w-3 h-3 fill-yellow-500 text-yellow-500" />
                    <span>4.9 • {item.downloads}</span>
                </div>
                
                <button 
                    onClick={() => onInstall(item.id)}
                    disabled={item.installed}
                    className={`px-4 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2 
                    ${item.installed 
                        ? 'bg-green-500/20 text-green-400 cursor-default' 
                        : 'bg-white text-black hover:scale-105'}`}
                >
                    {item.installed ? (
                        <>
                            <CheckCircle className="w-4 h-4" /> Installed
                        </>
                    ) : (
                        <>
                            <Download className="w-4 h-4" /> Get
                        </>
                    )}
                </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Marketplace;