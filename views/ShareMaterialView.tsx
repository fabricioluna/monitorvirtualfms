
import React, { useState } from 'react';
import { Summary, SimulationInfo } from '../types';

interface ShareMaterialViewProps {
  discipline: SimulationInfo;
  onShare: (s: Summary) => void;
  onBack: () => void;
}

const ShareMaterialView: React.FC<ShareMaterialViewProps> = ({ discipline, onShare, onBack }) => {
  const [label, setLabel] = useState('');
  const [url, setUrl] = useState('');
  const [type, setType] = useState<'summary' | 'script'>('summary');
  const [isFolder, setIsFolder] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!label || !url) return;

    const newSummary: Summary = {
      id: `shared_${Date.now()}`,
      disciplineId: discipline.id,
      label,
      url,
      date: new Date().toLocaleDateString('pt-BR'),
      type,
      isFolder
    };

    onShare(newSummary);
    alert("Material compartilhado com sucesso! Obrigado por contribuir com a comunidade.");
    onBack();
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-12 animate-in zoom-in duration-500">
      <button 
        onClick={onBack} 
        className="group flex items-center text-[#003366] font-bold mb-8 hover:text-[#D4A017] transition-all"
      >
        <span className="mr-2 transition-transform group-hover:-translate-x-1">←</span> 
        Cancelar
      </button>

      <div className="bg-white rounded-[3rem] p-10 md:p-14 shadow-2xl border border-gray-100">
        <div className="text-center mb-10">
          <div className="text-5xl mb-4">🤝</div>
          <h2 className="text-3xl font-black text-[#003366] uppercase mb-2 tracking-tighter">
            Compartilhar Conteúdo
          </h2>
          <p className="text-[#D4A017] text-[10px] font-black uppercase tracking-[0.3em]">{discipline.title}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-2">Tipo de Material</label>
            <div className="grid grid-cols-2 gap-3">
              <button 
                type="button"
                onClick={() => setType('summary')}
                className={`py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest border-2 transition-all ${type === 'summary' ? 'bg-[#003366] text-white border-[#003366]' : 'bg-gray-50 text-gray-400 border-gray-100'}`}
              >
                📑 Resumo Teórico
              </button>
              <button 
                type="button"
                onClick={() => setType('script')}
                className={`py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest border-2 transition-all ${type === 'script' ? 'bg-[#003366] text-white border-[#003366]' : 'bg-gray-50 text-gray-400 border-gray-100'}`}
              >
                📋 Roteiro Prático
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-2">Legenda / Título</label>
            <input 
              type="text" 
              placeholder="Ex: Resumo de Fisiologia Renal - Loop de Henle"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              className="w-full bg-gray-50 p-5 rounded-2xl border-2 border-transparent focus:border-[#D4A017] outline-none text-[#003366] font-bold transition-all"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-2">Link do Google Drive ou Pasta</label>
            <input 
              type="url" 
              placeholder="https://drive.google.com/..."
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="w-full bg-gray-50 p-5 rounded-2xl border-2 border-transparent focus:border-[#D4A017] outline-none text-[#003366] font-bold transition-all"
              required
            />
          </div>

          <div 
            onClick={() => setIsFolder(!isFolder)}
            className={`flex items-center gap-4 p-5 rounded-2xl border-2 cursor-pointer transition-all ${isFolder ? 'bg-orange-50 border-[#D4A017]' : 'bg-gray-50 border-transparent hover:border-gray-200'}`}
          >
            <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${isFolder ? 'bg-[#003366] border-[#003366]' : 'bg-white border-gray-200'}`}>
              {isFolder && <span className="text-white text-xs">✓</span>}
            </div>
            <div>
              <p className="text-xs font-black text-[#003366] uppercase tracking-widest">Este link é uma PASTA (Repositório)</p>
              <p className="text-[9px] text-gray-400 font-bold uppercase">Marque se o link contiver múltiplos arquivos</p>
            </div>
          </div>

          <button 
            type="submit"
            className="w-full bg-[#003366] text-white py-6 rounded-[2rem] font-black uppercase text-sm tracking-[0.2em] shadow-xl hover:bg-[#D4A017] hover:text-[#003366] transition-all mt-4"
          >
            Publicar Material 🚀
          </button>
        </form>

        <div className="mt-10 p-6 bg-blue-50 rounded-2xl border border-blue-100">
           <p className="text-[10px] text-blue-700 font-bold leading-relaxed italic text-center">
             "O conhecimento só é pleno quando compartilhado. Ao enviar seu resumo, você ajuda dezenas de colegas a superarem desafios acadêmicos."
           </p>
        </div>
      </div>
    </div>
  );
};

export default ShareMaterialView;
