import { Store, MapPin, Trash2, Edit2, Truck, AlertCircle, DollarSign } from 'lucide-react';
import { motion } from 'motion/react';
import { Market, PriceRecord } from '../../types';

interface MarketListProps {
  markets: Market[];
  priceRecords: PriceRecord[];
  onDelete: (id: string) => void;
  onEdit: (market: Market) => void;
  onView: (market: Market) => void;
  isLoading?: boolean;
  error?: string | null;
  onRetry?: () => void;
}

export default function MarketList({ markets, priceRecords, onDelete, onEdit, onView, isLoading, error, onRetry }: MarketListProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 gap-4 sm:gap-6 pb-12">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white rounded-[1.75rem] sm:rounded-[2rem] border border-slate-100 p-5 sm:p-8 shadow-sm h-[320px] animate-pulse">
            <div className="flex justify-between items-start mb-6">
              <div className="w-14 h-14 bg-slate-100 rounded-2xl animate-none" />
              <div className="w-20 h-8 bg-slate-50 rounded-xl animate-none" />
            </div>
            <div className="space-y-3 mb-6">
              <div className="h-6 bg-slate-100 rounded-lg w-3/4 animate-none" />
              <div className="h-4 bg-slate-50 rounded-lg w-1/2 animate-none" />
            </div>
            <div className="flex gap-2 mb-6">
              <div className="h-6 bg-slate-50 rounded-lg w-20 animate-none" />
              <div className="h-6 bg-slate-50 rounded-lg w-24 animate-none" />
            </div>
            <div className="pt-6 border-t border-slate-50 flex justify-between">
              <div className="h-3 bg-slate-50 rounded-lg w-20 animate-none" />
              <div className="h-3 bg-slate-50 rounded-lg w-3 animate-none" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-rose-50 border border-rose-100 rounded-[2.5rem] p-16 flex flex-col items-center justify-center text-center">
        <div className="w-20 h-20 bg-rose-100 text-rose-500 rounded-3xl flex items-center justify-center mb-6">
          <AlertCircle size={40} />
        </div>
        <h3 className="text-xl sm:text-2xl font-black text-rose-900 mb-2">Ops! Algo deu errado</h3>
        <p className="text-rose-600/80 max-w-sm font-medium mb-6">
          {error}
        </p>
        <button 
          onClick={onRetry || (() => window.location.reload())}
          className="px-6 py-2 bg-rose-600 text-white rounded-xl font-bold hover:bg-rose-700 transition-colors shadow-sm"
        >
          Tentar novamente
        </button>
      </div>
    );
  }

  if (markets.length === 0) {
    return (
      <div className="bg-white border border-dashed border-slate-300 rounded-[2.5rem] p-16 flex flex-col items-center justify-center text-center">
        <div className="w-20 h-20 bg-indigo-50 text-indigo-500 rounded-3xl flex items-center justify-center mb-6">
          <Store size={40} />
        </div>
        <h3 className="text-xl sm:text-2xl font-black text-slate-900 mb-2">Nenhum mercado encontrado</h3>
        <p className="text-slate-500 max-w-sm font-medium">
          Tente ajustar sua busca ou cadastre um novo mercado atacadista no botão acima.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 gap-4 sm:gap-6 pb-12">
      {markets.map((market) => (
        <motion.div
          key={market.id}
          layout
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          onClick={() => onView(market)}
          className={`bg-white rounded-[1.75rem] sm:rounded-[2rem] border p-5 sm:p-8 shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all group relative overflow-hidden cursor-pointer ${
            market.deliveryAvailable 
              ? 'border-emerald-100 ring-4 ring-emerald-50/20' 
              : 'border-slate-100'
          }`}
        >
          {market.deliveryAvailable && (
            <div className="absolute top-0 right-0 bg-[#00B894] text-white px-5 py-2 rounded-bl-[2rem] text-[10px] font-black uppercase tracking-widest flex items-center gap-2 shadow-sm z-10">
              <Truck size={14} />
              <span>DELIVERY ATIVO</span>
            </div>
          )}

          <div className="flex justify-between items-start mb-8">
            <div className={`w-16 h-16 rounded-[1.25rem] shadow-inner flex items-center justify-center transition-all group-hover:scale-110 ${
              market.deliveryAvailable ? 'bg-emerald-50 text-emerald-500' : 'bg-indigo-50 text-indigo-600'
            }`}>
              <Store size={32} />
            </div>
            <div className="flex gap-1.5 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-all">
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(market);
                }}
                className="p-2 text-slate-300 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all"
                title="Editar"
              >
                <Edit2 size={18} />
              </button>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(market.id);
                }}
                className="p-2 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all"
                title="Excluir"
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>
          
          <div className="space-y-6 mb-8">
            <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight leading-tight">
              {market.name}
            </h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3 text-slate-600">
                <MapPin size={18} className="mt-0.5 shrink-0 text-indigo-500" />
                <div>
                  <p className="text-sm font-black leading-tight text-slate-800">{market.region}</p>
                  <p className="text-[11px] font-bold text-slate-400 mt-1 leading-relaxed line-clamp-2">{market.location}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-3 mb-8">
            <div className="flex flex-wrap gap-2">
              <span className="px-4 py-1.5 bg-slate-100/80 text-slate-500 rounded-xl text-[9px] font-black uppercase tracking-widest border border-slate-200/50">
                MARKET ID: {market.id.toUpperCase()}
              </span>
              {(() => {
                const count = priceRecords.filter(p => p.marketId === market.id).length;
                if (count === 0) return null;
                return (
                  <span className="px-4 py-1.5 bg-indigo-50 text-indigo-600 rounded-xl text-[9px] font-black uppercase tracking-widest border border-indigo-100 flex items-center gap-1.5">
                    <DollarSign size={14} />
                    {count} {count === 1 ? 'COTAÇÃO' : 'COTAÇÕES'}
                  </span>
                );
              })()}
              {market.deliveryAvailable && (
                <span className="px-4 py-1.5 bg-[#E8F8F5] text-[#00B894] rounded-xl text-[9px] font-black uppercase tracking-widest flex items-center gap-1.5 border border-[#D1F2EB]">
                  <Truck size={14} />
                  DELIVERY DISPONÍVEL
                </span>
              )}
            </div>
          </div>
          
          <div className="pt-8 border-t border-slate-50 flex items-center justify-between">
            <span className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em]">
              ATIVO NO SISTEMA
            </span>
            <div className="w-2.5 h-2.5 rounded-full bg-[#00B894] shadow-[0_0_12px_rgba(0,184,148,0.5)] animate-pulse" />
          </div>
        </motion.div>
      ))}
    </div>
  );
}
