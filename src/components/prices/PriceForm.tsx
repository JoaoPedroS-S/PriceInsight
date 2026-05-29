import { useState, FormEvent, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, DollarSign, Store, Package, Rocket, Edit2 } from 'lucide-react';
import { Product, Market, PriceRecord } from '../../types';

interface PriceFormProps {
  products: Product[];
  markets: Market[];
  onAddPrice: (price: Omit<PriceRecord, 'id' | 'date' | 'history'>) => void;
  onUpdatePrice: (id: string, price: Partial<PriceRecord>) => void;
  editRecord?: PriceRecord | null;
  onClearEdit: () => void;
  initialProductId?: string;
  initialMarketId?: string;
}

export default function PriceForm({ 
  products, 
  markets, 
  onAddPrice, 
  onUpdatePrice,
  editRecord = null,
  onClearEdit,
  initialProductId = '', 
  initialMarketId = '' 
}: PriceFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [productId, setProductId] = useState(initialProductId);
  const [marketId, setMarketId] = useState(initialMarketId);
  const [price, setPrice] = useState('');
  const [isPromotion, setIsPromotion] = useState(false);
  const [promotionDetails, setPromotionDetails] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (editRecord) {
      setProductId(editRecord.productId);
      setMarketId(editRecord.marketId);
      setPrice(editRecord.price.toString().replace('.', ','));
      setIsPromotion(editRecord.isPromotion);
      setPromotionDetails(editRecord.promotionDetails || '');
      setIsOpen(true);
    }
  }, [editRecord]);

  const handleClose = () => {
    setIsOpen(false);
    onClearEdit();
    setProductId(initialProductId);
    setMarketId(initialMarketId);
    setPrice('');
    setIsPromotion(false);
    setPromotionDetails('');
    setErrors({});
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!productId) newErrors.productId = 'Selecione um produto';
    if (!marketId) newErrors.marketId = 'Selecione um mercado';
    
    const priceNum = parseFloat(price.replace(',', '.'));
    if (!price || isNaN(priceNum)) {
      newErrors.price = 'Informe um preço válido';
    } else if (priceNum <= 0) {
      newErrors.price = 'O preço deve ser maior que zero';
    }

    if (isPromotion && !promotionDetails.trim()) {
      newErrors.promotionDetails = 'Descreva os detalhes da promoção';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const priceData = {
      productId,
      marketId,
      price: parseFloat(price.replace(',', '.')),
      isPromotion,
      promotionDetails: isPromotion ? promotionDetails.trim() : undefined
    };

    if (editRecord) {
      onUpdatePrice(editRecord.id, priceData);
    } else {
      onAddPrice(priceData);
    }

    handleClose();
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 bg-emerald-600 text-white px-5 py-2.5 rounded-xl font-bold hover:bg-emerald-700 transition-all shadow-sm hover:shadow-md active:scale-95"
      >
        <DollarSign size={20} />
        <span>Cadastrar Preço</span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleClose}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg bg-white rounded-[2rem] sm:rounded-[2.5rem] shadow-2xl max-h-[90vh] flex flex-col overflow-hidden m-2 z-50"
            >
              <div className="p-5 sm:p-8 border-b border-slate-100 flex justify-between items-center bg-white sticky top-0 z-10 shrink-0">
                <div>
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                    {editRecord ? 'Editar Cotação' : 'Novo Preço'}
                  </h2>
                  <p className="text-slate-500 font-bold text-xs sm:text-sm">
                    {editRecord ? 'Atualize os dados da cotação' : 'Registre a cotação de um produto'}
                  </p>
                </div>
                <button 
                  onClick={handleClose}
                  className="p-2 sm:p-3 hover:bg-slate-100 rounded-2xl text-slate-400 transition-colors shrink-0"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="p-5 sm:p-8 overflow-y-auto flex-1">
                <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6 text-left">
                  <div className="space-y-2">
                    <label className={`text-[10px] font-black uppercase tracking-widest flex items-center gap-2 px-1 ${errors.productId ? 'text-rose-500' : 'text-slate-400'}`}>
                      <Package size={14} /> Produto
                    </label>
                    <div className="relative">
                      <select
                        value={productId}
                        onChange={(e) => {
                          setProductId(e.target.value);
                          if (errors.productId) setErrors(prev => ({ ...prev, productId: '' }));
                        }}
                        className={`w-full px-4 sm:px-5 py-3 sm:py-3.5 bg-slate-50 border-2 rounded-2xl focus:border-indigo-600 focus:bg-white outline-none transition-all font-bold text-sm sm:text-base text-slate-800 appearance-none ${errors.productId ? 'border-rose-100 bg-rose-50/50' : 'border-slate-100'}`}
                      >
                        <option value="">Selecione um produto</option>
                        {products.map(p => (
                          <option key={p.id} value={p.id}>{p.name} ({p.brand})</option>
                        ))}
                      </select>
                    </div>
                    {errors.productId && <p className="text-[10px] font-black text-rose-500 uppercase tracking-widest px-1">{errors.productId}</p>}
                  </div>

                  <div className="space-y-2">
                    <label className={`text-[10px] font-black uppercase tracking-widest flex items-center gap-2 px-1 ${errors.marketId ? 'text-rose-500' : 'text-slate-400'}`}>
                      <Store size={14} /> Mercado
                    </label>
                    <div className="relative">
                      <select
                        value={marketId}
                        onChange={(e) => {
                          setMarketId(e.target.value);
                          if (errors.marketId) setErrors(prev => ({ ...prev, marketId: '' }));
                        }}
                        className={`w-full px-4 sm:px-5 py-3 sm:py-3.5 bg-slate-50 border-2 rounded-2xl focus:border-indigo-600 focus:bg-white outline-none transition-all font-bold text-sm sm:text-base text-slate-800 appearance-none ${errors.marketId ? 'border-rose-100 bg-rose-50/50' : 'border-slate-100'}`}
                      >
                        <option value="">Selecione um mercado</option>
                        {markets.map(m => (
                          <option key={m.id} value={m.id}>{m.name} - {m.region}</option>
                        ))}
                      </select>
                    </div>
                    {errors.marketId && <p className="text-[10px] font-black text-rose-500 uppercase tracking-widest px-1">{errors.marketId}</p>}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className={`text-[10px] font-black uppercase tracking-widest flex items-center gap-2 px-1 ${errors.price ? 'text-rose-500' : 'text-slate-400'}`}>
                        <DollarSign size={14} /> Preço (R$)
                      </label>
                      <input
                        type="text"
                        placeholder="0,00"
                        value={price}
                        onChange={(e) => {
                          const val = e.target.value.replace(/[^\d,]/g, '');
                          setPrice(val);
                          if (errors.price) setErrors(prev => ({ ...prev, price: '' }));
                        }}
                        className={`w-full px-4 sm:px-5 py-3 sm:py-3.5 bg-slate-50 border-2 rounded-2xl focus:border-indigo-600 focus:bg-white outline-none transition-all font-bold text-sm sm:text-base text-slate-800 ${errors.price ? 'border-rose-100 bg-rose-50/50' : 'border-slate-100'}`}
                      />
                      {errors.price && <p className="text-[10px] font-black text-rose-500 uppercase tracking-widest px-1">{errors.price}</p>}
                    </div>
                  </div>

                  <div className={`p-4 sm:p-5 bg-slate-50 rounded-2xl sm:rounded-3xl border space-y-4 transition-all ${errors.promotionDetails ? 'border-rose-100 bg-rose-50/30' : 'border-slate-100'}`}>
                    <label className="flex items-center gap-3 cursor-pointer group">
                      <div className="relative">
                        <input
                          type="checkbox"
                          className="sr-only"
                          checked={isPromotion}
                          onChange={(e) => {
                            setIsPromotion(e.target.checked);
                            if (!e.target.checked) setErrors(prev => ({ ...prev, promotionDetails: '' }));
                          }}
                        />
                        <div className={`w-12 h-6 rounded-full transition-colors ${isPromotion ? 'bg-indigo-600' : 'bg-slate-300'}`} />
                        <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${isPromotion ? 'translate-x-6' : ''}`} />
                      </div>
                      <span className="text-xs sm:text-sm font-black text-slate-700 uppercase tracking-widest">É uma promoção?</span>
                    </label>

                    {isPromotion && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="pt-2 space-y-2"
                      >
                        <input
                          type="text"
                          placeholder="Ex: Leve 3 Pague 2, Válido até..."
                          value={promotionDetails}
                          onChange={(e) => {
                            setPromotionDetails(e.target.value);
                            if (errors.promotionDetails) setErrors(prev => ({ ...prev, promotionDetails: '' }));
                          }}
                          className={`w-full px-4 sm:px-5 py-3 bg-white border-2 rounded-xl focus:border-indigo-600 outline-none transition-all text-xs sm:text-sm font-medium ${errors.promotionDetails ? 'border-rose-200 focus:border-rose-500' : 'border-indigo-100'}`}
                        />
                        {errors.promotionDetails && <p className="text-[10px] font-black text-rose-500 uppercase tracking-widest px-1">{errors.promotionDetails}</p>}
                      </motion.div>
                    )}
                  </div>

                  <div className="pt-2 flex flex-col-reverse sm:flex-row gap-2 sm:gap-3">
                    <button
                      type="button"
                      onClick={handleClose}
                      className="w-full sm:flex-1 py-3 sm:py-3.5 border border-slate-200 rounded-[1.2rem] text-slate-600 font-bold hover:bg-slate-50 transition-all text-xs sm:text-sm uppercase tracking-wider"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className={`w-full sm:flex-1 ${editRecord ? 'bg-amber-600 shadow-amber-200 hover:bg-amber-700' : 'bg-indigo-600 shadow-indigo-200 hover:bg-indigo-700'} text-white py-3 sm:py-3.5 rounded-[1.2rem] font-black uppercase tracking-wider shadow-lg transition-all active:scale-[0.98] flex items-center justify-center gap-2 text-xs sm:text-sm`}
                    >
                      {editRecord ? <Edit2 size={16} strokeWidth={3} /> : <Rocket size={16} strokeWidth={3} />}
                      {editRecord ? 'Atualizar Cotação' : 'Salvar Cotação'}
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
