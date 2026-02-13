
import React, { useState, useMemo } from 'react';
import { SimulationInfo, Question } from '../types';

interface QuizSetupViewProps {
  discipline: SimulationInfo;
  availableQuestions: Question[];
  onStart: (filteredQuestions: Question[]) => void;
  onBack: () => void;
  isPracticalMode?: boolean; 
}

const QuizSetupView: React.FC<QuizSetupViewProps> = ({ discipline, availableQuestions, onStart, onBack, isPracticalMode = false }) => {
  const [selectedThemes, setSelectedThemes] = useState<string[]>([]);
  const [quantity, setQuantity] = useState(10);

  const totalAvailableInSelectedThemes = useMemo(() => {
    return availableQuestions.filter(q => 
      q.disciplineId === discipline.id && 
      selectedThemes.includes(q.theme) &&
      (isPracticalMode ? q.isPractical === true : q.isPractical !== true)
    ).length;
  }, [availableQuestions, discipline.id, selectedThemes, isPracticalMode]);

  const toggleTheme = (theme: string) => {
    setSelectedThemes(prev => 
      prev.includes(theme) ? prev.filter(t => t !== theme) : [...prev, theme]
    );
  };

  const handleQuantityChange = (val: number) => {
    if (isNaN(val)) return;
    const clampedVal = Math.max(0, Math.min(val, totalAvailableInSelectedThemes));
    setQuantity(clampedVal);
  };

  const handleStart = () => {
    if (selectedThemes.length === 0) {
      alert("Por favor, selecione ao menos um tema/eixo.");
      return;
    }

    if (quantity < 1) {
      alert("A quantidade mínima de questões é 1.");
      return;
    }

    let filtered = availableQuestions.filter(q => 
      q.disciplineId === discipline.id && 
      selectedThemes.includes(q.theme) &&
      (isPracticalMode ? q.isPractical === true : q.isPractical !== true)
    );
    
    filtered = [...filtered].sort(() => Math.random() - 0.5).slice(0, quantity);
    onStart(filtered);
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
        <div className="text-center mb-10">
          <div className="text-5xl mb-4">{isPracticalMode ? '🔬' : discipline.icon}</div>
          <h2 className="text-3xl font-black text-[#003366] uppercase mb-2 tracking-tighter">
            {isPracticalMode ? 'Simulado Prático' : 'Simulado Teórico'}
          </h2>
          <p className="text-[#D4A017] text-[10px] font-black uppercase tracking-[0.3em]">{discipline.title}</p>
        </div>

        <div className="mb-12">
          <div className="flex justify-between items-center mb-6">
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Eixos Temáticos</label>
            <div className="flex gap-4">
               <button onClick={() => setSelectedThemes(discipline.themes)} className="text-[9px] font-bold text-[#003366] uppercase underline hover:text-[#D4A017] transition-colors">Todos</button>
               <button onClick={() => setSelectedThemes([])} className="text-[9px] font-bold text-red-500 uppercase underline hover:text-red-700 transition-colors">Nenhum</button>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {discipline.themes.map(theme => {
              const count = availableQuestions.filter(q => q.disciplineId === discipline.id && q.theme === theme && (isPracticalMode ? q.isPractical === true : q.isPractical !== true)).length;
              const isSelected = selectedThemes.includes(theme);
              return (
                <button
                  key={theme}
                  onClick={() => toggleTheme(theme)}
                  className={`p-4 rounded-2xl text-left transition-all border-2 flex justify-between items-center group
                    ${isSelected ? 'border-[#003366] bg-[#003366] text-white shadow-lg' : 'border-gray-100 bg-gray-50 text-gray-400 hover:border-gray-200'}
                  `}
                >
                  <span className="text-xs font-bold uppercase tracking-tight">{theme}</span>
                  <span className={`text-[9px] font-black px-2 py-0.5 rounded-full ${isSelected ? 'bg-white/20 text-white' : 'bg-gray-200 text-gray-500'}`}>{count} Q</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="mb-12 p-6 bg-gray-50 rounded-3xl border border-gray-100">
          <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-4 text-center">Quantidade de Questões</label>
          <div className="flex items-center justify-center gap-6">
            <button onClick={() => handleQuantityChange(quantity - 1)} className="w-12 h-12 bg-white rounded-xl border border-gray-200 text-[#003366] font-black flex items-center justify-center hover:bg-[#D4A017] transition-colors">-</button>
            <div className="relative">
              <input type="number" value={quantity} onChange={(e) => handleQuantityChange(parseInt(e.target.value))} className="w-24 bg-white p-4 rounded-2xl border-2 border-[#003366] outline-none text-[#003366] font-black text-center text-2xl" min="1" max={totalAvailableInSelectedThemes} />
              <span className="absolute -bottom-6 left-0 right-0 text-center text-[9px] font-bold text-gray-400 uppercase">Máx: {totalAvailableInSelectedThemes}</span>
            </div>
            <button onClick={() => handleQuantityChange(quantity + 1)} className="w-12 h-12 bg-white rounded-xl border border-gray-200 text-[#003366] font-black flex items-center justify-center hover:bg-[#D4A017] transition-colors">+</button>
          </div>
        </div>

        <button
          onClick={handleStart}
          disabled={selectedThemes.length === 0 || totalAvailableInSelectedThemes === 0}
          className={`w-full py-6 rounded-[2rem] font-black uppercase text-sm tracking-[0.2em] shadow-xl transition-all
            ${selectedThemes.length > 0 && totalAvailableInSelectedThemes > 0
              ? 'bg-[#003366] text-white hover:bg-[#D4A017] hover:text-[#003366]' 
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'}
          `}
        >
          {selectedThemes.length === 0 ? 'Selecione os Temas' : `Gerar Simulado (${quantity})`}
        </button>
      </div>
    </div>
  );
};

export default QuizSetupView;
