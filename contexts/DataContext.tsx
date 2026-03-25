import React, { createContext, useContext, ReactNode } from 'react';
import { useFirebaseData } from '../hooks/useFirebaseData.ts';
import { SimulationInfo, Summary, Question, OsceStation, QuizResult, LabSimulation } from '../types.ts';

// 1. Definimos o formato da nossa "Nuvem de Dados"
interface DataContextType {
  isLoading: boolean;
  isOnline: boolean;
  disciplines: SimulationInfo[];
  summaries: Summary[];
  questions: Question[];
  osceStations: OsceStation[];
  quizResults: QuizResult[];
  labSimulations: LabSimulation[];
}

// 2. Criamos o Contexto vazio
const DataContext = createContext<DataContextType | undefined>(undefined);

// 3. Criamos o Provedor que vai envolver o nosso App
export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const data = useFirebaseData(); // Ele pega os dados do seu Hook do Firebase
  return <DataContext.Provider value={data}>{children}</DataContext.Provider>;
};

// 4. Criamos um Hook super simples para qualquer componente pegar os dados
export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData deve ser usado dentro de um DataProvider');
  }
  return context;
};