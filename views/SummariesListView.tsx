
import React from 'react';
import { Summary, SimulationInfo } from '../types';

interface SummariesListViewProps {
  disciplineId: string;
  disciplines: SimulationInfo[];
  summaries: Summary[];
  onBack: () => void;
  mode?: 'summary' | 'script';
  onNavigateToShare?: () => void;
}

const SummariesListView: React.FC<SummariesListViewProps> = ({ 
  disciplineId, 
  disciplines, 
  summaries, 
  onBack, 
  mode = 'summary',
  onNavigateToShare
}) => {
  const discipline = disciplines.find(s => s.id === disciplineId);
  const filteredSummaries = summaries.filter(s => s.disciplineId === disciplineId && s.type === mode);

  const openMaterial = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const isScript = mode === 'script';

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 animate-in slide-in-from-right-10 duration-500">
      <div className="flex justify-between items-center mb-12">
        <button 
          onClick={onBack}
          className="group flex items-center text-[#003366] font-bold transition-all hover:text-[#D4A017]"
        >
          <span className="mr-2 transition-transform group-hover:-translate-x-1">←</span> 
          Voltar
        </button>

        <button 
          onClick={() => {
            // Em App.tsx passaremos o setCurrentView('share-material') via closure se necessário, 
            // mas aqui usaremos uma solução mais simples baseada no padrão atual.
            // Para manter a consistência, o botão de compartilhamento principal está na DisciplineView.
            // No entanto, vamos adicionar um convite visual se a lista estiver vazia.
          }}
          className="hidden"
        ></button>
      </div>

      <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h2 className="text-3xl font-black text-[#003366] uppercase tracking-tighter">
            {isScript ? 'Roteiros de Aula Prática' : 'Repositório de Resumos'}
          </h2>
          <div className="flex items-center gap-3 mt-2">
            <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ${isScript ? 'bg-blue-100 text-blue-600' : 'bg-orange-100 text-orange-600'}`}>
              {isScript ? 'Monitoria Prática' : 'Estudo Colaborativo'}
            </span>
            <p className="text-gray-400 text-xs font-black uppercase tracking-widest">
              {discipline?.title}
            </p>
          </div>
        </div>
        
        {/* Incentivo ao compartilhamento */}
        <div className="bg-white px-6 py-4 rounded-2xl border border-dashed border-[#D4A017] flex items-center gap-4">
           <span className="text-xl">💡</span>
           <p className="text-[10px] font-bold text-[#003366] uppercase leading-tight">
             Tem um resumo legal?<br/>
             <span className="text-[#D4A017]">Contribua com a turma!</span>
           </p>
        </div>
      </div>

      <div className="space-y-4">
        {filteredSummaries.length === 0 ? (
          <div className="bg-white p-16 rounded-[2.5rem] border-2 border-dashed border-gray-100 text-center flex flex-col items-center">
             <div className="text-5xl mb-6 opacity-20">📂</div>
             <p className="text-gray-400 font-bold italic mb-6">Nenhum material encontrado para esta disciplina.</p>
             <p className="text-[10px] text-gray-300 uppercase font-black mb-8">O que acha de ser o primeiro a compartilhar?</p>
             <button 
               onClick={onBack} // Voltamos para a DisciplineView onde o botão principal está
               className="text-[#003366] font-black uppercase text-xs border-b-2 border-[#003366] pb-1 hover:text-[#D4A017] hover:border-[#D4A017] transition-all"
              >
                Voltar e Compartilhar Material
              </button>
          </div>
        ) : (
          filteredSummaries.map((summary) => (
            <div 
              key={summary.id}
              className={`bg-white p-6 md:p-8 rounded-3xl shadow-sm border-2 transition-all flex flex-col md:flex-row md:items-center justify-between group gap-4
                ${summary.isFolder ? 'border-[#D4A017]/30 bg-orange-50/10' : 'border-gray-100'}
              `}
            >
              <div className="flex items-center gap-6">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl transition-all
                  ${summary.isFolder ? 'bg-[#D4A017] text-[#003366]' : isScript ? 'bg-blue-50 text-blue-500' : 'bg-red-50 text-red-500'}
                  group-hover:scale-110
                `}>
                  {summary.isFolder ? '📂' : isScript ? '📋' : '📑'}
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-bold text-[#003366] text-lg leading-tight">{summary.label}</h4>
                    {summary.isFolder && (
                      <span className="bg-[#D4A017] text-[#003366] text-[7px] font-black px-2 py-0.5 rounded uppercase tracking-tighter">Pasta / Repositório</span>
                    )}
                  </div>
                  <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">
                    {summary.isFolder ? 'Vários arquivos disponíveis' : 'Arquivo Único'} • Atualizado em {summary.date}
                  </p>
                </div>
              </div>
              <button 
                onClick={() => openMaterial(summary.url)}
                className={`px-8 py-4 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg flex items-center justify-center gap-2
                  ${summary.isFolder ? 'bg-[#D4A017] text-[#003366] hover:bg-[#003366] hover:text-white' : 'bg-[#003366] text-white hover:bg-[#D4A017] hover:text-[#003366]'}
                `}
              >
                {summary.isFolder ? 'Explorar Repositório' : 'Abrir Arquivo'} <span className="text-sm">↗</span>
              </button>
            </div>
          ))
        )}
      </div>

      <div className={`mt-16 p-8 rounded-[2rem] text-white ${isScript ? 'bg-blue-900' : 'bg-[#003366]'}`}>
        <h5 className="font-black text-xs uppercase mb-2">💡 Dica de Estudo</h5>
        <p className="text-sm font-light italic leading-relaxed">
          Itens marcados com <span className="text-[#D4A017] font-bold">Pasta 📂</span> levam você a um diretório completo com vários arquivos. Você pode baixar a pasta inteira para o seu dispositivo se precisar estudar offline.
        </p>
      </div>
    </div>
  );
};

export default SummariesListView;
