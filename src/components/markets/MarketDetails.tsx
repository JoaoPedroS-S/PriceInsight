import React from 'react';
import { Store, MapPin, X, Truck, ExternalLink, Calendar, ShieldCheck, Package, DollarSign, Tag } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Market, Product, PriceRecord } from '../../types';

interface MarketDetailsProps {
  market: Market | null;
  products: Product[];
  priceRecords: PriceRecord[];
  onClose: () => void;
}

export default function MarketDetails({ market, products, priceRecords, onClose }: MarketDetailsProps) {
  const marketPrices = priceRecords
    .filter(p => p.marketId === market?.id)
    .sort((a, b) => b.date - a.date);
  return (
    <AnimatePresence>
      {market && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 40 }}
            className="bg-white rounded-[2rem] sm:rounded-[3rem] shadow-2xl w-full max-w-2xl overflow-hidden relative z-50 border border-white/20"
          >
            {/* Header / Banner */}
            <div className="h-32 bg-indigo-600 relative overflow-hidden">
               <div className="absolute inset-0 opacity-20">
                  <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white to-transparent" />
               </div>
               <button 
                  onClick={onClose}
                  className="absolute top-6 right-6 p-2 bg-white/20 hover:bg-white/40 text-white rounded-full transition-all backdrop-blur-md z-10"
                >
                  <X size={20} />
                </button>
            </div>

            {/* Content */}
            <div className="relative px-5 sm:px-10 pb-10">
              <div className="absolute -top-14 left-5 sm:left-10 w-28 h-28 bg-white rounded-[2rem] shadow-xl border-[6px] border-white flex items-center justify-center text-indigo-600 transition-transform hover:scale-105">
                <div className="w-full h-full rounded-[1.5rem] bg-indigo-50 flex items-center justify-center">
                  <Store size={44} strokeWidth={2.5} />
                </div>
              </div>

              <div className="pt-20 space-y-10">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                  <div>
                    <div className="flex flex-wrap items-center gap-3 mb-3">
                      <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight leading-none">
                        {market.name}
                      </h2>
                      {market.deliveryAvailable && (
                        <span className="px-3 py-1 bg-emerald-500 text-white rounded-full text-[9px] font-black uppercase tracking-widest shadow-sm shadow-emerald-100">
                          DELIVERY
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2.5 text-indigo-500 font-black text-xs uppercase tracking-widest">
                      <MapPin size={16} />
                      <span>Região: {market.region}</span>
                    </div>
                  </div>
                  
                  <div className="px-5 py-2.5 bg-slate-50 border border-slate-100 rounded-2xl flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)] animate-pulse" />
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.1em]">Status: Ativo</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 md:gap-8 text-left">
                  {/* Address Card */}
                  <div className="flex flex-col">
                    <div className="p-5 sm:p-8 bg-white rounded-[1.75rem] sm:rounded-[2.5rem] border-2 border-slate-50 shadow-sm flex flex-col justify-between h-full group hover:border-indigo-100 hover:shadow-xl hover:shadow-indigo-500/5 transition-all">
                      <div>
                        <div className="flex items-center gap-3 mb-6">
                          <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                            <MapPin size={18} />
                          </div>
                          <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">Localização</h4>
                        </div>
                        <div className="space-y-2">
                          <p className="text-slate-900 font-black text-xl leading-tight">
                            {market.location}
                          </p>
                          <p className="text-slate-500 font-bold text-sm">
                            {market.region}
                          </p>
                        </div>
                      </div>
                      
                      <a 
                        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(market.location + ', ' + market.region)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-6 sm:mt-8 w-full flex items-center justify-center gap-3 bg-slate-900 text-white py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-lg shadow-slate-200 hover:bg-indigo-600 hover:shadow-indigo-200 transition-all group/btn"
                      >
                        <MapPin size={14} className="group-hover/btn:scale-125 transition-transform" />
                        <span>Abrir Rota no Maps</span>
                        <ExternalLink size={14} className="opacity-40 group-hover/btn:opacity-100 group-hover/btn:translate-x-1 transition-all" />
                      </a>
                    </div>
                  </div>

                  {/* Operational Info */}
                  <div className="space-y-4 sm:space-y-6">
                    <div className={`p-5 sm:p-8 rounded-[1.75rem] sm:rounded-[2.5rem] border-2 transition-all group ${
                      market.deliveryAvailable 
                        ? 'bg-emerald-50/30 border-emerald-50 hover:border-emerald-200 hover:bg-emerald-50' 
                        : 'bg-slate-50 border-slate-50 hover:border-slate-200 hover:bg-slate-100'
                    }`}>
                      <div className="flex items-start gap-4 sm:gap-5">
                        <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center shrink-0 transition-all group-hover:scale-110 ${
                          market.deliveryAvailable 
                            ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-200' 
                            : 'bg-slate-200 text-slate-500'
                        }`}>
                          <Truck size={24} className="sm:size-7" strokeWidth={2.5} />
                        </div>
                        <div>
                          <h4 className={`text-[11px] font-black uppercase tracking-[0.2em] mb-1 sm:mb-2 ${
                            market.deliveryAvailable ? 'text-emerald-500' : 'text-slate-400'
                          }`}>Logística de Entrega</h4>
                          <p className={`font-black text-base sm:text-lg ${
                            market.deliveryAvailable ? 'text-emerald-700' : 'text-slate-800'
                          }`}>
                            {market.deliveryAvailable ? 'Entrega Disponível' : 'Retirada Apenas'}
                          </p>
                          <p className="text-slate-400 text-[11px] font-bold mt-1">
                            {market.deliveryAvailable 
                              ? 'Este fornecedor realiza entregas na região.' 
                              : 'Necessário agendar retirada no local.'}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="p-5 sm:p-8 bg-indigo-50/20 rounded-[1.75rem] sm:rounded-[2.5rem] border-2 border-transparent hover:border-indigo-100 transition-all group">
                      <div className="flex items-start gap-4 sm:gap-5">
                        <div className="w-12 h-12 sm:w-14 sm:h-14 bg-white rounded-2xl flex items-center justify-center text-indigo-500 border border-indigo-50 shadow-sm shrink-0 group-hover:scale-110 transition-transform">
                          <ShieldCheck size={24} className="sm:size-7" strokeWidth={2.5} />
                        </div>
                        <div>
                          <h4 className="text-[11px] font-black text-indigo-400 uppercase tracking-[0.2em] mb-1 sm:mb-2">Segurança</h4>
                          <p className="text-slate-900 font-black text-base sm:text-lg leading-tight">Parceiro Verificado</p>
                          <p className="text-indigo-400 text-[11px] font-black mt-1">PRICEINSIGHT CERTIFIED</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer Section */}
                <div className="pt-8 border-t-2 border-slate-50 mb-10">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                      <DollarSign size={18} />
                    </div>
                    <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">Cotações neste Mercado</h4>
                  </div>

                  {marketPrices.length > 0 ? (
                    <div className="space-y-3">
                      {marketPrices.map(record => {
                        const product = products.find(p => p.id === record.productId);
                        if (!product) return null;
                        return (
                          <div key={record.id} className="flex items-center justify-between p-5 bg-slate-50/50 rounded-2xl border border-transparent hover:border-indigo-100 hover:bg-white transition-all group">
                            <div className="flex items-center gap-4">
                              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-indigo-500 border border-slate-100 group-hover:scale-110 transition-transform">
                                <Package size={20} />
                              </div>
                              <div>
                                <p className="text-sm font-black text-slate-800 leading-tight">{product.name}</p>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{product.brand}</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="flex items-center gap-2 justify-end">
                                {record.isPromotion && (
                                  <Tag size={12} className="text-rose-500" />
                                )}
                                <span className={`text-base font-black ${record.isPromotion ? 'text-rose-600' : 'text-slate-900'}`}>
                                  R$ {record.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                </span>
                              </div>
                              <p className="text-[9px] font-bold text-slate-300 uppercase tracking-widest">
                                {new Date(record.date).toLocaleDateString('pt-BR')}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="py-10 text-center bg-slate-50/50 rounded-[2rem] border-2 border-dashed border-slate-100">
                      <p className="text-sm font-bold text-slate-400">Nenhuma cotação registrada para este mercado.</p>
                    </div>
                  )}
                </div>

                <div className="pt-8 border-t-2 border-slate-50 flex flex-col sm:flex-row gap-6 items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-300">
                      <Calendar size={18} />
                    </div>
                    <div>
                      <h5 className="text-[9px] font-black text-slate-300 uppercase tracking-widest leading-none mb-1">CÓDIGO INTERNO</h5>
                      <p className="text-xs font-black text-slate-500 tracking-widest">{market.id.toUpperCase()}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-slate-300">
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] whitespace-nowrap">PriceInsight © 2024</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
