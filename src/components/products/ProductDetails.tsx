import React, { useState, useMemo, useEffect } from 'react';
import { Package, X, Store, DollarSign, Tag, TrendingDown, TrendingUp, Calendar, AlertCircle, History, ArrowRight, LineChart as ChartIcon, LayoutGrid, List, ArrowUpDown } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Product, Market, PriceRecord } from '../../types';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { api } from '../../services/api';

interface ProductDetailsProps {
  product: Product | null;
  markets: Market[];
  priceRecords: PriceRecord[];
  onClose: () => void;
  onAddPrice?: (productId: string) => void;
}

export default function ProductDetails({ product, markets, priceRecords, onClose, onAddPrice }: ProductDetailsProps) {
  const [activeView, setActiveView] = useState<'prices' | 'history'>('prices');
  const [apiPriceRecords, setApiPriceRecords] = useState<PriceRecord[]>([]);
  const [isLoadingPrices, setIsLoadingPrices] = useState(false);
  const [sortBy, setSortBy] = useState<'price_asc' | 'price_desc' | 'market_name' | 'date_desc'>('price_asc');
  const [layoutType, setLayoutType] = useState<'list' | 'grid'>('list');

  useEffect(() => {
    if (product?.id) {
      const hasRecordsForCurrentProduct = apiPriceRecords.length > 0 && apiPriceRecords[0].productId === product.id;
      if (!hasRecordsForCurrentProduct) {
        setIsLoadingPrices(true);
      }
      api.prices.byProduct(product.id)
        .then((data) => {
          setApiPriceRecords(data);
        })
        .catch((err) => {
          console.error("Erro ao carregar preços via API:", err);
        })
        .finally(() => {
          setIsLoadingPrices(false);
        });
    } else {
      setApiPriceRecords([]);
    }
  }, [product?.id, priceRecords]);

  const productPrices = useMemo(() => {
    if (apiPriceRecords.length > 0) {
      return [...apiPriceRecords].sort((a, b) => b.date - a.date);
    }
    return priceRecords
      .filter(p => p.productId === product?.id)
      .sort((a, b) => b.date - a.date);
  }, [apiPriceRecords, priceRecords, product?.id]);

  const orderedPrices = useMemo(() => {
    return [...productPrices].sort((a, b) => {
      if (sortBy === 'price_asc') {
        return a.price - b.price;
      }
      if (sortBy === 'price_desc') {
        return b.price - a.price;
      }
      if (sortBy === 'date_desc') {
        return b.date - a.date;
      }
      if (sortBy === 'market_name') {
        const nameA = markets.find(m => m.id === a.marketId)?.name || '';
        const nameB = markets.find(m => m.id === b.marketId)?.name || '';
        return nameA.localeCompare(nameB, 'pt-BR');
      }
      return 0;
    });
  }, [productPrices, sortBy, markets]);
  
  // Get lowest and highest price
  const sortedPrices = [...productPrices].sort((a, b) => a.price - b.price);
  const bestPrice = sortedPrices[0];
  const highestPrice = sortedPrices[sortedPrices.length - 1];

  const bestPriceMarket = useMemo(() => {
    if (!bestPrice) return null;
    return markets.find(m => m.id === bestPrice.marketId) || null;
  }, [bestPrice, markets]);

  const highestPriceMarket = useMemo(() => {
    if (!highestPrice) return null;
    return markets.find(m => m.id === highestPrice.marketId) || null;
  }, [highestPrice, markets]);

  // Consolidate all history entries from all price records of this product
  const allHistory = productPrices.flatMap(record => 
    (record.history || []).map(h => ({
      ...h,
      marketId: record.marketId,
      productId: record.productId,
      currentPromotion: record.isPromotion
    }))
  ).sort((a, b) => b.date - a.date);

  // Prepare Chart Data
  const chartData = useMemo(() => {
    // Collect all price points for all markets
    const points: { date: number; price: number; marketName: string }[] = [];
    
    productPrices.forEach(record => {
      const market = markets.find(m => m.id === record.marketId);
      const mName = market?.name || 'Mercado';
      
      // We don't have the "initial" date of creation recorded perfectly for old records, 
      // but we can infer points from history entries:
      // The history entry says "at this DATE, it changed from OLD to NEW".
      // This means BEFORE this date it was OLD, AFTER it was NEW.
      
      // If there are no history entries, it's just the current price at the record date
      if (!record.history || record.history.length === 0) {
        points.push({ date: record.date, price: record.price, marketName: mName });
      } else {
        // Sort history by date asc for this record to rebuild the timeline
        const sortedHistory = [...record.history].sort((a, b) => a.date - b.date);
        
        // The first recorded oldPrice was the price before the first history entry
        // We can approximate the "start" date as some time before the first update if we don't have it
        // Or just map the transitions
        points.push({ date: sortedHistory[0].date - 86400000, price: sortedHistory[0].oldPrice, marketName: mName });
        
        sortedHistory.forEach(h => {
          points.push({ date: h.date, price: h.newPrice, marketName: mName });
        });
      }
    });

    // Group by market for multiple lines or just sort all for a general trend?
    // Let's group by date and show the MIN price at that point for a general "Best Price Trend" line
    // Or just format for Recharts where keys are market names
    
    const dates = Array.from(new Set(points.map(p => p.date))).sort((a, b) => a - b);
    
    return dates.map(d => {
      const entry: any = { 
        timestamp: d,
        displayDate: new Date(d).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })
      };
      
      productPrices.forEach(record => {
        const market = markets.find(m => m.id === record.marketId);
        if (!market) return;
        
        // Find the price for this market at this timestamp
        // It's the price of the closest point <= timestamp
        const marketPoints = points.filter(p => p.marketName === market.name).sort((a, b) => b.date - a.date);
        const pointAtTime = marketPoints.find(p => p.date <= d);
        
        if (pointAtTime) {
          entry[market.name] = pointAtTime.price;
        }
      });
      
      return entry;
    });
  }, [productPrices, markets]);

  const COLORS = ['#4f46e5', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

  return (
    <AnimatePresence>
      {product && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 40 }}
            className="relative w-full max-w-4xl bg-white rounded-[2rem] sm:rounded-[3rem] shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
          >
            {/* Header / Banner */}
            <div className="relative h-48 bg-indigo-600 shrink-0">
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/50 to-purple-600/50" />
              <button 
                onClick={onClose}
                className="absolute top-6 right-6 p-3 bg-white/10 hover:bg-white/20 text-white rounded-2xl backdrop-blur-md transition-all z-10"
              >
                <X size={24} />
              </button>
              
              <div className="absolute -bottom-14 left-5 sm:left-10 w-24 h-24 sm:w-28 sm:h-28 bg-white rounded-[2rem] shadow-xl border-[6px] border-white flex items-center justify-center text-indigo-600">
                <div className="w-full h-full rounded-[1.5rem] bg-indigo-50 flex items-center justify-center">
                  <Package className="w-8 h-8 sm:w-11 sm:h-11" strokeWidth={2.5} />
                </div>
              </div>

              {/* Tabs Container */}
              <div className="absolute bottom-4 right-5 sm:right-10 flex bg-white/10 backdrop-blur-md p-1.5 rounded-2xl border border-white/20 max-sm:scale-90 origin-bottom-right">
                <button
                  onClick={() => setActiveView('prices')}
                  className={`px-4 sm:px-6 py-2 rounded-xl text-[10px] sm:text-xs font-black uppercase tracking-widest transition-all ${
                    activeView === 'prices' ? 'bg-white text-indigo-600 shadow-lg' : 'text-white hover:bg-white/10'
                  }`}
                >
                  Preços Atuais
                </button>
                <button
                  onClick={() => setActiveView('history')}
                  className={`px-4 sm:px-6 py-2 rounded-xl text-[10px] sm:text-xs font-black uppercase tracking-widest transition-all ${
                    activeView === 'history' ? 'bg-white text-indigo-600 shadow-lg' : 'text-white hover:bg-white/10'
                  }`}
                >
                  Histórico
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="relative px-5 sm:px-10 pb-10 flex-1 overflow-y-auto pt-20">
              <div className="space-y-10">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                  <div>
                    <div className="flex flex-wrap items-center gap-3 mb-2">
                      <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight leading-none uppercase">
                        {product.name}
                      </h2>
                    </div>
                    <div className="flex items-center gap-2.5 text-indigo-500 font-black text-xs uppercase tracking-[0.2em]">
                      <Tag size={16} />
                      <span>Marca: {product.brand}</span>
                      <span className="text-slate-200">|</span>
                      <span>Categoria: {product.category}</span>
                    </div>
                  </div>
                  
                  {onAddPrice && activeView === 'prices' && (
                    <button 
                      onClick={() => onAddPrice(product.id)}
                      className="px-6 py-3 bg-indigo-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-900 transition-all shadow-lg shadow-indigo-100"
                    >
                      Registrar Novo Preço
                    </button>
                  )}
                </div>

                {activeView === 'prices' ? (
                  <>
                    {/* Price Statistics */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="p-6 bg-emerald-50 rounded-[2rem] border border-emerald-100 flex items-center gap-4">
                        <div className="p-3 bg-emerald-500 text-white rounded-xl shadow-lg shadow-emerald-100">
                          <TrendingDown size={24} />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest leading-none mb-1">Menor Preço</p>
                          <p className="text-xl font-black text-emerald-700 leading-tight">
                            {isLoadingPrices ? (
                              <span className="inline-block h-6 w-24 bg-emerald-200/60 animate-pulse rounded-md mt-0.5" />
                            ) : bestPrice ? (
                              `R$ ${bestPrice.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`
                            ) : (
                              'N/A'
                            )}
                          </p>
                          {!isLoadingPrices && bestPriceMarket && (
                            <p className="text-[10px] font-bold text-emerald-600 truncate uppercase tracking-wider mt-1 flex items-center gap-1 leading-none">
                              <Store size={10} className="shrink-0" />
                              <span className="truncate">{bestPriceMarket.name}</span>
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="p-6 bg-rose-50 rounded-[2rem] border border-rose-100 flex items-center gap-4">
                        <div className="p-3 bg-rose-500 text-white rounded-xl shadow-lg shadow-rose-100">
                          <TrendingUp size={24} />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-[10px] font-black text-rose-400 uppercase tracking-widest leading-none mb-1">Maior Preço</p>
                          <p className="text-xl font-black text-rose-700 leading-tight">
                            {isLoadingPrices ? (
                              <span className="inline-block h-6 w-24 bg-rose-200/60 animate-pulse rounded-md mt-0.5" />
                            ) : highestPrice ? (
                              `R$ ${highestPrice.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`
                            ) : (
                              'N/A'
                            )}
                          </p>
                          {!isLoadingPrices && highestPriceMarket && (
                            <p className="text-[10px] font-bold text-rose-600 truncate uppercase tracking-wider mt-1 flex items-center gap-1 leading-none">
                              <Store size={10} className="shrink-0" />
                              <span className="truncate">{highestPriceMarket.name}</span>
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100 flex items-center gap-4">
                        <div className="p-3 bg-slate-200 text-slate-500 rounded-xl">
                          <DollarSign size={24} />
                        </div>
                        <div>
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Total de Cotações</p>
                          <p className="text-xl font-black text-slate-700">
                            {isLoadingPrices ? (
                              <span className="inline-block h-6 w-12 bg-slate-200/60 animate-pulse rounded-md mt-0.5" />
                            ) : (
                              productPrices.length
                            )}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Price List in Markets */}
                    <div>
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 border-b border-slate-100 pb-5">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                            <Store size={18} />
                          </div>
                          <div>
                            <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">Cotações por Mercado</h4>
                            <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">Mostrando {productPrices.length} preço(s)</p>
                          </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-2.5">
                          {isLoadingPrices && (
                            <div className="flex items-center gap-2 mr-2">
                              <span className="w-2 h-2 bg-indigo-600 rounded-full animate-ping" />
                              <span className="text-[9px] font-black text-indigo-600 uppercase tracking-widest animate-pulse">Sincronizando via API...</span>
                            </div>
                          )}

                          {/* Ordenação */}
                          <div className="flex items-center bg-slate-100 p-1.5 rounded-xl">
                            <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider px-2 flex items-center gap-1">
                              <ArrowUpDown size={10} /> Ordenar:
                            </span>
                            <select
                              value={sortBy}
                              onChange={(e) => setSortBy(e.target.value as any)}
                              className="bg-transparent border-none text-[10px] font-black text-slate-700 uppercase tracking-wider focus:ring-0 cursor-pointer pr-6 py-0.5 select-none focus:outline-none"
                            >
                              <option value="price_asc">Menor Preço</option>
                              <option value="price_desc">Maior Preço</option>
                              <option value="market_name">Nome do Mercado</option>
                              <option value="date_desc">Mais Recentes</option>
                            </select>
                          </div>

                          {/* Alternador de Layout */}
                          <div className="flex bg-slate-100 p-1 rounded-xl">
                            <button
                              onClick={() => setLayoutType('list')}
                              className={`p-1.5 rounded-lg flex items-center gap-1 transition-all ${
                                layoutType === 'list' 
                                  ? 'bg-white text-indigo-600 shadow-sm font-black' 
                                  : 'text-slate-400 hover:text-slate-600'
                              }`}
                              title="Visualização em Lista de Comparação"
                            >
                              <List size={14} />
                              <span className="text-[9px] font-black uppercase tracking-wider px-0.5">Lista</span>
                            </button>
                            <button
                              onClick={() => setLayoutType('grid')}
                              className={`p-1.5 rounded-lg flex items-center gap-1 transition-all ${
                                layoutType === 'grid' 
                                  ? 'bg-white text-indigo-600 shadow-sm font-black' 
                                  : 'text-slate-400 hover:text-slate-600'
                              }`}
                              title="Visualização em Grade de Cards"
                            >
                              <LayoutGrid size={14} />
                              <span className="text-[9px] font-black uppercase tracking-wider px-0.5">Grade</span>
                            </button>
                          </div>
                        </div>
                      </div>

                      {isLoadingPrices ? (
                        layoutType === 'grid' ? (
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {[1, 2].map((i) => (
                              <div key={i} className="p-6 rounded-[2rem] border-2 border-slate-50 bg-white/50 animate-pulse">
                                <div className="flex justify-between items-start mb-6">
                                  <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-slate-100" />
                                    <div className="space-y-2">
                                      <div className="h-4 w-28 bg-slate-200 rounded" />
                                      <div className="h-3 w-16 bg-slate-100 rounded" />
                                    </div>
                                  </div>
                                  <div className="h-4 w-12 bg-slate-100 rounded" />
                                </div>
                                <div className="flex items-end justify-between border-t border-slate-50/50 pt-4">
                                  <div className="space-y-1">
                                    <div className="h-2 w-16 bg-slate-100 rounded" />
                                    <div className="h-6 w-24 bg-slate-200 rounded" />
                                  </div>
                                  <div className="h-4 w-20 bg-slate-100 rounded" />
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="bg-white border border-slate-100 rounded-[2rem] overflow-hidden shadow-sm">
                            <div className="p-6 space-y-4 animate-pulse">
                              {[1, 2, 3].map((i) => (
                                <div key={i} className="flex justify-between items-center py-4 border-b border-slate-50 last:border-0">
                                  <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-slate-100" />
                                    <div className="space-y-1.5">
                                      <div className="h-4 w-32 bg-slate-100 rounded" />
                                      <div className="h-3 w-20 bg-slate-50 rounded" />
                                    </div>
                                  </div>
                                  <div className="h-4 w-16 bg-slate-100 rounded" />
                                  <div className="h-4 w-12 bg-slate-50 rounded" />
                                  <div className="h-4 w-24 bg-slate-100 rounded" />
                                </div>
                              ))}
                            </div>
                          </div>
                        )
                      ) : productPrices.length > 0 ? (
                        <>
                          {layoutType === 'grid' ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              {orderedPrices.map(record => {
                                const market = markets.find(m => m.id === record.marketId);
                                if (!market) return null;
                                const isBestValue = bestPrice && record.price === bestPrice.price;

                                return (
                                  <div 
                                    key={record.id} 
                                    className={`p-6 rounded-[2rem] border-2 transition-all group relative overflow-hidden ${
                                      isBestValue 
                                        ? 'bg-gradient-to-br from-emerald-50/30 via-emerald-50/10 to-white border-emerald-300 hover:border-emerald-400 shadow-sm shadow-emerald-50' 
                                        : 'bg-white border-slate-100 hover:border-indigo-100'
                                    }`}
                                  >
                                    {isBestValue && (
                                      <div className="absolute top-0 right-0 bg-emerald-500 text-white text-[8px] font-black uppercase tracking-wider px-3 py-1 rounded-bl-xl shadow-sm z-10 flex items-center gap-1">
                                        <span>★ MENOR PREÇO</span>
                                      </div>
                                    )}
                                    <div className="flex justify-between items-start mb-4">
                                      <div className="flex items-center gap-3">
                                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                                          isBestValue ? 'bg-emerald-500 text-white shadow-md shadow-emerald-100' : 'bg-slate-100 text-slate-400 group-hover:bg-indigo-600 group-hover:text-white'
                                        } transition-colors shadow-sm`}>
                                          <Store size={20} />
                                        </div>
                                        <div>
                                          <p className="text-sm font-black text-slate-800 leading-tight">{market.name}</p>
                                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{market.region}</p>
                                        </div>
                                      </div>
                                      <div className="flex gap-2">
                                        {record.isPromotion && (
                                          <span className="px-2 py-0.5 bg-rose-500 text-white rounded-md text-[8px] font-black uppercase tracking-tighter shadow-sm shadow-rose-100">PROMO</span>
                                        )}
                                        {(record.history?.length || 0) > 0 && (
                                          <button 
                                            onClick={() => setActiveView('history')}
                                            className="p-1 px-2 bg-indigo-50 text-indigo-600 rounded-md text-[8px] font-black uppercase tracking-tighter hover:bg-indigo-600 hover:text-white transition-colors"
                                          >
                                            VER HISTÓRICO
                                          </button>
                                        )}
                                      </div>
                                    </div>
                                    
                                    <div className="flex items-end justify-between border-t border-slate-50 pt-4">
                                      <div className="flex flex-col">
                                        <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest mb-1">Preço Atual</span>
                                        <div className="flex items-center gap-1.5">
                                          <motion.span 
                                            key={record.price}
                                            initial={{ scale: 1.1 }}
                                            animate={{ scale: 1 }}
                                            className={`text-xl font-black ${isBestValue ? 'text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-lg' : 'text-slate-900'}`}
                                          >
                                            R$ {record.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                          </motion.span>
                                        </div>
                                      </div>
                                      <div className="flex flex-col text-right">
                                        <div className="flex items-center gap-1.5 justify-end text-slate-300">
                                          <Calendar size={12} />
                                          <span className="text-[10px] font-bold">
                                            {new Date(record.date).toLocaleDateString('pt-BR')}
                                          </span>
                                        </div>
                                        <p className="text-[9px] font-bold text-slate-300 uppercase tracking-widest mt-0.5">às {new Date(record.date).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</p>
                                      </div>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          ) : (
                            // Visualização em Lista / Tabela Comparativa Organizada
                            <div className="bg-white border border-slate-100 rounded-[2rem] overflow-hidden shadow-sm">
                              <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                  <thead>
                                    <tr className="bg-slate-50 border-b border-slate-100">
                                      <th className="py-4 px-6 text-[10px] font-black text-slate-400 uppercase tracking-wider">Mercado</th>
                                      <th className="py-4 px-6 text-[10px] font-black text-slate-400 uppercase tracking-wider text-right">Preço</th>
                                      <th className="py-4 px-6 text-[10px] font-black text-slate-400 uppercase tracking-wider text-center">Status</th>
                                      <th className="py-4 px-6 text-[10px] font-black text-slate-400 uppercase tracking-wider text-right">Última Atualização</th>
                                      <th className="py-4 px-6 text-[10px] font-black text-slate-400 uppercase tracking-wider text-center">Ações</th>
                                    </tr>
                                  </thead>
                                  <tbody className="divide-y divide-slate-50">
                                    {orderedPrices.map(record => {
                                      const market = markets.find(m => m.id === record.marketId);
                                      if (!market) return null;
                                      const isBestValue = bestPrice && record.price === bestPrice.price;

                                      return (
                                        <tr 
                                          key={record.id}
                                          className={`hover:bg-indigo-50/10 transition-colors ${
                                            isBestValue ? 'bg-emerald-50/25' : ''
                                          }`}
                                        >
                                          {/* Mercado */}
                                          <td className="py-4 px-6">
                                            <div className="flex items-center gap-3">
                                              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                                                isBestValue ? 'bg-emerald-500 text-white shadow-sm shadow-emerald-100' : 'bg-slate-100 text-slate-400'
                                              } transition-colors shadow-sm`}>
                                                <Store size={14} />
                                              </div>
                                              <div>
                                                <p className="text-sm font-bold text-slate-800 leading-tight flex items-center gap-2">
                                                  {market.name}
                                                  {isBestValue && (
                                                    <span className="px-1.5 py-0.5 bg-emerald-500 text-white text-[7px] font-black uppercase rounded tracking-wider shadow-sm">Melhor Preço</span>
                                                  )}
                                                </p>
                                                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{market.region}</p>
                                              </div>
                                            </div>
                                          </td>
                                          {/* Preço */}
                                          <td className="py-4 px-6 text-right">
                                            <motion.span 
                                              key={record.price}
                                              initial={{ scale: 1.1 }}
                                              animate={{ scale: 1 }}
                                              className={`inline-block px-2.5 py-1 rounded-lg font-black ${isBestValue ? 'text-emerald-700 bg-emerald-50 border border-emerald-100' : 'text-slate-900'}`}
                                            >
                                              R$ {record.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                            </motion.span>
                                          </td>
                                          {/* Status */}
                                          <td className="py-4 px-6 text-center">
                                            {record.isPromotion ? (
                                              <span className="inline-block px-1.5 py-0.5 bg-rose-500 text-white rounded text-[8px] font-black uppercase tracking-wider shadow-sm">Promoção</span>
                                            ) : (
                                              <span className="inline-block px-1.5 py-0.5 bg-slate-100 text-slate-400 border border-slate-200 rounded text-[8px] font-bold uppercase tracking-wider">Padrão</span>
                                            )}
                                          </td>
                                          {/* Data e hora de atualização */}
                                          <td className="py-4 px-6 text-right">
                                            <div className="flex flex-col text-right">
                                              <span className="text-[10px] font-black text-slate-700">
                                                {new Date(record.date).toLocaleDateString('pt-BR')}
                                              </span>
                                              <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest leading-none mt-0.5">
                                                às {new Date(record.date).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                                              </span>
                                            </div>
                                          </td>
                                          {/* Ações */}
                                          <td className="py-4 px-6 text-center">
                                            {(record.history?.length || 0) > 0 ? (
                                              <button 
                                                onClick={() => setActiveView('history')}
                                                className="p-1 px-2.5 bg-indigo-50 text-indigo-600 rounded-lg text-[8px] font-black uppercase tracking-wider hover:bg-indigo-600 hover:text-white transition-all shadow-sm"
                                              >
                                                Histórico ({record.history?.length})
                                              </button>
                                            ) : (
                                              <span className="text-[8px] font-black text-slate-300 uppercase tracking-wider">Sem Histórico</span>
                                            )}
                                          </td>
                                        </tr>
                                      );
                                    })}
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          )}
                        </>
                      ) : (
                        <div className="py-16 text-center bg-slate-50/50 rounded-[3rem] border-2 border-dashed border-slate-100">
                          <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 text-slate-200">
                            <AlertCircle size={32} />
                          </div>
                          <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Nenhum preço cadastrado para este produto.</p>
                          <button 
                            onClick={() => onAddPrice?.(product.id)}
                            className="mt-6 px-6 py-3 bg-white border-2 border-indigo-50 text-indigo-600 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-indigo-50 transition-all"
                          >
                            Começar Cotação
                          </button>
                        </div>
                      )}
                    </div>
                  </>
                ) : (
                  /* History View */
                  <div className="space-y-12">
                    {/* Chart Section */}
                    {chartData.length > 1 && (
                      <div className="bg-white border border-slate-100 rounded-[2.5rem] p-8 shadow-sm">
                        <div className="flex items-center gap-3 mb-8">
                          <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                            <ChartIcon size={18} />
                          </div>
                          <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">Evolução de Preços</h4>
                        </div>
                        
                        <div className="h-[300px] w-full">
                          <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                              <XAxis 
                                dataKey="displayDate" 
                                axisLine={false} 
                                tickLine={false} 
                                tick={{ fontSize: 10, fontWeight: 700, fill: '#94a3b8' }} 
                                dy={10}
                              />
                              <YAxis 
                                axisLine={false} 
                                tickLine={false} 
                                tick={{ fontSize: 10, fontWeight: 700, fill: '#94a3b8' }} 
                                tickFormatter={(value) => `R$${value}`}
                              />
                              <Tooltip 
                                contentStyle={{ 
                                  borderRadius: '16px', 
                                  border: 'none', 
                                  boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                                  padding: '12px' 
                                }}
                                labelStyle={{ fontWeight: 900, textTransform: 'uppercase', fontSize: '10px', color: '#64748b', marginBottom: '8px' }}
                              />
                              <Legend 
                                wrapperStyle={{ paddingTop: '20px' }}
                                iconType="circle"
                                formatter={(value) => <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">{value}</span>}
                              />
                              {productPrices.map((record, idx) => {
                                const market = markets.find(m => m.id === record.marketId);
                                if (!market) return null;
                                return (
                                  <Line 
                                    key={market.id}
                                    type="monotone" 
                                    dataKey={market.name} 
                                    stroke={COLORS[idx % COLORS.length]} 
                                    strokeWidth={4}
                                    dot={{ r: 4, strokeWidth: 2, fill: '#fff' }}
                                    activeDot={{ r: 6, strokeWidth: 0 }}
                                    animationDuration={1500}
                                  />
                                );
                              })}
                            </LineChart>
                          </ResponsiveContainer>
                        </div>
                      </div>
                    )}

                    <div className="space-y-6">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-amber-50 text-amber-600 rounded-lg">
                          <History size={18} />
                        </div>
                        <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">Linha do Tempo</h4>
                      </div>

                      {allHistory.length > 0 ? (
                        <div className="relative pl-8 space-y-8 before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-1 before:bg-indigo-50 before:rounded-full">
                          {allHistory.map((history, idx) => {
                            const market = markets.find(m => m.id === history.marketId);
                            const isPriceDown = history.newPrice < history.oldPrice;
                            
                            return (
                              <motion.div 
                                key={history.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: idx * 0.05 }}
                                className="relative"
                              >
                                {/* Dot */}
                                <div className={`absolute -left-[27px] top-1.5 w-4 h-4 rounded-full border-4 border-white shadow-sm ring-2 ${isPriceDown ? 'ring-emerald-500 bg-white' : 'ring-indigo-500 bg-white'}`} />
                                
                                <div className="bg-white border border-slate-100 rounded-[2rem] p-6 shadow-sm hover:shadow-md transition-all">
                                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                    <div className="flex items-center gap-4">
                                      <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400">
                                        <Store size={22} />
                                      </div>
                                      <div>
                                        <p className="text-sm font-black text-slate-800">{market?.name || 'Mercado desconhecido'}</p>
                                        <div className="flex items-center gap-2 mt-0.5">
                                          <Calendar size={12} className="text-slate-300" />
                                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                            {new Date(history.date).toLocaleDateString('pt-BR')} às {new Date(history.date).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                                          </p>
                                        </div>
                                      </div>
                                    </div>

                                    <div className="flex items-center gap-6 bg-slate-50/50 p-4 rounded-2xl border border-slate-100">
                                      <div className="flex flex-col items-center">
                                        <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Anterior</span>
                                        <span className="text-sm font-bold text-slate-400 line-through">R$ {history.oldPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                                      </div>
                                      
                                      <ArrowRight size={16} className="text-slate-300" />

                                      <div className="flex flex-col items-center">
                                        <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Novo Preço</span>
                                        <div className="flex items-center gap-2">
                                          <span className={`text-lg font-black ${isPriceDown ? 'text-emerald-600' : 'text-indigo-600'}`}>
                                            R$ {history.newPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                          </span>
                                          {isPriceDown ? (
                                            <TrendingDown size={16} className="text-emerald-500" />
                                          ) : (
                                            <TrendingUp size={16} className="text-indigo-500" />
                                          )}
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </motion.div>
                            );
                          })}
                        </div>
                      ) : (
                        <div className="py-16 text-center bg-slate-50/50 rounded-[3rem] border-2 border-dashed border-slate-100">
                          <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 text-slate-200">
                            <History size={32} />
                          </div>
                          <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Ainda não há histórico de alterações para este produto.</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Info Footer */}
                <div className="pt-8 border-t-2 border-slate-50 flex flex-col sm:flex-row gap-6 items-center justify-between text-slate-300">
                  <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em]">
                    <span>CÓDIGO: {product.id.toUpperCase()}</span>
                    <span className="text-slate-100">|</span>
                    <span>UNIDADE: {product.unit}</span>
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-widest">PriceInsight Global Database</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
