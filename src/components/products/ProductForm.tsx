import React, { useState, useRef, useEffect } from 'react';
import { Package, Plus, X, Upload, Image as ImageIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Product } from '../../types';

interface ProductFormProps {
  onAddProduct: (product: Omit<Product, 'id' | 'createdAt'>) => void;
  onUpdateProduct?: (id: string, product: Partial<Product>) => void;
  productToEdit?: Product | null;
  onClearEdit?: () => void;
}

export default function ProductForm({ onAddProduct, onUpdateProduct, productToEdit, onClearEdit }: ProductFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState('');
  const [brand, setBrand] = useState('');
  const [category, setCategory] = useState('');
  const [unit, setUnit] = useState('UN');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [uploadMode, setUploadMode] = useState<'file' | 'url'>('file');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (productToEdit) {
      setName(productToEdit.name);
      setBrand(productToEdit.brand);
      setCategory(productToEdit.category);
      setUnit(productToEdit.unit);
      setDescription(productToEdit.description || '');
      setImageUrl(productToEdit.imageUrl || '');
      setIsOpen(true);
    }
  }, [productToEdit]);

  const handleClose = () => {
    setIsOpen(false);
    if (onClearEdit) onClearEdit();
    // Delay reset to avoid flicker during exit animation
    setTimeout(() => {
      setName('');
      setBrand('');
      setCategory('');
      setUnit('UN');
      setDescription('');
      setImageUrl('');
    }, 200);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !category) return;
    
    if (productToEdit && onUpdateProduct) {
      onUpdateProduct(productToEdit.id, {
        name,
        brand,
        category,
        unit,
        description,
        imageUrl
      });
    } else {
      onAddProduct({
        name,
        brand,
        category,
        unit,
        description,
        imageUrl
      });
    }
    
    handleClose();
  };

  return (
    <div className="mb-8">
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 bg-brand-blue text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-sm active:scale-95"
      >
        <Plus size={18} />
        Novo Produto
      </button>

      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden max-h-[90vh] flex flex-col m-2 z-50 relative"
            >
              <div className="p-4 sm:p-6 border-b border-slate-100 flex justify-between items-center bg-white sticky top-0 z-10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-brand-blue/10 rounded-full flex items-center justify-center text-brand-blue shrink-0">
                    <Package size={20} />
                  </div>
                  <div>
                    <h2 className="text-lg sm:text-xl font-bold text-slate-800 leading-tight">
                      {productToEdit ? 'Editar Produto' : 'Cadastrar Produto'}
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-500 leading-tight">
                      {productToEdit ? 'Atualize as informações do item' : 'Adicione um novo item para consulta'}
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

              <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4 overflow-y-auto">
                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-slate-700 mb-1">Nome do Produto</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ex: Arroz Integral 5kg"
                    className="w-full px-4 py-3 sm:py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-transparent outline-none transition-all text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-slate-700 mb-1">Marca</label>
                  <input
                    type="text"
                    required
                    value={brand}
                    onChange={(e) => setBrand(e.target.value)}
                    placeholder="Ex: Tio João"
                    className="w-full px-4 py-3 sm:py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-transparent outline-none transition-all text-sm"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs sm:text-sm font-semibold text-slate-700 mb-1">Categoria</label>
                    <div className="relative">
                      <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        required
                        className="w-full px-4 py-3 sm:py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-transparent outline-none transition-all bg-white font-medium text-sm"
                      >
                        <option value="">Selecione...</option>
                        <option value="Grãos">Grãos</option>
                        <option value="Hortifruti">Hortifruti</option>
                        <option value="Laticínios">Laticínios</option>
                        <option value="Carnes">Carnes</option>
                        <option value="Limpeza">Limpeza</option>
                        <option value="Bebidas">Bebidas</option>
                        <option value="Outros">Outros</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs sm:text-sm font-semibold text-slate-700 mb-1">Unidade</label>
                    <div className="relative">
                      <select
                        value={unit}
                        onChange={(e) => setUnit(e.target.value)}
                        className="w-full px-4 py-3 sm:py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-transparent outline-none transition-all bg-white font-medium text-sm"
                      >
                        <option value="UN">Unidade</option>
                        <option value="KG">Quilo (KG)</option>
                        <option value="LT">Litro (LT)</option>
                        <option value="FD">Fardo (FD)</option>
                        <option value="CX">Caixa (CX)</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-slate-700 mb-1">Descrição (Opcional)</label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={2}
                    placeholder="Detalhes adicionais do produto..."
                    className="w-full px-4 py-3 sm:py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-transparent outline-none transition-all text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-slate-700 mb-2">Imagem do Produto</label>
                  
                  {/* Tabs for Image Selection */}
                  <div className="flex gap-1 bg-slate-100 p-1 rounded-xl mb-3">
                    <button
                      type="button"
                      onClick={() => setUploadMode('file')}
                      className={`flex-1 py-2.5 sm:py-2 text-xs font-bold rounded-lg transition-all ${
                        uploadMode === 'file' ? 'bg-white shadow-xs text-blue-600' : 'text-slate-500 hover:bg-white/50'
                      }`}
                    >
                      <Upload size={14} className="inline mr-1.5" />
                      Arquivo
                    </button>
                    <button
                      type="button"
                      onClick={() => setUploadMode('url')}
                      className={`flex-1 py-2.5 sm:py-2 text-xs font-bold rounded-lg transition-all ${
                        uploadMode === 'url' ? 'bg-white shadow-xs text-blue-600' : 'text-slate-500 hover:bg-white/50'
                      }`}
                    >
                      <ImageIcon size={14} className="inline mr-1.5" />
                      URL
                    </button>
                  </div>

                  {uploadMode === 'url' ? (
                    <div className="space-y-3">
                      <input
                        type="url"
                        value={imageUrl}
                        onChange={(e) => setImageUrl(e.target.value)}
                        placeholder="https://exemplo.com/imagem.jpg"
                        className="w-full px-4 py-3 sm:py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-transparent outline-none transition-all text-sm"
                      />
                      {imageUrl && (
                        <div className="flex flex-col items-center p-4 border border-slate-100 rounded-xl bg-slate-50/50">
                          <img 
                            src={imageUrl} 
                            alt="Preview" 
                            className="w-24 h-24 object-contain rounded-lg shadow-sm bg-white"
                            onError={(e) => (e.currentTarget.style.display = 'none')}
                            autoFocus
                          />
                          <button 
                            type="button"
                            onClick={() => setImageUrl('')}
                            className="mt-3 text-xs font-bold text-rose-500 hover:text-rose-600"
                          >
                            Limpar URL
                          </button>
                        </div>
                      )}
                    </div>
                  ) : (
                    <>
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        accept="image/*"
                        className="hidden"
                      />
                      
                      <div 
                        onClick={() => fileInputRef.current?.click()}
                        className={`relative border-2 border-dashed rounded-xl p-5 flex flex-col items-center justify-center cursor-pointer transition-all ${
                          imageUrl ? 'border-brand-blue/30 bg-blue-50/10' : 'border-slate-200 hover:border-brand-blue/50 hover:bg-slate-50'
                        }`}
                      >
                        {imageUrl ? (
                          <div className="space-y-3 w-full flex flex-col items-center">
                            <img 
                              src={imageUrl} 
                              alt="Preview" 
                              className="w-32 h-32 object-contain rounded-lg shadow-sm"
                            />
                            <div className="flex flex-wrap justify-center gap-2">
                              <button 
                                type="button"
                                className="bg-white border border-slate-200 text-slate-600 px-3 py-2 sm:py-1.5 rounded-lg text-xs font-bold hover:bg-slate-50 shadow-sm transition-colors"
                              >
                                Trocar Imagem
                              </button>
                              <button 
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setImageUrl('');
                                }}
                                className="bg-rose-50 text-rose-500 border border-rose-100 px-3 py-2 sm:py-1.5 rounded-lg text-xs font-bold hover:bg-rose-100 transition-colors"
                              >
                                Remover
                              </button>
                            </div>
                          </div>
                        ) : (
                          <>
                            <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-400 mb-3">
                              <Upload size={24} />
                            </div>
                            <p className="text-sm font-bold text-slate-700">Clique para subir a imagem</p>
                            <p className="text-xs text-slate-400 mt-1">PNG, JPG ou WEBP (Max. 2MB)</p>
                          </>
                        )}
                      </div>
                    </>
                  )}
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
                    className="w-full sm:flex-1 px-4 py-3 sm:py-2.5 bg-brand-blue text-white rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-sm text-sm"
                  >
                    {productToEdit ? 'Atualizar Produto' : 'Salvar Produto'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
