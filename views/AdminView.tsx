
import React, { useState } from 'react';
import { Question, OsceStation, SimulationInfo, Summary, QuizResult, ReferenceMaterial } from '../types.ts';

interface AdminViewProps {
  questions: Question[];
  osceStations: OsceStation[];
  disciplines: SimulationInfo[];
  quizResults: QuizResult[];
  onAddSummary: (s: Summary) => void;
  onAddQuestions: (qs: Question[]) => void;
  onUpdateQuestion: (q: Question) => void;
  onAddOsceStations: (os: OsceStation[]) => void;
  onRemoveQuestion: (id: string) => void;
  onRemoveOsceStation: (id: string) => void;
  onClearDatabase: () => void;
  onClearResults: () => void;
  onAddTheme: (disciplineId: string, themeName: string) => void;
  onRemoveTheme: (disciplineId: string, themeName: string) => void;
  onUpdateTheme: (disciplineId: string, oldTheme: string, newTheme: string) => void;
  onUpdateReferences: (disciplineId: string, refs: ReferenceMaterial[]) => void;
  onBack: () => void;
}

const AdminView: React.FC<AdminViewProps> = ({
  questions,
  disciplines,
  quizResults,
  onAddSummary,
  onAddQuestions,
  onRemoveQuestion,
  onClearDatabase,
  onClearResults,
  onBack
}) => {
  const [isAuthorized, setIsAuthorized] = useState(() => sessionStorage.getItem('fms_admin_auth') === 'true');
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState<'questions' | 'osce' | 'stats' | 'references' | 'materials'>('stats');
  
  const [qDiscipline, setQDiscipline] = useState('');
  const [qTheme, setQTheme] = useState('');
  const [qFile, setQFile] = useState<File | null>(null);

  const [matDisc, setMatDisc] = useState('');
  const [matType, setMatType] = useState<'summary' | 'script'>('summary');
  const [matLabel, setMatLabel] = useState('');
  const [matUrl, setMatUrl] = useState('');
  const [isFolder, setIsFolder] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (login === 'luna' && password === 'fmst8') {
      setIsAuthorized(true);
      sessionStorage.setItem('fms_admin_auth', 'true');
    } else {
      alert('Credenciais incorretas!');
    }
  };

  const handleQuestionImport = (e: React.FormEvent) => {
    e.preventDefault();
    if (!qFile || !qDiscipline || !qTheme) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        const lines = text.split('\n').filter(l => l.trim());
        const newQs: Question[] = lines.slice(1).map((line, idx) => {
          const parts = line.split(';');
          return {
            id: `q_${Date.now()}_${idx}`,
            disciplineId: qDiscipline,
            theme: qTheme,
            q: parts[0],
            options: [parts[1], parts[2], parts[3], parts[4]],
            answer: parseInt(parts[5]),
            explanation: parts[6] || '',
            tag: parts[7] === 'true' ? 'Prática' : 'Teórica',
            isPractical: parts[7] === 'true'
          };
        });
        onAddQuestions(newQs);
        alert(`${newQs.length} questões adicionadas localmente.`);
        setQFile(null);
      } catch (err) { alert('Erro no CSV.'); }
    };
    reader.readAsText(qFile);
  };

  const handleAddMaterial = (e: React.FormEvent) => {
    e.preventDefault();
    if (!matDisc || !matLabel || !matUrl) return;
    onAddSummary({
      id: `mat_${Date.now()}`,
      disciplineId: matDisc,
      label: matLabel,
      url: matUrl,
      type: matType,
      isFolder: isFolder,
      date: new Date().toLocaleDateString('pt-BR')
    });
    setMatLabel('');
    setMatUrl('');
    alert('Material adicionado!');
  };

  if (!isAuthorized) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4">
        <div className="bg-white p-10 rounded-[2.5rem] shadow-2xl border border-gray-100 w-full max-w-md">
          <h2 className="text-2xl font-black text-[#003366] text-center mb-8">ADMIN</h2>
          <form onSubmit={handleLogin} className="space-y-4">
            <input type="text" placeholder="Usuário" value={login} onChange={e => setLogin(e.target.value)} className="w-full p-4 bg-gray-50 rounded-xl outline-none" />
            <input type="password" placeholder="Senha" value={password} onChange={e => setPassword(e.target.value)} className="w-full p-4 bg-gray-50 rounded-xl outline-none" />
            <button type="submit" className="w-full bg-[#003366] text-white py-4 rounded-xl font-bold">Entrar</button>
            <button type="button" onClick={onBack} className="w-full text-xs text-gray-400 mt-2">Voltar</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="flex justify-between items-center mb-10 border-b pb-8">
        <button onClick={onBack} className="text-[#003366] font-bold">← Sair</button>
        <h2 className="text-3xl font-black text-[#003366]">PAINEL ADMIN LOCAL</h2>
        <div className="flex gap-2">
           <button onClick={onClearDatabase} className="bg-red-500 text-white px-4 py-2 rounded text-[10px] font-bold">RESETAR APP</button>
        </div>
      </div>

      <div className="flex gap-3 mb-12">
        <button onClick={() => setActiveTab('stats')} className={`px-6 py-3 rounded-xl font-bold ${activeTab === 'stats' ? 'bg-[#D4A017]' : 'bg-gray-100'}`}>Stats</button>
        <button onClick={() => setActiveTab('questions')} className={`px-6 py-3 rounded-xl font-bold ${activeTab === 'questions' ? 'bg-[#003366] text-white' : 'bg-gray-100'}`}>Questões</button>
        <button onClick={() => setActiveTab('materials')} className={`px-6 py-3 rounded-xl font-bold ${activeTab === 'materials' ? 'bg-[#003366] text-white' : 'bg-gray-100'}`}>Materiais</button>
      </div>

      {activeTab === 'stats' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-[#003366] p-8 rounded-3xl text-white">
            <p className="text-xs uppercase opacity-60">Resultados de Simulados</p>
            <h4 className="text-5xl font-black">{quizResults.length}</h4>
          </div>
          <div className="bg-white p-8 rounded-3xl border">
            <p className="text-xs uppercase text-gray-400">Total de Questões em Memória</p>
            <h4 className="text-5xl font-black text-[#003366]">{questions.length}</h4>
          </div>
        </div>
      )}

      {activeTab === 'questions' && (
        <div className="bg-white p-8 rounded-3xl border">
          <h3 className="text-xl font-black mb-6">IMPORTAR QUESTÕES (.CSV)</h3>
          <form onSubmit={handleQuestionImport} className="space-y-4 max-w-md">
            <select value={qDiscipline} onChange={e => setQDiscipline(e.target.value)} className="w-full p-4 bg-gray-50 rounded-xl" required>
              <option value="">Selecione Disciplina...</option>
              {disciplines.map(d => <option key={d.id} value={d.id}>{d.title}</option>)}
            </select>
            <select value={qTheme} onChange={e => setQTheme(e.target.value)} className="w-full p-4 bg-gray-50 rounded-xl" required>
              <option value="">Selecione Tema...</option>
              {disciplines.find(d => d.id === qDiscipline)?.themes.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
            <input type="file" accept=".csv" onChange={e => setQFile(e.target.files ? e.target.files[0] : null)} />
            <button type="submit" className="w-full bg-[#003366] text-white py-4 rounded-xl font-bold">Processar Arquivo</button>
          </form>
        </div>
      )}

      {activeTab === 'materials' && (
        <div className="bg-white p-8 rounded-3xl border max-w-md">
          <h3 className="text-xl font-black mb-6">ADICIONAR MATERIAL</h3>
          <form onSubmit={handleAddMaterial} className="space-y-4">
            <select value={matDisc} onChange={e => setMatDisc(e.target.value)} className="w-full p-4 bg-gray-50 rounded-xl" required>
              <option value="">Disciplina...</option>
              {disciplines.map(d => <option key={d.id} value={d.id}>{d.title}</option>)}
            </select>
            <input type="text" placeholder="Título" value={matLabel} onChange={e => setMatLabel(e.target.value)} className="w-full p-4 bg-gray-50 rounded-xl" required />
            <input type="url" placeholder="URL Google Drive" value={matUrl} onChange={e => setMatUrl(e.target.value)} className="w-full p-4 bg-gray-50 rounded-xl" required />
            <button type="submit" className="w-full bg-[#003366] text-white py-4 rounded-xl font-bold">Salvar na Sessão</button>
          </form>
        </div>
      )}
    </div>
  );
};

export default AdminView;
