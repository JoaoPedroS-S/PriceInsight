import React, { useState, useEffect } from 'react';
import { Store, Plus, X, AlertCircle, Truck } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Market } from '../../types';

interface MarketFormProps {
  onAddMarket: (market: Omit<Market, 'id'>) => void;
  onUpdateMarket?: (id: string, market: Partial<Market>) => void;
  marketToEdit?: Market | null;
  onClearEdit?: () => void;
}

export default function MarketForm({ onAddMarket, onUpdateMarket, marketToEdit, onClearEdit }: MarketFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [region, setRegion] = useState('');
  const [deliveryAvailable, setDeliveryAvailable] = useState(false);
  const [errors, setErrors] = useState<{ name?: string, location?: string, region?: string }>({});

  useEffect(() => {
    if (marketToEdit) {
      setName(marketToEdit.name);
      setLocation(marketToEdit.location);
      setRegion(marketToEdit.region || '');
      setDeliveryAvailable(marketToEdit.deliveryAvailable);
      setIsOpen(true);
    }
  }, [marketToEdit]);

  const handleClose = () => {
    setIsOpen(false);
    if (onClearEdit) onClearEdit();
    setTimeout(() => {
      setName('');
      setLocation('');
      setRegion('');
      setDeliveryAvailable(false);
      setErrors({});
    }, 200);
  };

  const validate = () => {
    const newErrors: { name?: string, location?: string, region?: string } = {};
    if (!name.trim()) {
      newErrors.name = 'O nome do mercado é obrigatório.';
    } else if (name.trim().length < 3) {
      newErrors.name = 'O nome deve ter pelo menos 3 caracteres.';
    }

    if (!location.trim()) {
      newErrors.location = 'O endereço é obrigatório.';
    } else if (location.trim().length < 5) {
      newErrors.location = 'O endereço deve ser mais detalhado.';
    }

    if (!region.trim()) {
      newErrors.region = 'A região ou bairro é obrigatório.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) return;

    if (marketToEdit && onUpdateMarket) {
      onUpdateMarket(marketToEdit.id, {
        name: name.trim(),
        location: location.trim(),
        region: region.trim(),
        deliveryAvailable
      });
    } else {
      onAddMarket({
        name: name.trim(),
        location: location.trim(),
        region: region.trim(),
        deliveryAvailable
      });
    }

    handleClose();
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 bg-[#4F46E5] text-white px-6 py-3.5 rounded-2xl font-black text-sm hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100/50 active:scale-95 whitespace-nowrap"
      >
        <Plus size={20} strokeWidth={3} />
        <span>NOVO MERCADO</span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleClose}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden max-h-[90vh] flex flex-col relative z-50 m-2"
            >
              <div className="p-4 sm:p-6 border-b border-slate-100 flex justify-between items-center bg-white sticky top-0 z-10 animate-none">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-indigo-50 rounded-full flex items-center justify-center text-indigo-600 shrink-0">
                    <Store size={20} />
                  </div>
                  <div>
                    <h2 className="text-lg sm:text-xl font-bold text-slate-800 leading-tight">
                      {marketToEdit ? 'Editar Mercado' : 'Cadastrar Mercado'}
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-500 leading-tight">
                      {marketToEdit ? 'Atualize os dados do mercado' : 'Adicione um novo mercado atacadista'}
                    </p>
                  </div>
                </div>
                <button 
                  onClick={handleClose}
                  className="text-slate-400 hover:text-slate-600 transition-colors p-1"
                >
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4 sm:space-y-5 overflow-y-auto">
                <div>
                   <label className="block text-xs sm:text-sm font-semibold text-slate-700 mb-1">
                    Nome do Mercado <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      if (errors.name) setErrors({ ...errors, name: undefined });
                    }}
                    placeholder="Ex: Atacadão, Assaí, Carrefour"
                    className={`w-full px-4 py-3 sm:py-2.5 border rounded-lg focus:ring-2 focus:border-transparent outline-none transition-all text-sm ${
                      errors.name 
                        ? 'border-rose-300 focus:ring-rose-200 bg-rose-50/30' 
                        : 'border-slate-200 focus:ring-indigo-500'
                    }`}
                  />
                  {errors.name && (
                    <p className="mt-1.5 text-xs font-bold text-rose-500 flex items-center gap-1 animate-in fade-in slide-in-from-top-1">
                      <AlertCircle size={12} />
                      {errors.name}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-slate-700 mb-1">
                    Endereço Completo <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => {
                      setLocation(e.target.value);
                      if (errors.location) setErrors({ ...errors, location: undefined });
                    }}
                    placeholder="Rua, Número, Complemento"
                    className={`w-full px-4 py-3 sm:py-2.5 border rounded-lg focus:ring-2 focus:border-transparent outline-none transition-all text-sm ${
                      errors.location 
                        ? 'border-rose-300 focus:ring-rose-200 bg-rose-50/30' 
                        : 'border-slate-200 focus:ring-indigo-500'
                    }`}
                  />
                  {errors.location && (
                    <p className="mt-1.5 text-xs font-bold text-rose-500 flex items-center gap-1 animate-in fade-in slide-in-from-top-1">
                      <AlertCircle size={12} />
                      {errors.location}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-slate-700 mb-1">
                    Região / Bairro <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={region}
                    onChange={(e) => {
                      setRegion(e.target.value);
                      if (errors.region) setErrors({ ...errors, region: undefined });
                    }}
                    placeholder="Ex: Zona Norte, Centro, Barra"
                    className={`w-full px-4 py-3 sm:py-2.5 border rounded-lg focus:ring-2 focus:border-transparent outline-none transition-all text-sm ${
                      errors.region 
                        ? 'border-rose-300 focus:ring-rose-200 bg-rose-50/30' 
                        : 'border-slate-200 focus:ring-indigo-500'
                    }`}
                  />
                  {errors.region && (
                    <p className="mt-1.5 text-xs font-bold text-rose-500 flex items-center gap-1 animate-in fade-in slide-in-from-top-1">
                      <AlertCircle size={12} />
                      {errors.region}
                    </p>
                  )}
                </div>

                <div className={`flex items-center justify-between p-3.5 sm:p-4 rounded-xl border transition-all ${
                  deliveryAvailable 
                    ? 'bg-emerald-50 border-emerald-200 ring-2 ring-emerald-100' 
                    : 'bg-slate-50 border-slate-100'
                }`}>
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${deliveryAvailable ? 'bg-emerald-500 text-white' : 'bg-slate-200 text-slate-400'}`}>
                      <Truck size={18} />
                    </div>
                    <div>
                      <label htmlFor="delivery" className="text-xs sm:text-sm font-bold text-slate-700 cursor-pointer select-none block">
                        Serviço de Entrega
                      </label>
                      <p className="text-[10px] text-slate-500 font-medium">O mercado realiza delivery?</p>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    id="delivery"
                    value=""
                    checked={deliveryAvailable}
                    onChange={(e) => setDeliveryAvailable(e.target.checked)}
                    className="w-5 h-5 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500 cursor-pointer shrink-0"
                  />
                </div>

                <div className="pt-4 flex flex-col-reverse sm:flex-row gap-2 sm:gap-3 sticky bottom-0 bg-white pb-2">
                  <button
                    type="button"
                    onClick={handleClose}
                    className="w-full sm:flex-1 px-4 py-3 sm:py-2.5 border border-slate-200 rounded-lg text-slate-600 font-medium hover:bg-slate-50 transition-colors text-sm"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="w-full sm:flex-1 px-4 py-3 sm:py-2.5 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors shadow-sm text-sm"
                  >
                    {marketToEdit ? 'Atualizar Mercado' : 'Salvar Mercado'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
