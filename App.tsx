
import React, { useState, useEffect } from 'react';
import Header from './components/Header.tsx';
import HomeView from './views/HomeView.tsx';
import DisciplineView from './views/DisciplineView.tsx';
import QuizSetupView from './views/QuizSetupView.tsx';
import QuizView from './views/QuizView.tsx';
import AdminView from './views/AdminView.tsx';
import SummariesListView from './views/SummariesListView.tsx';
import OsceView from './views/OsceView.tsx';
import OsceSetupView from './views/OsceSetupView.tsx';
import CalculatorsView from './views/CalculatorsView.tsx';
import CareerQuiz from './components/CareerQuiz.tsx';
import ReferencesView from './views/ReferencesView.tsx';
import ShareMaterialView from './views/ShareMaterialView.tsx';
import { ViewState, Summary, Question, SimulationInfo, OsceStation, QuizResult } from './types.ts';
import { INITIAL_QUESTIONS, SIMULATIONS } from './constants.tsx';
import { db, ref, onValue, push, remove } from './firebase.ts';

const APP_VERSION = "4.2.5 - Hardened Build";

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewState>('home');
  const [selectedDisciplineId, setSelectedDisciplineId] = useState<string | null>(null);
  const [quizFilteredQuestions, setQuizFilteredQuestions] = useState<Question[]>([]);
  const [currentOsceStation, setCurrentOsceStation] = useState<OsceStation | null>(null);
  
  const [isLoading, setIsLoading] = useState(true);
  const [isOnline, setIsOnline] = useState(false);
  const [diagMessage, setDiagMessage] = useState("Verificando conexão...");

  const [disciplines] = useState<SimulationInfo[]>(SIMULATIONS);
  const [summaries, setSummaries] = useState<Summary[]>([]);
  const [questions, setQuestions] = useState<Question[]>(INITIAL_QUESTIONS);
  const [osceStations, setOsceStations] = useState<OsceStation[]>([]);
  const [quizResults, setQuizResults] = useState<QuizResult[]>([]);

  useEffect(() => {
    // Se o DB nem carregou o script, liberamos a tela branca imediatamente
    if (!db) {
      setDiagMessage("Modo Offline (Sem Serviço)");
      setIsLoading(false);
      return;
    }

    // Monitor de conexão
    try {
      onValue(ref(db, ".info/connected"), (snap) => {
        setIsOnline(snap.val() === true);
      });

      // Carregamento de dados com tratamento de erro por coleção
      const collections = [
        { path: 'questions', setter: (data: any) => setQuestions([...INITIAL_QUESTIONS, ...Object.keys(data).map(k => ({ ...data[k], firebaseId: k }))]) },
        { path: 'summaries', setter: (data: any) => setSummaries(Object.keys(data).map(k => ({ ...data[k], firebaseId: k }))) },
        { path: 'osce', setter: (data: any) => setOsceStations(Object.keys(data).map(k => ({ ...data[k], firebaseId: k }))) }
      ];

      collections.forEach(col => {
        onValue(ref(db, col.path), (snap) => {
          if (snap.val()) col.setter(snap.val());
        }, (err) => console.warn(`Falha na coleção ${col.path}`));
      });

    } catch (e) {
      console.error("Erro no monitoramento do banco:", e);
    }

    // Timer de segurança: Nunca deixar a tela branca por mais de 3 segundos
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#f4f7f6] p-6 text-center">
        <div className="w-12 h-12 border-4 border-[#003366]/10 border-t-[#D4A017] rounded-full animate-spin mb-6"></div>
        <h1 className="text-[#003366] font-black uppercase tracking-[0.3em] text-xs mb-2">Medicina do Sertão</h1>
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{diagMessage}</p>
      </div>
    );
  }

  const handleSelectDiscipline = (id: string) => {
    setSelectedDisciplineId(id);
    setCurrentView('discipline');
  };

  const currentDiscipline = disciplines.find(s => s.id === selectedDisciplineId);

  return (
    <div className="min-h-screen flex flex-col bg-[#f4f7f6]">
      <Header onNavigate={(view) => {
        setCurrentView(view);
        if (view === 'home') setSelectedDisciplineId(null);
      }} />

      <div className={`py-1 px-4 flex justify-center items-center gap-2 border-b transition-all duration-700 ${isOnline ? 'bg-green-50 border-green-100' : 'bg-red-50 border-red-100'}`}>
        <div className={`w-1.5 h-1.5 rounded-full ${isOnline ? 'bg-green-500' : 'bg-red-500 animate-pulse'}`}></div>
        <span className={`text-[8px] font-black uppercase tracking-[0.1em] ${isOnline ? 'text-green-700' : 'text-red-700'}`}>
          {isOnline ? 'Sincronização Ativa' : 'Banco de Dados Desconectado (Offline)'}
        </span>
      </div>

      <div className="flex-grow">
        {currentView === 'home' && (
          <HomeView disciplines={disciplines} onSelectDiscipline={handleSelectDiscipline} />
        )}
        
        {currentView === 'career-quiz' && (
          <CareerQuiz onBack={() => setCurrentView('home')} />
        )}

        {currentView === 'discipline' && selectedDisciplineId && (
          <DisciplineView 
            disciplineId={selectedDisciplineId} 
            disciplines={disciplines}
            summaries={summaries}
            onBack={() => setCurrentView('home')} 
            onSelectOption={(type) => setCurrentView(type as ViewState)}
          />
        )}

        {currentView === 'references-view' && currentDiscipline && (
          <ReferencesView 
            discipline={currentDiscipline}
            onBack={() => setCurrentView('discipline')}
          />
        )}

        {currentView === 'share-material' && currentDiscipline && (
          <ShareMaterialView 
            discipline={currentDiscipline}
            onShare={(s) => {
                if (db) push(ref(db, 'summaries'), s);
                else setSummaries(prev => [...prev, s]);
            }}
            onBack={() => setCurrentView('discipline')}
          />
        )}

        {currentView === 'quiz-setup' && selectedDisciplineId && (
          <QuizSetupView 
            discipline={disciplines.find(s => s.id === selectedDisciplineId)!}
            availableQuestions={questions}
            onBack={() => setCurrentView('discipline')}
            onStart={(filtered) => {
                setQuizFilteredQuestions(filtered);
                setCurrentView('quiz');
            }}
          />
        )}

        {currentView === 'quiz' && (
          <QuizView 
            questions={quizFilteredQuestions} 
            discipline={currentDiscipline!} 
            onBack={() => setCurrentView('quiz-setup')}
            onSaveResult={(score, total) => {
                if (db) {
                   const res = { score, total, date: new Date().toLocaleString(), discipline: currentDiscipline?.title };
                   push(ref(db, 'quizResults'), res);
                }
            }}
          />
        )}

        {currentView === 'summaries-list' && selectedDisciplineId && (
          <SummariesListView 
            disciplineId={selectedDisciplineId} 
            disciplines={disciplines} 
            summaries={summaries} 
            onBack={() => setCurrentView('discipline')} 
            mode="summary" 
          />
        )}

        {currentView === 'scripts-list' && selectedDisciplineId && (
          <SummariesListView 
            disciplineId={selectedDisciplineId} 
            disciplines={disciplines} 
            summaries={summaries} 
            onBack={() => setCurrentView('discipline')} 
            mode="script" 
          />
        )}

        {currentView === 'osce-setup' && selectedDisciplineId && (
          <OsceSetupView 
            discipline={disciplines.find(s => s.id === selectedDisciplineId)!}
            availableStations={osceStations.filter(s => s.disciplineId === selectedDisciplineId)}
            onBack={() => setCurrentView('discipline')}
            onStart={(station) => {
              setCurrentOsceStation(station);
              setCurrentView('osce-quiz');
            }}
          />
        )}

        {currentView === 'osce-quiz' && currentOsceStation && (
          <OsceView station={currentOsceStation} onBack={() => setCurrentView('osce-setup')} />
        )}

        {currentView === 'calculators' && (
          <CalculatorsView onBack={() => setCurrentView('home')} />
        )}

        {currentView === 'admin' && (
          <AdminView 
            questions={questions}
            osceStations={osceStations}
            disciplines={disciplines}
            quizResults={quizResults}
            onAddSummary={(s) => db && push(ref(db, 'summaries'), s)}
            onAddQuestions={(qs) => {
                if (db) qs.forEach(q => push(ref(db, 'questions'), q));
            }}
            onUpdateQuestion={() => {}}
            onAddOsceStations={(os) => {
                if (db) os.forEach(o => push(ref(db, 'osce'), o));
            }}
            onRemoveQuestion={(id) => {
                const q = questions.find(item => item.id === id);
                if (db && q?.firebaseId) remove(ref(db, `questions/${q.firebaseId}`));
            }}
            onRemoveOsceStation={(id) => {
                const o = osceStations.find(item => item.id === id);
                if (db && o?.firebaseId) remove(ref(db, `osce/${o.firebaseId}`));
            }}
            onClearDatabase={() => {
                if(confirm("Deseja apagar TODOS os dados da nuvem?")) {
                   if (db) {
                     remove(ref(db, 'questions'));
                     remove(ref(db, 'summaries'));
                     remove(ref(db, 'osce'));
                   }
                }
            }}
            onClearResults={() => db && remove(ref(db, 'quizResults'))}
            onAddTheme={() => {}}
            onRemoveTheme={() => {}}
            onUpdateTheme={() => {}}
            onUpdateReferences={() => {}}
            onBack={() => setCurrentView('home')}
          />
        )}
      </div>

      <footer className="bg-white border-t py-6 flex flex-col items-center gap-2">
        <div className="text-gray-400 text-[10px] font-bold uppercase tracking-widest">
          © 2026 Medicina do Sertão
        </div>
        <div className="text-[8px] text-gray-300 font-black uppercase tracking-tighter">
          Build {APP_VERSION}
        </div>
      </footer>
    </div>
  );
};

export default App;
