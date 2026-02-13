
import React from 'react';
import { Summary, SimulationInfo } from '../types';

interface DisciplineViewProps {
  disciplineId: string;
  disciplines: SimulationInfo[];
  summaries: Summary[];
  onBack: () => void;
  onSelectOption: (type: 'quiz-setup' | 'summaries-list' | 'practice-quiz-setup' | 'scripts-list' | 'osce-setup' | 'references-view' | 'share-material') => void;
}

const DisciplineView: React.FC<DisciplineViewProps> = ({ disciplineId, disciplines, summaries, onBack, onSelectOption }) => {
  const discipline = disciplines.find(s => s.id === disciplineId);
  const disciplineSummaries = summaries.filter(s => s.disciplineId === disciplineId && s.type === 'summary');
  const disciplineScripts = summaries.filter(s => s.disciplineId === disciplineId && s.type === 'script');
  
  const hasSummaries = disciplineSummaries.length > 0;
  const hasScripts = disciplineScripts.length > 0;
  
  const isUCIV = disciplineId === 'uciv';
  const isHM2 = disciplineId === 'hm2';

  if (!discipline) return null;

  return (
    <div className="max-w-6xl mx-auto px-4 py-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-start mb-12">
        <button 
          onClick={onBack}
          className="group flex items-center text-[#003366] font-bold transition-all hover:text-[#D4A017]"
        >
          <span className="mr-2 transition-transform group-hover:-translate-x-1">←</span> 
          Voltar
        </button>

        <button 
          onClick={() => onSelectOption('share-material')}
          className="bg-[#D4A017] text-[#003366] px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg hover:scale-105 transition-all flex items-center gap-2"
        >
          <span>🤝</span> Compartilhar Material
        </button>
      </div>

      <div className="text-center mb-16">
        <div className="text-6xl mb-6">{discipline.icon}</div>
        <h2 className="text-4xl font-black text-[#003366] mb-4 uppercase tracking-tighter">
          {discipline.title}
        </h2>
        <p className="text-gray-500 max-w-lg mx-auto leading-relaxed">
          Portal de estudos de {discipline.id.toUpperCase()}. O que deseja fazer hoje?
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {/* Simulados Teóricos */}
        <div 
          onClick={() => onSelectOption('quiz-setup')}
          className="bg-white rounded-[2rem] p-8 border-2 border-transparent hover:border-[#003366] shadow-lg cursor-pointer transition-all hover:-translate-y-2 group"
        >
          <div className="w-12 h-12 bg-[#003366] text-white rounded-xl flex items-center justify-center text-2xl mb-6 group-hover:rotate-6 transition-transform">
            📝
          </div>
          <h3 className="text-xl font-black text-[#003366] mb-3">Simulados Teóricos</h3>
          <p className="text-gray-500 text-xs leading-relaxed mb-6">Questões baseadas no Plano de Curso FMS e feedback imediato.</p>
          <span className="inline-block bg-[#003366] text-white px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest">Configurar</span>
        </div>

        {/* Referências Bibliográficas */}
        <div 
          onClick={() => onSelectOption('references-view')}
          className="bg-white rounded-[2rem] p-8 border-2 border-[#D4A017] shadow-lg cursor-pointer transition-all hover:-translate-y-2 group relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 bg-[#D4A017] text-[#003366] text-[8px] font-black px-4 py-1 uppercase tracking-widest">Acadêmico</div>
          <div className="w-12 h-12 bg-[#D4A017] text-[#003366] rounded-xl flex items-center justify-center text-2xl mb-6 group-hover:scale-110 transition-transform">
            📚
          </div>
          <h3 className="text-xl font-black text-[#003366] mb-3">Referências e Links</h3>
          <p className="text-gray-500 text-xs leading-relaxed mb-6">Livros-texto, artigos e materiais de consulta recomendados pela monitoria.</p>
          <span className="inline-block bg-[#D4A017] text-[#003366] px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest">Consultar</span>
        </div>

        {/* Simulado OSCE - Exclusivo HM2 */}
        {isHM2 && (
          <div 
            onClick={() => onSelectOption('osce-setup')}
            className="bg-white rounded-[2rem] p-8 border-2 border-transparent hover:border-[#003366] shadow-lg cursor-pointer transition-all hover:-translate-y-2 group"
          >
            <div className="w-12 h-12 bg-[#003366] text-white rounded-xl flex items-center justify-center text-2xl mb-6 group-hover:scale-110 transition-transform">
              🩺
            </div>
            <h3 className="text-xl font-black text-[#003366] mb-3">Simulado OSCE</h3>
            <p className="text-gray-500 text-xs leading-relaxed mb-6">Treine anamnese e exame físico com estações clínicas FMS.</p>
            <span className="inline-block bg-[#003366] text-white px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest">Iniciar</span>
          </div>
        )}

        {/* Resumos */}
        <div 
          onClick={() => hasSummaries && onSelectOption('summaries-list')}
          className={`rounded-[2rem] p-8 border-2 transition-all flex flex-col ${hasSummaries ? 'bg-white shadow-lg cursor-pointer hover:-translate-y-2 hover:border-orange-200' : 'bg-gray-100 opacity-50 cursor-not-allowed border-dashed'}`}
        >
          <div className="w-12 h-12 bg-orange-50 text-orange-600 rounded-xl flex items-center justify-center text-2xl mb-6">📁</div>
          <h3 className="text-xl font-black text-[#003366] mb-3">Resumos</h3>
          <p className="text-gray-500 text-xs leading-relaxed mb-6">Materiais de revisão teórica doados por outros alunos.</p>
          <div className="mt-auto flex justify-between items-center">
            <span className="text-[10px] font-black uppercase text-orange-600">{hasSummaries ? 'Acessar' : 'Sem materiais'}</span>
            {!hasSummaries && (
              <button onClick={(e) => { e.stopPropagation(); onSelectOption('share-material'); }} className="text-[9px] font-bold underline text-[#003366]">Seja o primeiro a enviar!</button>
            )}
          </div>
        </div>

        {/* Roteiros Práticos - Exclusivo UCIV */}
        {isUCIV && (
          <div 
            onClick={() => hasScripts && onSelectOption('scripts-list')}
            className={`rounded-[2rem] p-8 border-2 transition-all flex flex-col ${hasScripts ? 'bg-white shadow-lg cursor-pointer hover:-translate-y-2 hover:border-blue-200' : 'bg-gray-100 opacity-50 cursor-not-allowed border-dashed'}`}
          >
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center text-2xl mb-6">📋</div>
            <h3 className="text-xl font-black text-[#003366] mb-3">Roteiros Práticos</h3>
            <p className="text-gray-500 text-xs leading-relaxed mb-6">Guia para aulas práticas e monitoria em laboratório.</p>
            <span className="mt-auto inline-block text-[10px] font-black uppercase text-blue-600">{hasScripts ? 'Ver Roteiros' : 'Em breve'}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default DisciplineView;
