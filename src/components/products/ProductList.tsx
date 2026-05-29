import { Product, Market, PriceRecord } from '../../types';
import { Package, Trash2, Edit2, Calendar, TrendingDown, Store, ChevronRight } from 'lucide-react';
import { motion } from 'motion/react';

interface ProductListProps {
  products: Product[];
  markets: Market[];
  priceRecords: PriceRecord[];
  onDelete: (id: string) => void;
  onEdit: (product: Product) => void;
  onView: (product: Product) => void;
}

export default function ProductList({ products, markets, priceRecords, onDelete, onEdit, onView }: ProductListProps) {
  if (products.length === 0) {
    return (
      <div className="bg-white border border-dashed border-slate-300 rounded-3xl p-12 flex flex-col items-center justify-center text-center">
        <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4 text-slate-300">
          <Package size={32} />
        </div>
        <h3 className="text-lg font-semibold text-slate-800">Nenhum produto cadastrado</h3>
        <p className="text-slate-500 max-w-sm mt-1">
          Comece adicionando seus primeiros produtos para poder realizar cotações e acompanhar preços.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 gap-4 sm:gap-6">
      {products.map((product) => (
        <motion.div
          key={product.id}
          layout
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          onClick={() => onView(product)}
          className="bg-white rounded-[1.75rem] sm:rounded-[2rem] border border-slate-100 p-5 sm:p-8 shadow-sm hover:shadow-xl transition-all group relative cursor-pointer"
        >
          <div className="flex justify-between items-start mb-6">
            <div className="w-20 h-20 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 group-hover:scale-105 transition-transform overflow-hidden relative border border-slate-50">
              {product.imageUrl ? (
                <img 
                  src={product.imageUrl} 
                  alt={product.name} 
                  className="w-full h-full object-contain p-2 relative z-10"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    const fallback = e.currentTarget.nextElementSibling;
                    if (fallback) fallback.classList.remove('hidden');
                  }}
                />
              ) : null}
              
              <motion.div 
                animate={{ 
                  y: [0, -4, 0],
                  rotate: [0, -5, 5, 0]
                }}
                transition={{ 
                  duration: 3, 
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className={`text-4xl select-none ${product.imageUrl ? 'hidden absolute inset-0 flex items-center justify-center' : ''}`}
              >
                {product.category === 'Grãos' ? '🍚' : 
                 product.category === 'Azeites' ? '🫒' : 
                 product.category === 'Bebidas' ? '☕' : 
                 product.category === 'Laticínios' ? '🥛' : 
                 product.category === 'Higiene' ? '🧼' : 
                 product.category === 'Limpeza' ? '✨' : '📦'}
              </motion.div>
            </div>
            <div className="flex gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(product);
                }}
                className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
              >
                <Edit2 size={18} />
              </button>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(product.id);
                }}
                className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all"
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>
          
          <div className="space-y-1 mb-6">
            <h3 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight leading-tight">
              {product.name}
            </h3>
            <p className="text-sm font-bold text-blue-600 uppercase tracking-wide">
              {product.brand}
            </p>
          </div>

          <div className="flex flex-wrap gap-2 mb-6">
            <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-lg text-[10px] font-black uppercase tracking-widest">
              {product.category}
            </span>
            <span className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-lg text-[10px] font-black uppercase tracking-widest">
              Unidade: {product.unit}
            </span>
          </div>
          
          {product.description && (
            <p className="text-sm text-slate-500 line-clamp-2 mb-6 font-medium">
              {product.description}
            </p>
          )}

          {/* Price Insights Section */}
          <div className="mb-6 pt-6 border-t border-slate-50">
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
              <TrendingDown size={14} className="text-emerald-500" />
              Melhor Cotação
            </h4>
            
            {(() => {
              const productPrices = priceRecords.filter(p => p.productId === product.id);
              if (productPrices.length === 0) {
                return (
                  <div className="flex items-center gap-2 text-slate-300">
                    <div className="w-8 h-8 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center">
                      <TrendingDown size={14} />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-widest">Sem preços registrados</span>
                  </div>
                );
              }

              const bestPriceRecord = [...productPrices].sort((a, b) => a.price - b.price)[0];
              const bestMarket = markets.find(m => m.id === bestPriceRecord.marketId);

              return (
                <div className="p-4 bg-emerald-50/50 rounded-2xl border border-emerald-100 group/price hover:bg-emerald-50 transition-all">
                  <div className="flex items-center justify-between mb-2">
                    <motion.span 
                      key={bestPriceRecord.price}
                      initial={{ scale: 1.1, color: "#10b981" }}
                      animate={{ scale: 1, color: "#059669" }}
                      className="text-xs font-black uppercase tracking-tight"
                    >
                      R$ {bestPriceRecord.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </motion.span>
                    <div className="flex flex-col items-end gap-1">
                      {bestPriceRecord.isPromotion && (
                        <span className="px-1.5 py-0.5 bg-emerald-500 text-white rounded text-[8px] font-black uppercase shadow-sm">Promo</span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 overflow-hidden">
                      <Store size={12} className="text-emerald-400" />
                      <span className="text-[10px] font-bold text-slate-600 truncate">{bestMarket?.name || 'Mercado desconhecido'}</span>
                    </div>
                    <div className="flex flex-col text-right">
                      <span className="text-[7px] font-black text-slate-400 uppercase tracking-tighter">Atualizado em</span>
                      <span className="text-[8px] font-bold text-emerald-500 uppercase tracking-tighter">
                        {new Date(bestPriceRecord.date).toLocaleDateString('pt-BR')} às {new Date(bestPriceRecord.date).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>
          
          <div className="pt-6 border-t border-slate-50 flex items-center justify-between">
            <div className="flex items-center text-slate-400 text-[10px] font-bold uppercase tracking-widest">
              <Calendar size={12} className="mr-2" />
              {new Date(product.createdAt).toLocaleDateString('pt-BR')}
            </div>
            {priceRecords.filter(p => p.productId === product.id).length > 0 && (
              <div className="flex items-center gap-1 text-indigo-500 text-[10px] font-black uppercase tracking-widest group/more cursor-pointer hover:gap-2 transition-all">
                <span>Detalhes</span>
                <ChevronRight size={14} />
              </div>
            )}
          </div>
        </motion.div>
      ))}
    </div>
  );
}
