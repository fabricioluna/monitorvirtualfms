
import React from 'react';
import { SimulationInfo } from '../types';

interface SimulationCardProps {
  info: SimulationInfo;
  onSelect: (id: string) => void;
}

const SimulationCard: React.FC<SimulationCardProps> = ({ info, onSelect }) => {
  const isActive = info.status === 'active';
  const isComingSoon = info.status === 'coming-soon';

  return (
    <div className={`
      bg-white rounded-xl p-6 border-b-4 transition-all duration-300
      ${isActive ? 'border-[#003366] hover:-translate-y-2 hover:shadow-xl cursor-pointer' : 'border-gray-300 opacity-70 grayscale'}
      flex flex-col items-center text-center
    `}>
      <div className="text-4xl mb-4">{info.icon}</div>
      <h3 className="text-[#003366] font-bold text-lg mb-2">{info.title}</h3>
      <p className="text-gray-600 text-sm mb-4 h-10 overflow-hidden line-clamp-2">
        {info.description}
      </p>
      <div className="mt-auto w-full">
        <p className="text-[11px] font-bold text-gray-400 mb-4 uppercase tracking-tighter">
          {info.meta}
        </p>
        <button
          onClick={() => isActive && onSelect(info.id)}
          disabled={!isActive}
          className={`
            w-full py-3 rounded-lg font-bold transition-colors
            ${isActive 
              ? 'bg-[#003366] text-white hover:bg-[#D4A017] hover:text-[#003366]' 
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'}
          `}
        >
          {isComingSoon ? 'Em Breve' : isActive ? 'Começar Simulado' : 'Bloqueado'}
        </button>
      </div>
    </div>
  );
};

export default SimulationCard;
