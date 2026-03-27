import React from 'react';
import { SimulationInfo, Summary } from '../types';
import { Lock } from 'lucide-react'; // <-- NOVO: Ícone para funcionalidades bloqueadas

interface DisciplineViewProps {
  disciplineId: string;
  disciplines: SimulationInfo[];
  summaries: Summary[];
  onBack: () => void;
  onSelectOption: (type: string) => void;
}

const DisciplineView: React.FC<DisciplineViewProps> = ({ disciplineId, disciplines, summaries, onBack, onSelectOption }) => {
  const discipline = disciplines.find(d => d.id === disciplineId);
  if (!discipline) return null;

  // IDENTIFICADOR AUTOMÁTICO DE UC
  const isUC = disciplineId.toLowerCase().startsWith('uc');

  // VERIFICA QUAIS BOTÕES ESTÃO BLOQUEADOS NO FIREBASE
  const locked = discipline.lockedFeatures || [];
  const isMaterialsLocked = locked.includes('materials');
  const isReferencesLocked = locked.includes('references');
  const isQuizLocked = locked.includes('quiz');
  const isLabOsceLocked = locked.includes('lab_osce');
  const isAILocked = locked.includes('ai');

  const handleAction = (featureId: string, action: string) => {
    if (locked.includes(featureId)) {
      alert("Esta funcionalidade está temporariamente bloqueada pela administração.");
    } else {
      onSelectOption(action);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 animate-in fade-in slide-in-from-bottom-8 duration-700 pb-32">
      <button 
        onClick={onBack} 
        className="group flex items-center text-[#003366] font-bold mb-8 hover:text-[#D4A017] transition-all"
      >
        <span className="mr-2 transition-transform group-hover:-translate-x-1">←</span> 
        Voltar ao Início
      </button>

      <div className="bg-white rounded-[3rem] p-8 md:p-14 shadow-2xl border border-gray-100 mb-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#f4f7f6] rounded-full -mr-20 -mt-20 opacity-50"></div>
        <div className="flex flex-col md:flex-row gap-8 items-center md:items-start relative z-10">
          
          <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center text-6xl shadow-xl border-4 border-[#003366] shrink-0">
            {discipline.icon}
          </div>

          <div className="text-center md:text-left">
            <span className="bg-green-100 text-green-700 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest mb-4 inline-block shadow-sm">
              Módulo Liberado
            </span>
            <h1 className="text-4xl md:text-5xl font-black text-[#003366] mb-4 tracking-tighter leading-tight">
              {discipline.title}
            </h1>
            <p className="text-gray-600 text-lg leading-relaxed max-w-2xl font-medium">
              {discipline.description}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        
        {/* BOTÃO TEÓRICO */}
        <button 
          onClick={() => handleAction('quiz', 'quiz-setup')} 
          className={`p-6 md:p-8 rounded-[2rem] text-left transition-all group border-2 relative overflow-hidden ${
            isQuizLocked 
              ? 'bg-gray-50 border-gray-200 opacity-70 grayscale cursor-not-allowed' 
              : 'bg-white border-transparent hover:border-[#D4A017] hover:shadow-xl'
          }`}
        >
          <div className="flex items-center justify-between mb-4">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl transition-colors ${
              isQuizLocked ? 'bg-gray-200 text-gray-400' : 'bg-blue-50 text-[#003366] group-hover:bg-[#003366] group-hover:text-white'
            }`}>📝</div>
            <div className={`transition-colors ${isQuizLocked ? 'text-gray-300' : 'text-gray-300 group-hover:text-[#D4A017]'}`}>→</div>
          </div>
          <h3 className={`text-xl font-black mb-2 uppercase tracking-tight ${isQuizLocked ? 'text-gray-400' : 'text-[#003366]'}`}>Simulado Teórico</h3>
          <p className={`text-xs font-medium ${isQuizLocked ? 'text-gray-400' : 'text-gray-500'}`}>Avalie seus conhecimentos com questões de múltipla escolha.</p>
          {isQuizLocked && (
            <div className="absolute top-6 right-6 bg-red-500/90 text-white px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg flex items-center gap-1 z-10">
              <Lock size={12}/> Bloqueado
            </div>
          )}
        </button>

        {/* BOTÃO PRÁTICO INTELIGENTE (LABORATÓRIO vs OSCE) */}
        <button 
          onClick={() => handleAction('lab_osce', isUC ? 'lab-list' : 'osce-setup')} 
          className={`p-6 md:p-8 rounded-[2rem] text-left transition-all group border-2 relative overflow-hidden ${
            isLabOsceLocked 
              ? 'bg-gray-50 border-gray-200 opacity-70 grayscale cursor-not-allowed' 
              : 'bg-white border-transparent hover:border-[#D4A017] hover:shadow-xl'
          }`}
        >
          <div className="flex items-center justify-between mb-4">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl transition-colors ${
              isLabOsceLocked ? 'bg-gray-200 text-gray-400' : 'bg-blue-50 text-[#003366] group-hover:bg-[#003366] group-hover:text-white'
            }`}>
              {isUC ? '🔬' : '🩺'}
            </div>
            <div className={`transition-colors ${isLabOsceLocked ? 'text-gray-300' : 'text-gray-300 group-hover:text-[#D4A017]'}`}>→</div>
          </div>
          <h3 className={`text-xl font-black mb-2 uppercase tracking-tight ${isLabOsceLocked ? 'text-gray-400' : 'text-[#003366]'}`}>
            {isUC ? 'Laboratório Virtual' : 'Simulado Prático (OSCE)'}
          </h3>
          <p className={`text-xs font-medium ${isLabOsceLocked ? 'text-gray-400' : 'text-gray-500'}`}>
            {isUC 
              ? 'Treine a identificação visual de lâminas histológicas e peças anatômicas.' 
              : 'Treine o passo a passo de exames clínicos de forma gamificada.'}
          </p>
          {isLabOsceLocked && (
            <div className="absolute top-6 right-6 bg-red-500/90 text-white px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg flex items-center gap-1 z-10">
              <Lock size={12}/> Bloqueado
            </div>
          )}
        </button>

        {/* PACIENTE VIRTUAL (HM2 ou HM1) */}
        {(disciplineId === 'hm2' || disciplineId === 'hm1') && (
          <div className="md:col-span-2">
            <button 
              onClick={() => handleAction('ai', 'osce-ai-setup')} 
              className={`p-6 md:p-8 rounded-[2rem] text-left transition-all relative overflow-hidden group w-full ${
                isAILocked 
                  ? 'bg-gray-50 border-2 border-gray-200 opacity-70 grayscale cursor-not-allowed' 
                  : 'bg-gradient-to-br from-[#003366] to-[#001f3f] text-white hover:scale-105 shadow-xl border-none'
              }`}
            >
              {!isAILocked && <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-5 rounded-full -mr-10 -mt-10 blur-2xl"></div>}
              <div className="flex items-center justify-between mb-4 relative z-10">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-3xl transition-all ${
                  isAILocked ? 'bg-gray-200 text-gray-400' : 'bg-white/10 group-hover:bg-[#D4A017] group-hover:text-[#003366]'
                }`}>🤖</div>
                <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center font-black ${
                  isAILocked ? 'border-gray-300 text-gray-300' : 'border-white/20 group-hover:border-[#D4A017] group-hover:text-[#D4A017]'
                }`}>→</div>
              </div>
              <h3 className={`text-xl font-black uppercase tracking-tight mb-2 relative z-10 ${isAILocked ? 'text-gray-400' : 'text-[#D4A017]'}`}>Paciente Virtual por IA</h3>
              <p className={`text-xs font-medium leading-relaxed relative z-10 ${isAILocked ? 'text-gray-400' : 'opacity-90'}`}>Pratique sua anamnese conversando livremente pelo chat com um paciente simulado pela nossa Inteligência Artificial.</p>
              {isAILocked && (
                <div className="absolute top-6 right-6 bg-red-500/90 text-white px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg flex items-center gap-1 z-10">
                  <Lock size={12}/> Bloqueado
                </div>
              )}
            </button>
          </div>
        )}

        {/* CENTRAL DE MATERIAIS */}
        <button 
          onClick={() => handleAction('materials', 'summaries-list')} 
          className={`p-6 md:p-8 rounded-[2rem] text-left transition-all group border-2 relative overflow-hidden ${
            isMaterialsLocked 
              ? 'bg-gray-50 border-gray-200 opacity-70 grayscale cursor-not-allowed' 
              : 'bg-white border-transparent hover:border-[#D4A017] hover:shadow-xl'
          }`}
        >
          <div className="flex items-center justify-between mb-4">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl transition-colors ${
              isMaterialsLocked ? 'bg-gray-200 text-gray-400' : 'bg-blue-50 text-[#003366] group-hover:bg-[#003366] group-hover:text-white'
            }`}>📂</div>
            <div className={`transition-colors ${isMaterialsLocked ? 'text-gray-300' : 'text-gray-300 group-hover:text-[#D4A017]'}`}>→</div>
          </div>
          <h3 className={`text-xl font-black text-[#003366] mb-2 uppercase tracking-tight ${isMaterialsLocked ? 'text-gray-400' : ''}`}>Central de Materiais</h3>
          <p className={`text-xs text-gray-500 font-medium ${isMaterialsLocked ? 'text-gray-400' : ''}`}>Acesse resumos, roteiros de aulas práticas e materiais extras da turma.</p>
          {isMaterialsLocked && (
            <div className="absolute top-6 right-6 bg-red-500/90 text-white px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg flex items-center gap-1 z-10">
              <Lock size={12}/> Bloqueado
            </div>
          )}
        </button>

        {/* REFERÊNCIAS */}
        <button 
          onClick={() => handleAction('references', 'references-view')} 
          className={`p-6 md:p-8 rounded-[2rem] text-left transition-all group border-2 relative overflow-hidden ${
            isReferencesLocked 
              ? 'bg-gray-50 border-gray-200 opacity-70 grayscale cursor-not-allowed' 
              : 'bg-white border-transparent hover:border-[#D4A017] hover:shadow-xl'
          }`}
        >
          <div className="flex items-center justify-between mb-4">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl transition-colors ${
              isReferencesLocked ? 'bg-gray-200 text-gray-400' : 'bg-blue-50 text-[#003366] group-hover:bg-[#003366] group-hover:text-white'
            }`}>📚</div>
            <div className={`transition-colors ${isReferencesLocked ? 'text-gray-300' : 'text-gray-300 group-hover:text-[#D4A017]'}`}>→</div>
          </div>
          <h3 className={`text-xl font-black text-[#003366] mb-2 uppercase tracking-tight ${isReferencesLocked ? 'text-gray-400' : ''}`}>Referências Bibliográficas</h3>
          <p className={`text-xs text-gray-500 font-medium ${isReferencesLocked ? 'text-gray-400' : ''}`}>Links diretos para os livros oficiais na biblioteca da faculdade.</p>
          {isReferencesLocked && (
            <div className="absolute top-6 right-6 bg-red-500/90 text-white px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg flex items-center gap-1 z-10">
              <Lock size={12}/> Bloqueado
            </div>
          )}
        </button>
      </div>
    </div>
  );
};

export default DisciplineView;