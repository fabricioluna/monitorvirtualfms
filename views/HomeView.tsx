
import React from 'react';
import DisciplineCard from '../components/DisciplineCard';
import { SimulationInfo } from '../types';

interface HomeViewProps {
  disciplines: SimulationInfo[];
  onSelectDiscipline: (id: string) => void;
}

const HomeView: React.FC<HomeViewProps> = ({ disciplines, onSelectDiscipline }) => {
  const activeDisciplines = disciplines.filter(s => s.status === 'active' || s.status === 'coming-soon');
  const otherDisciplines = disciplines.filter(s => s.status === 'locked');

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-16 border-b border-gray-200 pb-10 gap-6">
        <div className="text-left">
          <h2 className="text-4xl font-black text-[#003366] uppercase tracking-tighter">
            Portal Acadêmico
          </h2>
          <p className="text-gray-500 text-sm mt-2 max-w-xl">
            Suporte para o 2º Período de Medicina. Simulados, resumos e calculadoras.
          </p>
        </div>
        <div className="flex items-center space-x-6 bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
          <div className="text-center">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Carga Semestral</p>
            <p className="text-xl font-black text-[#003366]">610h</p>
          </div>
          <div className="h-10 w-px bg-gray-200"></div>
          <div className="text-center px-2">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Semestre</p>
            <p className="text-xs font-black text-[#D4A017] uppercase italic">2026.1</p>
          </div>
        </div>
      </div>

      <div className="mb-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {activeDisciplines.map(disc => (
            <DisciplineCard key={disc.id} info={disc} onSelect={onSelectDiscipline} />
          ))}
        </div>
      </div>

      {otherDisciplines.length > 0 && (
        <div className="mt-20">
          <h3 className="text-xs font-black text-gray-400 uppercase tracking-[0.3em] mb-8">Conteúdo Longitudinal</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {otherDisciplines.map(disc => (
              <DisciplineCard key={disc.id} info={disc} onSelect={() => {}} />
            ))}
          </div>
        </div>
      )}

      <section className="bg-[#003366] p-10 rounded-[2.5rem] shadow-2xl mt-20 text-white relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 text-9xl opacity-10">🌵</div>
        <div className="relative z-10">
          <h4 className="font-black text-2xl mb-4 tracking-tight uppercase italic">Monitoria <span className="text-[#D4A017]">Virtual</span></h4>
          <p className="text-blue-100 text-sm leading-relaxed max-w-3xl font-light">
            O projeto <strong>Monitoria Virtual</strong> foca na <strong>prática deliberada</strong>. Recomendamos que você utilize os simulados como ferramenta de diagnóstico: identifique suas lacunas de conhecimento e use os <strong>resumos compartilhados</strong> para reforçar o aprendizado colaborativo.
          </p>
        </div>
      </section>
    </main>
  );
};

export default HomeView;
