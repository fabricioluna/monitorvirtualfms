import React, { useState, useEffect, useRef } from 'react';
import { OsceStation } from '../types';
import { getAIResponse } from '../services/aiService';

interface OsceAIViewProps {
  station: OsceStation;
  onBack: () => void;
}

const OsceAIView: React.FC<OsceAIViewProps> = ({ station, onBack }) => {
  const [messages, setMessages] = useState<{role: 'user'|'patient'|'system', text: string}[]>([
    { role: 'system', text: `🩺 SIMULAÇÃO INICIADA\n\nCenário Clínico: ${station.scenario}\n\nTarefa: ${station.task}\n\n(O paciente está aguardando você iniciar a conversa...)` }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [feedback, setFeedback] = useState('');

  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, feedback]);

  const handleSend = async () => {
    if (!input.trim() || isLoading || isFinished) return;
    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsLoading(true);

    const chatHistory = messages
      .filter(m => m.role !== 'system')
      .map(m => `${m.role === 'user' ? 'Médico' : 'Paciente'}: ${m.text}`)
      .join('\n');

    const context = `Você é um PACIENTE simulado para um estudante de medicina. 
    SEU CENÁRIO (Nunca saia do personagem): "${station.scenario}".
    REGRAS PARA VOCÊ:
    1. Aja exatamente como o paciente descrito no cenário.
    2. Seja natural, use palavras comuns de um leigo (não use termos técnicos a menos que seja um paciente da área da saúde).
    3. Responda APENAS ao que o médico perguntou, de forma curta. Não conte toda a sua história de uma vez.
    4. NÃO diga o seu diagnóstico. Deixe o aluno investigar.
    5. Se o médico for rude, mostre desconforto.
    
    Histórico da conversa até agora:
    ${chatHistory}
    `;

    const prompt = `Médico (Aluno): ${userMsg}\nPaciente:`;

    const response = await getAIResponse(prompt, context);
    
    // Limpa possíveis prefixos como "Paciente:" que a IA possa colocar
    const cleanResponse = response.replace(/^Paciente:\s*/i, '').trim();
    
    setMessages(prev => [...prev, { role: 'patient', text: cleanResponse }]);
    setIsLoading(false);
  };

  const handleFinish = async () => {
    setIsLoading(true);
    setIsFinished(true);

    const chatHistory = messages
      .filter(m => m.role !== 'system')
      .map(m => `${m.role === 'user' ? 'Médico' : 'Paciente'}: ${m.text}`)
      .join('\n');

    const context = `Você é um PRECEPTOR MÉDICO experiente avaliando o desempenho de um aluno em uma estação OSCE simulada por chat.
    Cenário da estação: "${station.scenario}".
    Checklist Base de ações/perguntas esperadas: ${station.checklist.join(', ')}.
    `;

    const prompt = `Abaixo está a transcrição exata da anamnese que o aluno fez com o Paciente Virtual:
    \n${chatHistory}\n
    Gere uma avaliação direta e didática do desempenho do aluno. 
    1. Diga quais pontos do checklist ele investigou bem.
    2. Diga o que ele esqueceu ou falhou em perguntar.
    3. Finalize dando uma nota de 0 a 10. (Formate o texto de forma fácil de ler, usando negritos se necessário).`;

    const response = await getAIResponse(prompt, context);
    setFeedback(response);
    setIsLoading(false);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 pb-32 h-screen flex flex-col">
      <div className="flex justify-between items-center mb-6 border-b pb-4 shrink-0">
        <button onClick={onBack} className="text-[#003366] font-black uppercase text-[10px] flex items-center gap-2 hover:text-[#D4A017]">
          <span>←</span> Encerrar
        </button>
        <div className="text-right">
          <span className="text-[10px] font-black text-[#D4A017] uppercase tracking-widest">Paciente Virtual</span>
          <h2 className="text-xl font-black text-[#003366] uppercase tracking-tighter">{station.title}</h2>
        </div>
      </div>

      {/* ÁREA DO CHAT */}
      <div className="flex-grow overflow-y-auto space-y-6 p-4 md:p-8 bg-white rounded-[2rem] shadow-inner mb-6 border border-gray-100 flex flex-col">
        {messages.map((msg, i) => (
           <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : msg.role === 'system' ? 'justify-center' : 'justify-start'}`}>
             <div className={`p-4 max-w-[85%] md:max-w-[70%] rounded-2xl whitespace-pre-wrap leading-relaxed ${
               msg.role === 'user' ? 'bg-[#003366] text-white rounded-br-sm shadow-md font-medium' :
               msg.role === 'system' ? 'bg-yellow-50 text-yellow-800 text-xs text-center border border-yellow-200 font-bold w-full' :
               'bg-gray-100 text-[#003366] font-medium rounded-bl-sm border border-gray-200'
             }`}>
               {msg.text}
             </div>
           </div>
        ))}
        
        {isLoading && !isFinished && (
          <div className="flex justify-start">
            <div className="p-4 bg-gray-100 rounded-2xl rounded-bl-sm border border-gray-200 flex items-center gap-2">
              <div className="w-2 h-2 bg-[#003366] rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-[#003366] rounded-full animate-bounce delay-75"></div>
              <div className="w-2 h-2 bg-[#003366] rounded-full animate-bounce delay-150"></div>
            </div>
          </div>
        )}
        
        {isFinished && feedback && (
           <div className="flex justify-center mt-8 animate-in fade-in duration-700">
             <div className="bg-[#003366] w-full p-8 rounded-[2rem] shadow-xl border-t-8 border-[#D4A017] text-white">
                <h3 className="text-xl font-black uppercase tracking-tighter flex items-center gap-3 mb-6">
                  <span>🎓</span> Avaliação do Preceptor
                </h3>
                <div className="text-sm leading-relaxed opacity-90 whitespace-pre-wrap font-medium">
                  {feedback}
                </div>
             </div>
           </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* ÁREA DE INPUT / BOTÕES */}
      <div className="shrink-0">
        {!isFinished ? (
          <div className="flex flex-col gap-3">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSend()}
                placeholder="Ex: 'O senhor está sentindo dor? Onde?'"
                className="flex-grow p-4 bg-white rounded-2xl border-2 border-gray-200 focus:border-[#D4A017] outline-none transition-all font-medium text-[#003366]"
                disabled={isLoading}
              />
              <button 
                onClick={handleSend} 
                disabled={isLoading || !input.trim()} 
                className="bg-[#D4A017] text-[#003366] font-black px-6 md:px-10 rounded-2xl hover:bg-[#003366] hover:text-white transition-all disabled:opacity-50 disabled:scale-100 flex items-center justify-center text-xl"
              >
                ➤
              </button>
            </div>
            <button 
              onClick={handleFinish} 
              disabled={isLoading || messages.length < 3}
              className="w-full text-center py-3 text-[10px] font-black text-gray-400 uppercase tracking-widest hover:text-red-500 transition-colors disabled:opacity-30"
            >
              Finalizar Anamnese e Receber Avaliação
            </button>
          </div>
        ) : (
          <button 
            onClick={onBack}
            className="w-full bg-[#D4A017] text-[#003366] py-5 rounded-[2rem] font-black uppercase text-sm tracking-widest shadow-xl hover:scale-105 transition-all"
          >
            Voltar para o Menu
          </button>
        )}
      </div>
    </div>
  );
};

export default OsceAIView;
