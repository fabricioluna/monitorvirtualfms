
import React from 'react';
import { SimulationInfo } from '../types';

interface ReferencesViewProps {
  discipline: SimulationInfo;
  onBack: () => void;
}

const ReferencesView: React.FC<ReferencesViewProps> = ({ discipline, onBack }) => {
  const refs = discipline.references || [];

  const getIcon = (type: string) => {
    switch (type) {
      case 'book': return '📖';
      case 'article': return '📄';
      case 'link': return '🔗';
      case 'video': return '🎥';
      default: return '📎';
    }
  };

  const getLabel = (type: string) => {
    switch (type) {
      case 'book': return 'Livro-Texto';
      case 'article': return 'Artigo/Diretriz';
      case 'link': return 'Link Externo';
      case 'video': return 'Vídeo-Aula';
      default: return 'Material';
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 animate-in slide-in-from-right-10 duration-500">
      <button 
        onClick={onBack}
        className="group flex items-center text-[#003366] font-bold mb-12 transition-all hover:text-[#D4A017]"
      >
        <span className="mr-2 transition-transform group-hover:-translate-x-1">←</span> 
        Voltar para {discipline.id.toUpperCase()}
      </button>

      <div className="mb-12">
        <h2 className="text-3xl font-black text-[#003366] uppercase tracking-tighter">
          Referências e Bibliografia
        </h2>
        <p className="text-gray-400 text-xs font-black uppercase tracking-widest mt-2">
          Fontes recomendadas para {discipline.title}
        </p>
      </div>

      <div className="grid gap-6">
        {refs.length === 0 ? (
          <div className="bg-white p-16 rounded-[2.5rem] border-2 border-dashed border-gray-100 text-center">
            <p className="text-gray-400 font-bold italic">Nenhum material de referência cadastrado ainda.</p>
          </div>
        ) : (
          refs.map((ref) => (
            <div 
              key={ref.id}
              className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 hover:shadow-md transition-all flex items-center justify-between group gap-6"
            >
              <div className="flex items-center gap-6">
                <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center text-3xl group-hover:scale-110 transition-transform">
                  {getIcon(ref.type)}
                </div>
                <div>
                  <span className="text-[9px] font-black uppercase tracking-widest text-[#D4A017] mb-1 block">
                    {getLabel(ref.type)}
                  </span>
                  <h4 className="font-bold text-[#003366] text-lg leading-tight">{ref.title}</h4>
                  {ref.author && (
                    <p className="text-xs text-gray-500 font-medium mt-1">Autor: {ref.author}</p>
                  )}
                </div>
              </div>
              
              {ref.url && (
                <a 
                  href={ref.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="bg-[#003366] text-white px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-[#D4A017] hover:text-[#003366] transition-all shadow-lg whitespace-nowrap"
                >
                  Acessar Link
                </a>
              )}
            </div>
          ))
        )}
      </div>

      <section className="mt-16 bg-[#003366] p-10 rounded-[2.5rem] shadow-xl text-white">
        <h4 className="font-black text-xl mb-4 tracking-tight uppercase">Nota da Monitoria</h4>
        <p className="text-blue-100 text-sm leading-relaxed font-light">
          A bibliografia listada acima segue as diretrizes do plano de curso da FMS. Recomendamos que o estudo comece sempre pelos livros-texto base antes de consultar resumos ou simulados.
        </p>
      </section>
    </div>
  );
};

export default ReferencesView;
