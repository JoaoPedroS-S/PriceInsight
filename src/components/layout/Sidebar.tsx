import { useState } from 'react';
import { Home, ShoppingBag, Settings, Store, DollarSign, X } from 'lucide-react';
import { motion } from 'motion/react';
import logo from '../../imagem/logo.png';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ activeTab, setActiveTab, isOpen, onClose }: SidebarProps) {
  const [imageError, setImageError] = useState(false);

  const menuItems = [
    { id: 'home', label: 'Início', icon: Home },
    { id: 'products', label: 'Produtos', icon: ShoppingBag },
    { id: 'markets', label: 'Mercados', icon: Store },
    { id: 'prices', label: 'Preços', icon: DollarSign },
  ];

  const handleNavigation = (tabId: string) => {
    setActiveTab(tabId);
    onClose(); // Automatically close mobile drawer after selection
  };

  return (
    <>
      {/* Backdrop Overlay for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/40 z-30 lg:hidden backdrop-blur-sm transition-opacity duration-300"
          onClick={onClose}
        />
      )}

      <div className={`w-64 h-screen bg-white border-r border-slate-100 flex flex-col fixed left-0 top-0 z-40 transition-transform duration-300 ease-in-out lg:translate-x-0 ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="p-8 flex flex-col items-center relative">
          {/* Close button for mobile */}
          <button 
            onClick={onClose}
            className="absolute top-6 right-6 p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-all lg:hidden"
            aria-label="Fecar menu"
          >
            <X size={20} />
          </button>

          <div className="w-24 h-24 bg-white rounded-3xl shadow-xl shadow-indigo-100/50 flex items-center justify-center mb-6 border border-slate-50 overflow-hidden p-3.5">
          {!imageError ? (
            <img 
              src={logo} 
              alt="PriceInsight Logo" 
              className="w-full h-full object-contain"
              onError={() => setImageError(true)}
            />
          ) : (
            <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
              <defs>
                <linearGradient id="logo-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#6366f1" />
                  <stop offset="100%" stopColor="#4f46e5" />
                </linearGradient>
                <linearGradient id="trend-gradient" x1="0%" y1="100%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#34d399" />
                  <stop offset="100%" stopColor="#10b981" />
                </linearGradient>
              </defs>
              
              {/* Outer container */}
              <rect x="5" y="5" width="90" height="90" rx="26" fill="url(#logo-gradient)" />
              
              {/* Decorative lines */}
              <circle cx="50" cy="50" r="35" stroke="white" strokeWidth="1" strokeOpacity="0.08" fill="none" />
              <circle cx="50" cy="50" r="25" stroke="white" strokeWidth="1" strokeOpacity="0.05" fill="none" />
              
              {/* Bar charts inside representing pricing insights */}
              <rect x="30" y="52" width="9" height="18" rx="2.5" fill="white" fillOpacity="0.35" />
              <rect x="45.5" y="38" width="9" height="32" rx="2.5" fill="white" fillOpacity="0.73" />
              <rect x="61" y="26" width="9" height="44" rx="2.5" fill="white" />
              
              {/* Trendy green trend line with pointer */}
              <path d="M 26 62 L 41.5 45.5 L 57 33.5 L 75.5 24.5" stroke="url(#trend-gradient)" strokeWidth="5.5" strokeLinecap="round" strokeLinejoin="round" />
              
              {/* Glowing point */}
              <circle cx="75.5" cy="24.5" r="5" fill="white" stroke="#10b981" strokeWidth="2.5" />
            </svg>
          )}
        </div>
        <h1 className="text-xl font-black tracking-tight text-slate-900">PriceInsight</h1>
      </div>
      
      <nav className="flex-1 px-4 py-2 space-y-1">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => handleNavigation(item.id)}
            className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl transition-all text-sm font-bold ${
              activeTab === item.id
                ? 'bg-indigo-50 text-indigo-700 shadow-sm'
                : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
            }`}
          >
            <item.icon size={20} className={activeTab === item.id ? 'text-indigo-600' : 'text-slate-400'} />
            <span className="flex-1 text-left">{item.label}</span>
            {activeTab === item.id && (
              <div className="w-2 h-2 rounded-full bg-indigo-600 shadow-[0_0_10px_rgba(79,70,229,0.5)]" />
            )}
          </button>
        ))}
      </nav>
      
      <div className="p-6">
        <div className="mb-6 flex justify-center">
          <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest whitespace-nowrap">
            V1.0.0
          </p>
        </div>
        <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-500 hover:bg-slate-50 transition-all text-sm font-bold border border-transparent hover:border-slate-200">
          <Settings size={18} />
          Configurações
        </button>
      </div>
    </div>
  </>
);
}
