import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Sidebar from './components/layout/Sidebar';
import { Search, ListFilter, Menu } from 'lucide-react';
import ProductForm from './components/products/ProductForm';
import ProductList from './components/products/ProductList';
import ProductDetails from './components/products/ProductDetails';
import MarketForm from './components/markets/MarketForm';
import MarketList from './components/markets/MarketList';
import MarketDetails from './components/markets/MarketDetails';
import HomeView from './components/home/HomeView';
import { Product, Market, PriceRecord } from './types';
import PriceForm from './components/prices/PriceForm';
import PriceList from './components/prices/PriceList';
import { api } from './services/api';

export default function App() {
  const [activeTab, setActiveTab ] = useState('home');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [markets, setMarkets] = useState<Market[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [marketSearchTerm, setMarketSearchTerm] = useState('');
  const [marketSortBy, setMarketSortBy] = useState<'name_asc' | 'name_desc' | 'region_asc' | 'delivery_first'>('name_asc');
  const [isMarketsLoading, setIsMarketsLoading] = useState(false);
  const [marketsError, setMarketsError] = useState<string | null>(null);

  const [productToEdit, setProductToEdit] = useState<Product | null>(null);
  const [marketToEdit, setMarketToEdit] = useState<Market | null>(null);
  const [priceToEdit, setPriceToEdit] = useState<PriceRecord | null>(null);
  const [selectedMarket, setSelectedMarket] = useState<Market | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [priceRecords, setPriceRecords] = useState<PriceRecord[]>([]);

  // Fetch initial data and setup automatic dynamic sync updates
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsData, marketsData, pricesData] = await Promise.all([
          api.products.list(),
          api.markets.list(),
          api.prices.list()
        ]);
        
        setProducts(productsData);
        setMarkets(marketsData);
        setPriceRecords(pricesData);
      } catch (e) {
        console.error('Failed to fetch data', e);
      }
    };

    // Initial fetch
    fetchData();

    // Automatic background polling interval (every 4 seconds) to guarantee synchronization after database updates
    const intervalId = setInterval(fetchData, 4000);

    // Instant update when the user refocuses the app/window
    window.addEventListener('focus', fetchData);

    // Clean up timers and event listeners on unmount
    return () => {
      clearInterval(intervalId);
      window.removeEventListener('focus', fetchData);
    };
  }, []);

  // Simulate loading when switching to markets tab
  useEffect(() => {
    if (activeTab === 'markets') {
      setIsMarketsLoading(true);
      setMarketsError(null);
      
      const timer = setTimeout(() => {
        setIsMarketsLoading(false);
      }, 500);
      
      return () => clearTimeout(timer);
    }
  }, [activeTab]);

  const handleAddProduct = async (newProduct: Omit<Product, 'id' | 'createdAt'>) => {
    try {
      const data = await api.products.create(newProduct);
      setProducts([data, ...products]);
    } catch (e) {
      console.error('Failed to add product', e);
    }
  };

  const handleUpdateProduct = async (id: string, updatedData: Partial<Product>) => {
    try {
      const data = await api.products.update(id, updatedData);
      setProducts(products.map(p => p.id === id ? data : p));
      setProductToEdit(null);
    } catch (e) {
      console.error('Failed to update product', e);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    try {
      await api.products.delete(id);
      setProducts(products.filter(p => p.id !== id));
      setPriceRecords(priceRecords.filter(p => p.productId !== id));
    } catch (e) {
      console.error('Failed to delete product', e);
    }
  };

  const handleAddMarket = async (newMarket: Omit<Market, 'id'>) => {
    // Normalize data
    const normalizedName = newMarket.name.trim();
    const normalizedLocation = newMarket.location.trim();

    // Check for duplicates (same name and location)
    const isDuplicate = markets.some(m => 
      m.name.toLowerCase() === normalizedName.toLowerCase() && 
      m.location.toLowerCase() === normalizedLocation.toLowerCase()
    );

    if (isDuplicate) {
      alert('Este mercado já está cadastrado com este endereço.');
      return;
    }

    try {
      const data = await api.markets.create({ ...newMarket, name: normalizedName, location: normalizedLocation });
      setMarkets([data, ...markets]);
    } catch (e) {
      console.error('Failed to add market', e);
    }
  };

  const handleUpdateMarket = async (id: string, updatedData: Partial<Market>) => {
    if (updatedData.name || updatedData.location) {
      const currentMarket = markets.find(m => m.id === id);
      const newName = (updatedData.name || currentMarket?.name || '').trim();
      const newLocation = (updatedData.location || currentMarket?.location || '').trim();

      // Check if the change creates a duplicate with *another* market
      const isDuplicate = markets.some(m => 
        m.id !== id && 
        m.name.toLowerCase() === newName.toLowerCase() && 
        m.location.toLowerCase() === newLocation.toLowerCase()
      );

      if (isDuplicate) {
        alert('Já existe outro mercado cadastrado com este nome e endereço.');
        return;
      }

      try {
        const data = await api.markets.update(id, { ...updatedData, name: newName, location: newLocation });
        setMarkets(markets.map(m => m.id === id ? data : m));
        setMarketToEdit(null);
      } catch (e) {
        console.error('Failed to update market', e);
      }
    } else {
      try {
        const data = await api.markets.update(id, updatedData);
        setMarkets(markets.map(m => m.id === id ? data : m));
        setMarketToEdit(null);
      } catch (e) {
        console.error('Failed to update market', e);
      }
    }
  };

  const handleDeleteMarket = async (id: string) => {
    try {
      await api.markets.delete(id);
      setMarkets(markets.filter(m => m.id !== id));
      // Also remove prices related to this market
      setPriceRecords(priceRecords.filter(p => p.marketId !== id));
    } catch (e) {
      console.error('Failed to delete market', e);
    }
  };

  const handleAddPrice = async (newPrice: Omit<PriceRecord, 'id' | 'date' | 'history'>) => {
    try {
      const data = await api.prices.create(newPrice);
      setPriceRecords([data, ...priceRecords]);
    } catch (e) {
      console.error('Failed to add price', e);
    }
  };

  const handleDeletePrice = async (id: string) => {
    try {
      await api.prices.delete(id);
      setPriceRecords(priceRecords.filter(p => p.id !== id));
    } catch (e) {
      console.error('Failed to delete price', e);
    }
  };

  const handleUpdatePrice = async (id: string, updatedPrice: Partial<PriceRecord>) => {
    try {
      const data = await api.prices.update(id, updatedPrice);
      setPriceRecords(priceRecords.map(p => p.id === id ? data : p));
      setPriceToEdit(null);
    } catch (e) {
      console.error('Failed to update price', e);
    }
  };

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleHomeSearch = (term: string) => {
    setSearchTerm(term);
    setActiveTab('products');
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return (
          <HomeView 
            searchTerm={searchTerm} 
            setSearchTerm={handleHomeSearch} 
            productsCount={products.length} 
            markets={markets}
            onViewMarket={(market) => setSelectedMarket(market)}
          />
        );
      case 'products':
        return (
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
                  {searchTerm ? `Resultados para "${searchTerm}"` : "Produtos"}
                </h2>
                <p className="text-slate-500 font-medium">
                  {searchTerm 
                    ? `Encontramos ${filteredProducts.length} itens correspondentes.` 
                    : "Cadastre e organize os itens que deseja monitorar."}
                </p>
              </div>
              <div className="flex items-center gap-3">
                {searchTerm && (
                  <button 
                    onClick={() => setSearchTerm('')}
                    className="px-4 py-2 text-slate-500 font-semibold hover:bg-slate-100 rounded-xl transition-all"
                  >
                    Ver todos
                  </button>
                )}
                <ProductForm 
                  onAddProduct={handleAddProduct} 
                  onUpdateProduct={handleUpdateProduct}
                  productToEdit={productToEdit}
                  onClearEdit={() => setProductToEdit(null)}
                />
              </div>
            </div>
            
            {/* Quick search inside products list tab */}
            <div className="relative">
              <input 
                type="text"
                placeholder="Pesquisar entre meus produtos..."
                className="w-full pl-6 pr-4 py-3 bg-white border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-100 outline-none transition-all shadow-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <ProductList 
              products={filteredProducts} 
              markets={markets}
              priceRecords={priceRecords}
              onDelete={handleDeleteProduct} 
              onEdit={(product) => setProductToEdit(product)}
              onView={(product) => setSelectedProduct(product)}
            />
          </div>
        );
      case 'markets':
        const filteredMarkets = markets.filter(m => 
          m.name.toLowerCase().includes(marketSearchTerm.toLowerCase()) ||
          m.region.toLowerCase().includes(marketSearchTerm.toLowerCase()) ||
          m.location.toLowerCase().includes(marketSearchTerm.toLowerCase())
        ).sort((a, b) => {
          switch (marketSortBy) {
            case 'name_asc':
              return a.name.localeCompare(b.name);
            case 'name_desc':
              return b.name.localeCompare(a.name);
            case 'region_asc':
              return a.region.localeCompare(b.region);
            case 'delivery_first':
              if (a.deliveryAvailable === b.deliveryAvailable) {
                return a.name.localeCompare(b.name);
              }
              return a.deliveryAvailable ? -1 : 1;
            default:
              return 0;
          }
        });

        return (
          <div className="space-y-8">
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
              <div>
                <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-slate-900 tracking-tight mb-2">
                  Mercados Atacadistas
                </h2>
                <div className="flex items-center gap-3">
                  <p className="text-slate-400 font-bold text-sm">
                    {markets.length === 0 
                      ? "Cadastre mercados para começar a comparar preços." 
                      : `Exibindo ${filteredMarkets.length} de ${markets.length} mercados.`}
                  </p>
                </div>
              </div>
              
              <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3 w-full md:w-auto">
                <div className="relative group w-full md:min-w-[320px]">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={18} />
                  <input
                    type="text"
                    placeholder="Buscar mercados..."
                    value={marketSearchTerm}
                    onChange={(e) => setMarketSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-4 py-3.5 bg-white border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-50 focus:border-transparent outline-none transition-all shadow-sm font-bold text-slate-700 placeholder:text-slate-400 placeholder:font-bold"
                  />
                </div>
                
                <div className="relative flex items-center bg-white border border-slate-200 rounded-2xl px-6 py-3.5 shadow-sm focus-within:ring-4 focus-within:ring-indigo-50 transition-all cursor-pointer">
                  <ListFilter size={18} className="text-slate-400 mr-3" />
                  <select 
                    value={marketSortBy}
                    onChange={(e) => setMarketSortBy(e.target.value as any)}
                    className="bg-transparent border-none outline-none text-[11px] font-black text-slate-700 cursor-pointer pr-6 appearance-none uppercase tracking-widest"
                  >
                    <option value="name_asc">Nome (A-Z)</option>
                    <option value="name_desc">Nome (Z-A)</option>
                    <option value="region_asc">Por Região</option>
                    <option value="delivery_first">Entrega Primeiro</option>
                  </select>
                  <div className="absolute right-4 pointer-events-none">
                    <div className="w-1.5 h-1.5 border-r-2 border-b-2 border-slate-400 rotate-45" />
                  </div>
                </div>
 

                
                <MarketForm 
                  onAddMarket={handleAddMarket} 
                  onUpdateMarket={handleUpdateMarket}
                  marketToEdit={marketToEdit}
                  onClearEdit={() => setMarketToEdit(null)}
                />
              </div>
            </div>

            <MarketList 
              markets={filteredMarkets} 
              priceRecords={priceRecords} 
              onDelete={handleDeleteMarket} 
              onEdit={(market) => setMarketToEdit(market)}
              onView={(market) => setSelectedMarket(market)}
              isLoading={isMarketsLoading}
              error={marketsError}
              onRetry={() => {
                setMarketsError(null);
                setIsMarketsLoading(true);
                setTimeout(() => setIsMarketsLoading(false), 800);
              }}
            />
          </div>
        );
      case 'prices':
        return (
          <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div>
                <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-slate-900 tracking-tight mb-2">
                  Cadastro de Preços
                </h2>
                <p className="text-slate-400 font-bold text-sm">
                  {priceRecords.length === 0 
                    ? "Registre os preços dos produtos nos mercados para comparação." 
                    : `Total de ${priceRecords.length} cotações registradas.`}
                </p>
              </div>
              
              <PriceForm 
                products={products} 
                markets={markets} 
                onAddPrice={handleAddPrice} 
                onUpdatePrice={handleUpdatePrice}
                editRecord={priceToEdit}
                onClearEdit={() => setPriceToEdit(null)}
              />
            </div>

            <PriceList 
              prices={[...priceRecords].sort((a, b) => b.date - a.date)}
              products={products}
              markets={markets}
              onDelete={handleDeletePrice}
              onEdit={(record) => setPriceToEdit(record)}
            />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col lg:flex-row">
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        isOpen={sidebarOpen} 
        onClose={() => setSidebarOpen(false)} 
      />
      
      {/* Mobile Top Header */}
      <div className="lg:hidden bg-white border-b border-slate-100 px-6 py-4 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setSidebarOpen(true)}
            className="p-2 -ml-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-50 active:bg-slate-100 transition-all"
            aria-label="Abrir menu"
          >
            <Menu size={22} />
          </button>
          <span className="text-xl font-black tracking-tight text-slate-900 bg-gradient-to-r from-indigo-600 to-indigo-800 bg-clip-text text-transparent">PriceInsight</span>
        </div>
        <div className="text-[10px] font-black text-indigo-600 bg-indigo-50/70 border border-indigo-100 px-3 py-1.5 rounded-xl uppercase tracking-wider">
          {activeTab === 'home' ? 'Início' : activeTab === 'products' ? 'Produtos' : activeTab === 'prices' ? 'Preços' : 'Mercados'}
        </div>
      </div>

      <main className="flex-1 lg:ml-64 p-4 sm:p-8 min-h-screen">
        <div className="max-w-7xl mx-auto">
          <header className="mb-8 md:mb-10 flex flex-col md:flex-row justify-between md:items-center gap-4">
            <div>
              <p className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.2em] mb-1">
                PRICEINSIGHT
              </p>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
                {activeTab === 'home' ? 'Página Inicial' : activeTab === 'products' ? 'Produtos' : activeTab === 'prices' ? 'Preços' : 'Mercados'}
              </h1>
            </div>
          </header>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
            >
              {renderContent()}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      <MarketDetails 
        market={selectedMarket} 
        products={products}
        priceRecords={priceRecords}
        onClose={() => setSelectedMarket(null)} 
      />

      <ProductDetails 
        product={selectedProduct}
        markets={markets}
        priceRecords={priceRecords}
        onClose={() => setSelectedProduct(null)}
        onAddPrice={(id) => {
          setSelectedProduct(null);
          setActiveTab('prices');
        }}
      />
    </div>
  );
}
