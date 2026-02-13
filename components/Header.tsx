
import React, { useState } from 'react';
import { ViewState } from '../types';

interface HeaderProps {
  onNavigate: (view: ViewState) => void;
}

const Header: React.FC<HeaderProps> = ({ onNavigate }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navigateTo = (view: ViewState) => {
    onNavigate(view);
    setIsMenuOpen(false);
  };

  return (
    <header className="bg-[#003366] text-white shadow-md sticky top-0 z-50 border-b-2 border-[#D4A017]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-4 md:h-28 gap-2">
          
          {/* Lado Esquerdo: Logo e Identidade */}
          <div 
            className="flex items-center cursor-pointer group min-w-0 flex-shrink" 
            onClick={() => navigateTo('home')}
          >
            <div className="bg-white p-1 md:p-2 rounded-lg md:rounded-xl w-16 h-8 sm:w-24 sm:h-10 md:w-48 md:h-16 flex items-center justify-center overflow-hidden border-2 border-[#D4A017] shadow-lg transition-transform group-hover:scale-105 flex-shrink-0">
              <img 
                src="https://medicinadosertao.com.br/wp-content/uploads/2021/03/logo-fms-colorido.png" 
                alt="Logo FMS" 
                className="w-full h-full object-contain"
              />
            </div>
            <div className="ml-2 md:ml-4 flex flex-col justify-center min-w-0">
              <h1 className="text-[10px] sm:text-xs md:text-base font-black tracking-widest leading-tight text-white uppercase truncate">
                MONITORIA VIRTUAL
              </h1>
              <h2 className="text-[7px] sm:text-[9px] md:text-[10px] font-bold text-[#D4A017] uppercase tracking-widest opacity-90 truncate">
                Desenvolvido por Fabrício Luna
              </h2>
            </div>
          </div>

          {/* Menu Desktop */}
          <nav className="hidden md:flex items-center gap-4">
            <button 
              onClick={() => navigateTo('career-quiz')}
              className="text-[10px] uppercase tracking-widest font-black bg-[#D4A017] text-[#003366] px-5 py-2.5 rounded-lg hover:bg-yellow-500 transition-all whitespace-nowrap shadow-lg animate-pulse hover:animate-none"
            >
              ⭐ ESPECIALIDADE
            </button>
            <button 
              onClick={() => navigateTo('calculators')}
              className="text-[10px] uppercase tracking-widest font-black text-[#D4A017] border-2 border-[#D4A017]/30 px-5 py-2.5 rounded-lg hover:bg-[#D4A017] hover:text-[#003366] hover:border-[#D4A017] transition-all whitespace-nowrap"
            >
              CALCULADORAS
            </button>
            <button 
              onClick={() => navigateTo('admin')}
              className="text-[10px] uppercase tracking-widest font-black text-white/70 border-2 border-white/10 px-5 py-2.5 rounded-lg hover:border-white hover:text-white transition-all bg-white/5 whitespace-nowrap"
            >
              ADMIN
            </button>
          </nav>

          {/* Botão Hambúrguer (Mobile) */}
          <button 
            className="md:hidden p-2 text-[#D4A017]"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Menu Mobile Dropdown */}
      {isMenuOpen && (
        <div className="md:hidden bg-[#002244] border-t border-[#D4A017]/20 p-4 animate-in slide-in-from-top duration-300">
          <div className="flex flex-col gap-2">
            <button 
              onClick={() => navigateTo('career-quiz')}
              className="w-full text-left py-3 px-4 text-sm font-black text-white bg-[#D4A017] rounded-lg"
            >
              ⭐ QUAL MINHA ESPECIALIDADE?
            </button>
            <button 
              onClick={() => navigateTo('calculators')}
              className="w-full text-left py-3 px-4 text-sm font-black text-[#D4A017] border border-[#D4A017]/20 rounded-lg hover:bg-[#D4A017]/10"
            >
              📊 CALCULADORAS
            </button>
            <button 
              onClick={() => navigateTo('admin')}
              className="w-full text-left py-3 px-4 text-sm font-black text-white/70 border border-white/10 rounded-lg hover:bg-white/5"
            >
              ⚙️ ADMINISTRAÇÃO
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
