
import React, { useState } from 'react';
import { SimulationInfo, OsceStation } from '../types';

interface OsceSetupViewProps {
  discipline: SimulationInfo;
  availableStations: OsceStation[];
  onStart: (station: OsceStation) => void;
  onBack: () => void;
}

const OsceSetupView: React.FC<OsceSetupViewProps> = ({ discipline, availableStations, onStart, onBack }) => {
  const [selectedTheme, setSelectedTheme] = useState<string>('Aleatório');

  const filteredByTheme = selectedTheme === 'Aleatório' 
    ? availableStations 
    : availableStations.filter(s => s.theme === selectedTheme);

  const handleStart = () => {
    if (filteredByTheme.length === 0) {
      alert("Nenhuma estação encontrada para este tema.");
      return;
    }
    const randomStation = filteredByTheme[Math.floor(Math.random() * filteredByTheme.length)];
    onStart(randomStation);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-12 animate-in fade-in zoom-in duration-500">
      <button 
        onClick={onBack} 
        className="group flex items-center text-[#003366] font-bold mb-8 hover:text-[#D4A017] transition-all"
      >
        <span className="mr-2 transition-transform group-hover:-translate-x-1">←</span> 
        Voltar à Disciplina
      </button>
      
      <div className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-2xl border border-gray-100">
        <div className="text-center mb-12">
          <div className="text-5xl mb-4">🩺</div>
          <h2 className="text-3xl font-black text-[#003366] uppercase mb-2 tracking-tighter">
            Simulado OSCE
          </h2>
          <p className="text-[#D4A017] text-[10px] font-black uppercase tracking-[0.3em]">{discipline.title}</p>
        </div>

        <div className="mb-12">
          <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-6 text-center">
            Selecione o Eixo de Treinamento:
          </label>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              onClick={() => setSelectedTheme('Aleatório')}
              className={`p-4 rounded-2xl text-left transition-all border-2 flex justify-between items-center group
                ${selectedTheme === 'Aleatório' 
                  ? 'border-[#D4A017] bg-[#D4A017] text-[#003366]' 
                  : 'border-gray-100 bg-gray-50 text-gray-400 hover:border-gray-200'}
              `}
            >
              <div className="flex flex-col">
                <span className="text-xs font-black uppercase tracking-tight">🎲 Surpresa</span>
                <span className="text-[9px] font-bold opacity-60">Qualquer tema disponível</span>
              </div>
              <span className={`text-[9px] font-black px-2 py-0.5 rounded-full ${selectedTheme === 'Aleatório' ? 'bg-white/40' : 'bg-gray-200'}`}>
                {availableStations.length}
              </span>
            </button>

            {discipline.themes.map(theme => {
              const count = availableStations.filter(s => s.theme === theme).length;
              const isSelected = selectedTheme === theme;

              return (
                <button
                  key={theme}
                  disabled={count === 0}
                  onClick={() => setSelectedTheme(theme)}
                  className={`p-4 rounded-2xl text-left transition-all border-2 flex justify-between items-center group
                    ${isSelected 
                      ? 'border-[#003366] bg-[#003366] text-white' 
                      : count > 0 ? 'border-gray-100 bg-gray-50 text-gray-400 hover:border-gray-200' : 'bg-gray-50 border-gray-100 opacity-40 cursor-not-allowed'}
                  `}
                >
                  <span className="text-xs font-bold uppercase tracking-tight">{theme}</span>
                  <span className={`text-[9px] font-black px-2 py-0.5 rounded-full 
                    ${isSelected ? 'bg-white/20 text-white' : 'bg-gray-200 text-gray-500'}
                  `}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <button
          onClick={handleStart}
          disabled={availableStations.length === 0}
          className="w-full bg-[#003366] text-white py-6 rounded-[2rem] font-black uppercase text-sm tracking-[0.2em] shadow-xl hover:bg-[#D4A017] hover:text-[#003366] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Entrar na Estação 🩺
        </button>

        {availableStations.length === 0 && (
          <p className="text-center text-red-500 text-[10px] font-black uppercase tracking-widest mt-6">
            Atenção: Nenhuma estação OSCE importada no sistema.
          </p>
        )}
      </div>
    </div>
  );
};

export default OsceSetupView;
