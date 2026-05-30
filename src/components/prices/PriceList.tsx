import { PriceRecord, Product, Market } from '../../types';
import { Trash2, DollarSign, Calendar, Store, Package, TrendingUp, Tag, Edit2 } from 'lucide-react';
import { motion } from 'motion/react';

interface PriceListProps {
  prices: PriceRecord[];
  products: Product[];
  markets: Market[];
  onDelete: (id: string) => void;
  onEdit: (record: PriceRecord) => void;
}

export default function PriceList({ prices, products, markets, onDelete, onEdit }: PriceListProps) {
  if (prices.length === 0) {
    return (
      <div className="bg-white border-2 border-dashed border-slate-200 rounded-[2.5rem] p-16 flex flex-col items-center justify-center text-center">
        <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center mb-6 text-slate-300">
          <DollarSign size={40} />
        </div>
        <h3 className="text-xl font-black text-slate-800 tracking-tight">Nenhuma cotação registrada</h3>
        <p className="text-slate-500 max-w-sm mt-2 font-bold">
          Comece cadastrando os primeiros preços para acompanhar a variação e economizar.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Mobile Card Layout */}
      <div className="sm:hidden space-y-4">
        {prices.map((record) => {
          const product = products.find(p => p.id === record.productId);
          const market = markets.find(m => m.id === record.marketId);

          if (!product || !market) return null;

          return (
            <motion.div
              key={`mobile-${record.id}`}
              layout
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-md transition-all active:scale-[0.99] flex flex-col gap-4 relative overflow-hidden"
            >
              {/* Product Info Accent */}
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600 shrink-0">
                    <Package size={18} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="text-sm font-black text-slate-900 leading-tight truncate">{product.name}</h4>
                    <p className="text-[9px] font-black text-indigo-400 uppercase tracking-widest truncate">{product.brand}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => onEdit(record)}
                    className="p-2.5 text-slate-400 hover:text-indigo-600 active:bg-indigo-50 rounded-xl transition-all"
                    title="Editar"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button
                    onClick={() => onDelete(record.id)}
                    className="p-2.5 text-slate-400 hover:text-rose-500 active:bg-rose-50 rounded-xl transition-all"
                    title="Remover"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              {/* Market info */}
              <div className="flex items-start gap-2.5 text-slate-500 bg-slate-50/50 p-3 rounded-xl border border-slate-100/50">
                <Store size={14} className="text-slate-400 mt-0.5 shrink-0" />
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-bold text-slate-700 leading-tight truncate">{market.name}</p>
                  <p className="text-[10px] font-medium text-slate-400 truncate">{market.region}</p>
                </div>
              </div>

              {/* Bottom details & value */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-200">
                <div className="flex flex-col">
                  {record.isPromotion && (
                    <div className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-rose-50 text-rose-500 rounded-md border border-rose-100 self-start mb-1 select-none">
                      <Tag size={8} />
                      <span className="text-[8px] font-black uppercase tracking-tight">Promoção</span>
                    </div>
                  )}
                  <div className="flex items-center gap-1">
                    <Calendar size={12} className="text-slate-300" />
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                      {new Date(record.date).toLocaleDateString('pt-BR')}
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[8px] font-black text-slate-300 uppercase tracking-widest block mb-0.5">Preço Unitário</span>
                  <motion.span 
                    key={record.price}
                    initial={{ scale: 1.1 }}
                    animate={{ scale: 1 }}
                    className={`text-lg font-black tracking-tight ${record.isPromotion ? "text-rose-600" : "text-slate-900"}`}
                  >
                    R$ {record.price.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </motion.span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Desktop / Tablet Grid/Row Layout */}
      <div className="hidden sm:block overflow-x-auto pb-4">
        <div className="min-w-[720px] space-y-4">
          {prices.map((record) => {
            const product = products.find(p => p.id === record.productId);
            const market = markets.find(m => m.id === record.marketId);

            if (!product || !market) return null;

            return (
              <motion.div
                key={record.id}
                layout
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-xl hover:border-indigo-100 transition-all group flex items-center justify-between gap-6"
              >
                <div className="flex items-center gap-6 flex-1">
                  {/* Product Info */}
                  <div className="flex items-center gap-4 min-w-[240px]">
                    <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 shrink-0">
                      <Package size={24} />
                    </div>
                    <div>
                      <h4 className="text-sm font-black text-slate-900 leading-tight">{product.name}</h4>
                      <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">{product.brand}</p>
                    </div>
                  </div>

                  {/* Market Info */}
                  <div className="flex items-center gap-3 text-slate-500 min-w-[200px]">
                    <Store size={18} className="text-slate-300" />
                    <div>
                      <p className="text-xs font-bold text-slate-700">{market.name}</p>
                      <p className="text-[10px] font-medium text-slate-400">{market.region}</p>
                    </div>
                  </div>

                  {/* Price Info */}
                  <div className="flex flex-col items-end min-w-[120px]">
                    <div className="flex items-center gap-2">
                      {record.isPromotion && (
                        <TrendingUp size={16} className="text-rose-500 animate-pulse" />
                      )}
                      <motion.span 
                        key={record.price}
                        initial={{ scale: 1.2, color: record.isPromotion ? "#f43f5e" : "#4f46e5" }}
                        animate={{ scale: 1, color: record.isPromotion ? "#e11d48" : "#0f172a" }}
                        className="text-xl font-black tracking-tight"
                      >
                        R$ {record.price.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </motion.span>
                    </div>
                    {record.isPromotion && (
                      <div className="flex items-center gap-1.5 px-2 py-0.5 bg-rose-50 text-rose-500 rounded-md mt-1 border border-rose-100">
                        <Tag size={10} />
                        <span className="text-[9px] font-black uppercase tracking-tight">Promoção</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Date & Actions */}
                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <div className="flex items-center gap-2 text-slate-400">
                      <Calendar size={14} />
                      <span className="text-[10px] font-black uppercase tracking-widest">
                        {new Date(record.date).toLocaleDateString('pt-BR')}
                      </span>
                    </div>
                    <p className="text-[9px] font-bold text-slate-300 mt-1 uppercase tracking-widest">Registrado às {new Date(record.date).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onEdit(record)}
                      className="p-3 text-slate-300 hover:text-indigo-600 hover:bg-indigo-50 rounded-2xl transition-all"
                      title="Editar Cotação"
                    >
                      <Edit2 size={20} />
                    </button>
                    <button
                      onClick={() => onDelete(record.id)}
                      className="p-3 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-2xl transition-all"
                      title="Remover Cotação"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
