import React, { useState } from 'react';
import { SimulationInfo, Summary } from '../types';

interface ShareMaterialViewProps {
  discipline: SimulationInfo;
  onShare: (summary: Omit<Summary, 'id' | 'firebaseId'>) => void;
  onBack: () => void;
}

const ShareMaterialView: React.FC<ShareMaterialViewProps> = ({ discipline, onShare, onBack }) => {
  const [label, setLabel] = useState('');
  const [url, setUrl] = useState('');
  const [type, setType] = useState<'summary' | 'script' | 'other'>('summary');
  const [isFolder, setIsFolder] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!label || !url) return;
    
    onShare({
      disciplineId: discipline.id,
      label,
      url,
      type,
      isFolder,
      date: new Date().toLocaleDateString('pt-BR')
    });
    
    setSubmitted(true);
    setTimeout(() => {
      onBack();
    }, 2000);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-12 animate-in zoom-in duration-500">
      <button 
        onClick={onBack} 
        className="group flex items-center text-[#003366] font-bold mb-8 hover:text-[#D4A017] transition-all"
      >
        <span className="mr-2 transition-transform group-hover:-translate-x-1">←</span> 
        Voltar à Disciplina
      </button>

      <div className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-2xl border border-gray-100">
        <div className="text-center mb-10">
          <div className="text-5xl mb-4">🤝</div>
          <h2 className="text-3xl font-black text-[#003366] uppercase mb-2 tracking-tighter">Contribuir Material</h2>
          <p className="text-[#D4A017] text-[10px] font-black uppercase tracking-[0.3em]">{discipline.title}</p>
        </div>

        {submitted ? (
          <div className="text-center py-10 bg-green-50 rounded-3xl border-2 border-green-100 animate-in zoom-in">
            <div className="text-5xl mb-4">✅</div>
            <h3 className="text-xl font-black text-green-700 uppercase mb-2">Muito Obrigado!</h3>
            <p className="text-sm font-medium text-green-600">Seu material foi adicionado à central da turma.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-2">Título do Material</label>
              <input type="text" value={label} onChange={e => setLabel(e.target.value)} placeholder="Ex: Resumo de Anamnese" className="w-full p-4 bg-gray-50 rounded-2xl font-bold text-sm outline-none border-2 border-transparent focus:border-[#003366] transition-colors" required />
            </div>

            <div>
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-2">Categoria</label>
              <select value={type} onChange={e => setType(e.target.value as any)} className="w-full p-4 bg-gray-50 rounded-2xl font-bold text-sm outline-none border-2 border-transparent focus:border-[#003366] transition-colors">
                <option value="summary">Resumo Teórico</option>
                <option value="script">Roteiro de Aula Prática</option>
                <option value="other">Outro / Material Extra</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-2">Link (Google Drive, Notion, etc)</label>
              <input type="url" value={url} onChange={e => setUrl(e.target.value)} placeholder="https://..." className="w-full p-4 bg-gray-50 rounded-2xl font-bold text-sm outline-none border-2 border-transparent focus:border-[#003366] transition-colors" required />
            </div>

            <div onClick={() => setIsFolder(!isFolder)} className="flex items-center gap-3 p-4 bg-gray-50 rounded-2xl cursor-pointer hover:bg-gray-100 transition-colors border-2 border-transparent">
              <div className={`w-5 h-5 rounded flex items-center justify-center border-2 transition-colors ${isFolder ? 'bg-[#003366] border-[#003366]' : 'bg-white border-gray-300'}`}>
                {isFolder && <span className="text-white text-xs">✓</span>}
              </div>
              <div>
                <p className="text-xs font-black uppercase text-[#003366] tracking-tight">Isto é um link de Pasta</p>
                <p className="text-[9px] font-bold text-gray-400">Marque se o link leva para uma pasta com vários arquivos.</p>
              </div>
            </div>

            <button type="submit" className="w-full bg-[#003366] text-white py-5 rounded-[2rem] font-black uppercase text-sm tracking-[0.2em] shadow-xl hover:bg-[#D4A017] hover:text-[#003366] transition-all mt-4">
              Compartilhar com a Turma
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ShareMaterialView;
