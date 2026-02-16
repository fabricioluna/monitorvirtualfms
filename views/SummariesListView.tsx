import React from 'react';
import { Summary, SimulationInfo } from '../types';

interface SummariesListViewProps {
  disciplineId: string;
  disciplines: SimulationInfo[];
  summaries: Summary[];
  onBack: () => void;
}

const SummariesListView: React.FC<SummariesListViewProps> = ({ disciplineId, disciplines, summaries, onBack }) => {
  const discipline = disciplines.find(d => d.id === disciplineId);
  const disciplineSummaries = summaries.filter(s => s.disciplineId === disciplineId);

  // Divide os ficheiros por tipo
  const resumos = disciplineSummaries.filter(s => s.type === 'summary');
  const roteiros = disciplineSummaries.filter(s => s.type === 'script');
  const outros = disciplineSummaries.filter(s => s.type === 'other' || !s.type); // Antigos ficam em "outros" se não tiverem tipo

  if (!discipline) return null;

  // Bloco reutilizável para desenhar cada secção
  const renderList = (list: Summary[], emptyMsg: string, icon: string, title: string) => (
    <div className="mb-12">
      <h3 className="text-lg font-black text-[#003366] uppercase mb-4 flex items-center gap-2 border-b border-gray-100 pb-3">
        <span>{icon}</span> {title} 
        <span className="bg-[#003366] text-white text-[10px] px-3 py-1 rounded-full ml-2 shadow-sm">{list.length}</span>
      </h3>
      
      {list.length === 0 ? (
        <div className="bg-gray-50 p-6 rounded-2xl border-2 border-dashed border-gray-200 text-center">
           <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">{emptyMsg}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {list.map(s => (
            <a 
              key={s.id} 
              href={s.url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="p-5 bg-gray-50 hover:bg-white rounded-2xl border-2 border-transparent hover:border-[#D4A017] transition-all flex items-center justify-between group shadow-sm hover:shadow-md"
            >
              <div className="flex items-center gap-4">
                <div className="text-3xl group-hover:scale-110 transition-transform">{s.isFolder ? '📁' : '📄'}</div>
                <div>
                  <h4 className="font-bold text-[#003366] text-sm group-hover:text-[#D4A017] transition-colors leading-tight">{s.label}</h4>
                  <p className="text-[9px] font-black uppercase tracking-widest text-gray-400 mt-1">Add: {s.date}</p>
                </div>
              </div>
              <div className="text-[#D4A017] opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all font-black text-xl">↗</div>
            </a>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto px-4 py-12 animate-in fade-in slide-in-from-bottom-8 duration-500">
      <button 
        onClick={onBack} 
        className="group flex items-center text-[#003366] font-bold mb-8 hover:text-[#D4A017] transition-all"
      >
        <span className="mr-2 transition-transform group-hover:-translate-x-1">←</span> 
        Voltar à Disciplina
      </button>

      <div className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-2xl border border-gray-100">
        <div className="text-center mb-12">
          <div className="text-5xl mb-4">📂</div>
          <h2 className="text-3xl font-black text-[#003366] uppercase mb-2 tracking-tighter">Central de Materiais</h2>
          <p className="text-[#D4A017] text-[10px] font-black uppercase tracking-[0.3em]">{discipline.title}</p>
        </div>

        {renderList(resumos, "Nenhum resumo adicionado", "📑", "Resumos Teóricos")}
        {renderList(roteiros, "Nenhum roteiro adicionado", "📝", "Roteiros de Prática")}
        {renderList(outros, "Nenhum material extra adicionado", "📎", "Materiais Extras")}
      </div>
    </div>
  );
};

export default SummariesListView;
