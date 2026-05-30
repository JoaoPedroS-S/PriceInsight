import React, { useState } from 'react';
import { Search, TrendingDown, TrendingUp, Package, Store, ChevronRight, MapPin, Truck } from 'lucide-react';
import { motion } from 'motion/react';
import { Market } from '../../types';

interface HomeViewProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  productsCount: number;
  markets: Market[];
  onViewMarket: (market: Market) => void;
}

export default function HomeView({ searchTerm, setSearchTerm, productsCount, markets, onViewMarket }: HomeViewProps) {
  const [internalSearch, setInternalSearch] = useState(searchTerm);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchTerm(internalSearch);
  };

  const highlights = [
    // ... (keeping the existing highlights for visual richness)
    { 
      name: 'Arroz Integral 5kg', 
      price: 'R$ 18,90', 
      market: 'Mercado Extra', 
      change: '-5.2%', 
      trend: 'down',
      emoji: '🍚'
    },
    { 
      name: 'Azeite Extra Virgem 500ml', 
      price: 'R$ 24,50', 
      market: 'Atacadão', 
      change: '+2.1%', 
      trend: 'up',
      emoji: '🫒'
    },
    { 
      name: 'Café Torrado 500g', 
      price: 'R$ 15,99', 
      market: 'Carrefour', 
      change: '-8.7%', 
      trend: 'down',
      emoji: '☕'
    },
  ];

  const stats = [
    { label: 'Total de produtos', value: productsCount.toLocaleString('pt-BR'), icon: Package, color: 'text-blue-600 bg-blue-50' },
    { label: 'Mercados cadastrados', value: markets.length.toString(), icon: Store, color: 'text-indigo-600 bg-indigo-50' },
  ];

  return (
    <div className="space-y-16 py-8">
      {/* Search Hero Section */}
      <section className="text-center space-y-8 max-w-2xl mx-auto">
        <div className="space-y-2">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
            Encontre o melhor preço
          </h2>
          <p className="text-slate-500 font-medium">
            Compare preços de milhares de produtos em diversos mercados
          </p>
        </div>

        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3 px-4 sm:px-0">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input
              type="text"
              placeholder="leite condensado"
              className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-100 outline-none transition-all shadow-sm text-lg"
              value={internalSearch}
              onChange={(e) => setInternalSearch(e.target.value)}
            />
          </div>
          <button 
            type="submit"
            className="w-full sm:w-auto px-8 py-4 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 active:scale-95 text-center"
          >
            Buscar
          </button>
        </form>
      </section>
 
      {/* Markets Section */}
      {markets.length > 0 && (
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-black text-slate-900 tracking-tight">Atacadistas Registrados</h3>
            <span className="px-4 py-1.5 bg-indigo-50 text-indigo-600 rounded-full text-xs font-bold">
              {markets.length} Parceiros
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {markets.slice(0, 4).map((market) => (
              <div 
                key={market.id} 
                onClick={() => onViewMarket(market)}
                className={`bg-white p-5 sm:p-6 rounded-[1.75rem] sm:rounded-[2rem] border shadow-sm hover:shadow-md transition-all group cursor-pointer relative overflow-hidden ${
                  market.deliveryAvailable ? 'border-emerald-100' : 'border-slate-100'
                }`}
              >
                {market.deliveryAvailable && (
                  <div className="absolute top-0 right-0 bg-emerald-500 text-white px-3 py-1 rounded-bl-2xl text-[8px] font-black uppercase tracking-widest flex items-center gap-1.5 shadow-sm">
                    <Truck size={10} />
                    <span>DELIVERY</span>
                  </div>
                )}
                <div className="flex justify-between items-start mb-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform ${
                    market.deliveryAvailable ? 'bg-emerald-50 text-emerald-600' : 'bg-indigo-50 text-indigo-600'
                  }`}>
                    <Store size={24} />
                  </div>
                </div>
                <h4 className="font-bold text-slate-900 mb-1">{market.name}</h4>
                <div className="space-y-1">
                  <div className="flex items-start gap-1.5 text-slate-600 text-[11px] font-bold">
                    <MapPin size={12} className="text-indigo-400 mt-0.5 shrink-0" />
                    <span>{market.region}</span>
                  </div>
                  <p className="text-[10px] text-slate-400 pl-4 truncate">{market.location}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
 
      {/* Highlights Section */}
      <section className="space-y-6">
        <h3 className="text-xl font-black text-slate-900 tracking-tight">Destaques</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {highlights.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white rounded-[2rem] sm:rounded-[2.5rem] p-6 sm:p-8 border border-slate-100 shadow-sm hover:shadow-xl transition-all group cursor-pointer"
            >
              <motion.div 
                animate={{ 
                  y: [0, -8, 0],
                  rotate: [0, -10, 10, 0]
                }}
                transition={{ 
                  duration: 4, 
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: i * 0.2
                }}
                className="text-4xl sm:text-5xl mb-4 sm:mb-6 select-none"
              >
                {item.emoji}
              </motion.div>
              <div className="space-y-1 mb-4">
                <h4 className="font-bold text-slate-900 tracking-tight">{item.name}</h4>
                <p className="text-2xl sm:text-3xl font-black text-blue-600 tracking-tight">{item.price}</p>
                <p className="text-xs font-medium text-slate-400">{item.market}</p>
              </div>
              <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] font-bold ${
                item.trend === 'down' ? 'text-emerald-600 bg-emerald-50' : 'text-rose-600 bg-rose-50'
              }`}>
                {item.trend === 'down' ? <TrendingDown size={14} /> : <TrendingUp size={14} />}
                {item.change}
              </div>
            </motion.div>
          ))}
        </div>
      </section>
 
      {/* Stats Section */}
      <section className="space-y-6">
        <h3 className="text-xl font-black text-slate-900 tracking-tight">Informações</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          {stats.map((stat, i) => (
            <div key={i} className="bg-white rounded-[2rem] sm:rounded-[2.5rem] p-6 sm:p-8 border border-slate-100 shadow-sm flex items-center gap-4 sm:gap-6">
              <div className={`w-12 h-12 sm:w-16 sm:h-16 rounded-2xl sm:rounded-3xl flex items-center justify-center shrink-0 ${stat.color}`}>
                <stat.icon className="w-6 h-6 sm:w-8 sm:h-8" />
              </div>
              <div className="space-y-0.5 sm:space-y-1">
                <p className="text-[10px] sm:text-sm font-bold text-slate-400 uppercase tracking-widest">{stat.label}</p>
                <p className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">{stat.value}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
