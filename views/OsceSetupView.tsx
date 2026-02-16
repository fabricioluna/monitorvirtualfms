import React from 'react';
import { SimulationInfo, OsceStation } from '../types';

interface OsceSetupViewProps {
  discipline: SimulationInfo;
  availableStations: OsceStation[];
  onStart: (station: OsceStation) => void;
  onBack: () => void;
}

const OsceSetupView: React.FC<OsceSetupViewProps> = ({ discipline, availableStations, onStart, onBack }) => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 animate-in fade-in zoom-in duration-500">
      <button 
        onClick={onBack} 
        className="group flex items-center text-[#003366] font-bold mb-8 hover:text-[#D4A017] transition-all"
      >
        <span className="mr-2 transition-transform group-hover:-translate-x-1">←</span> 
        Voltar à Disciplina
      </button>
      
      <div className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-2xl border border-gray-100">
        <div className="text-center mb-10 border-b pb-8">
          <div className="text-5xl mb-4">🩺</div>
          <h2 className="text-3xl font-black text-[#003366] uppercase mb-2 tracking-tighter">
            Laboratório de Habilidades (OSCE)
          </h2>
          <p className="text-[#D4A017] text-[10px] font-black uppercase tracking-[0.3em]">{discipline.title}</p>
        </div>

        {availableStations.length === 0 ? (
           <div className="text-center py-10 bg-gray-50 rounded-[2rem] border-2 border-dashed border-gray-200">
              <span className="text-4xl opacity-20 block mb-4">📁</span>
              <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">Nenhuma estação clínica disponível no momento.</p>
           </div>
        ) : (
          <div>
            <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-6 text-center">
              Selecione o Cenário Clínico para Iniciar:
            </label>
            
            <div className="grid grid-cols-1 gap-4">
              {availableStations.map((station, index) => (
                <button
                  key={station.id}
                  onClick={() => onStart(station)}
                  className="p-6 bg-gray-50 hover:bg-white rounded-[1.5rem] border-2 border-transparent hover:border-[#D4A017] transition-all flex items-center justify-between group shadow-sm hover:shadow-lg"
                >
                  <div className="flex items-center gap-6 text-left">
                    <div className="w-12 h-12 rounded-full bg-[#003366] text-white flex items-center justify-center font-black text-sm group-hover:scale-110 transition-transform">
                      {index + 1}
                    </div>
                    <div>
                      <h3 className="text-lg font-black text-[#003366] mb-1 group-hover:text-[#D4A017] transition-colors">
                        {station.title}
                      </h3>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                        {station.theme || 'Estação Prática'}
                      </p>
                    </div>
                  </div>
                  <div className="text-[#D4A017] font-black text-xl opacity-0 group-hover:opacity-100 group-hover:translate-x-2 transition-all">
                    →
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OsceSetupView;
