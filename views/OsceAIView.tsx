import React, { useState, useEffect, useRef } from 'react';
import { OsceStation } from '../types';
import { getAIResponse } from '../services/aiService';

interface OsceAIViewProps {
  station: OsceStation;
  onBack: () => void;
}

// Função para transformar os asteriscos da IA num negrito bonito na tela
const formatFeedback = (text: string) => {
  const parts = text.split(/(\*\*.*?\*\*)/g);
  return (
    <>
      {parts.map((part, index) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return <strong key={index} className="text-[#D4A017] font-black">{part.slice(2, -2)}</strong>;
        }
        return <span key={index}>{part}</span>;
      })}
    </>
  );
};

const OsceAIView: React.FC<OsceAIViewProps> = ({ station, onBack }) => {
  const [messages, setMessages] = useState<{role: 'user'|'patient'|'system', text: string}[]>([
    { role: 'system', text: `🩺 SIMULAÇÃO INICIADA\n\nCenário: ${station.scenario}\n\nTarefa: ${station.task}\n\n(O paciente acabou de entrar no consultório e aguarda por si...)` }
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

    const context = `Você é um PACIENTE simulado interagindo com um estudante de medicina. 
    SEU CENÁRIO CLÍNICO BASE: "${station.scenario}".
    
    REGRAS DE INTERAÇÃO (CRÍTICO):
    1. Incorpore a persona. Responda APENAS o que foi perguntado, de forma direta e coloquial.
    2. NÃO entregue o seu diagnóstico de mão beijada. Deixe o aluno investigar.
    3. SIMULAÇÃO DE EXAME FÍSICO E SINAIS VITAIS: Se o estudante informar que está realizando uma ação física (ex: "Vou aferir sua pressão", "Auscultando o pulmão", "Vou palpar seu pescoço", "*Faço o exame de reflexo*"), VOCÊ DEVE assumir o papel do simulador. Forneça IMEDIATAMENTE os achados clínicos compatíveis com o seu cenário (Ex: "A pressão está 150/90", ou "Você nota gânglios aumentados"). Se o cenário não tiver doença relacionada ao exame pedido, diga que está normal.
    
    Histórico da conversa até agora:
    ${chatHistory}
    `;

    const prompt = `Médico (Aluno): ${userMsg}\nPaciente:`;

    const response = await getAIResponse(prompt, context);
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

    const context = `Você é um PRECEPTOR MÉDICO experiente avaliando um aluno em uma estação OSCE simulada.
    Cenário Original: "${station.scenario}".
    Checklist Base de ações que ele devia ter cumprido: ${station.checklist.join(', ')}.
    `;

    const prompt = `Abaixo está a transcrição da anamnese/exame que o aluno fez com o Paciente Virtual:
    \n${chatHistory}\n
    
    Gere uma avaliação final de forma clara, objetiva e muito didática. Ajude o aluno a melhorar.
    Siga EXATAMENTE esta estrutura (use negrito usando asteriscos **texto** para destacar os termos mais cruciais):

    🎯 PONTOS POSITIVOS:
    (Diga o que ele investigou ou perguntou bem de acordo com o checklist)

    ⚠️ O QUE FALTOU OU PODE MELHORAR:
    (Liste os dados importantes do checklist que ele se esqueceu de investigar)

    💡 ESSÊNCIA DO CASO (OBJETIVO DE APRENDIZAGEM):
    (Explique a lição central que este caso ensina e qual deveria ser o raciocínio clínico do aluno perante estes sintomas)

    📊 NOTA FINAL:
    (Dê uma nota de 0 a 10 e diga uma breve frase de incentivo)`;

    const response = await getAIResponse(prompt, context);
    setFeedback(response);
    setIsLoading(false);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 pb-32 h-screen flex flex-col">
      <div className="flex justify-between items-center mb-4 border-b pb-4 shrink-0">
        <button onClick={onBack} className="text-[#003366] font-black uppercase text-[10px] flex items-center gap-2 hover:text-[#D4A017]">
          <span>←</span> Encerrar
        </button>
        <div className="text-right">
          <span className="text-[10px] font-black text-[#D4A017] uppercase tracking-widest">Paciente Virtual</span>
          <h2 className="text-xl font-black text-[#003366] uppercase tracking-tighter">{station.title}</h2>
        </div>
      </div>

      {/* GUIA DE INSTRUÇÕES RÁPIDAS PARA O ALUNO */}
      {!isFinished && (
        <div className="bg-blue-50/50 p-4 rounded-2xl mb-4 border border-blue-100 text-sm shrink-0">
          <p className="font-bold text-[#003366] mb-1 flex items-center gap-2">
            <span>💡</span> Como interagir:
          </p>
          <ul className="list-disc pl-5 space-y-1 text-gray-600 text-xs font-medium">
            <li>Converse com o paciente para fazer a sua <b>anamnese</b> (ex: "Sente alguma dor?").</li>
            <li>Para realizar o <b>exame físico</b> ou checar sinais vitais, comunique a sua ação ao paciente (ex: <i>"Vou aferir a sua pressão agora"</i> ou <i>"Vou palpar o seu pescoço"</i>). O simulador revelará o resultado!</li>
          </ul>
        </div>
      )}

      {/* ÁREA DO CHAT */}
      <div className="flex-grow overflow-y-auto space-y-6 p-4 md:p-8 bg-white rounded-[2rem] shadow-inner mb-6 border border-gray-100 flex flex-col">
        {messages.map((msg, i) => (
           <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : msg.role === 'system' ? 'justify-center' : 'justify-start'}`}>
             <div className={`p-4 max-w-[85%] md:max-w-[70%] rounded-2xl whitespace-pre-wrap leading-relaxed ${
               msg.role === 'user' ? 'bg-[#003366] text-white rounded-br-sm shadow-md font-medium' :
               msg.role === 'system' ? 'bg-yellow-50 text-yellow-800 text-xs text-center border border-yellow-200 font-bold w-full' :
               'bg-gray-50 text-[#003366] font-medium rounded-bl-sm border border-gray-200'
             }`}>
               {msg.text}
             </div>
           </div>
        ))}
        
        {isLoading && !isFinished && (
          <div className="flex justify-start">
            <div className="p-4 bg-gray-50 rounded-2xl rounded-bl-sm border border-gray-200 flex items-center gap-2">
              <div className="w-2 h-2 bg-[#003366] rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-[#003366] rounded-full animate-bounce delay-75"></div>
              <div className="w-2 h-2 bg-[#003366] rounded-full animate-bounce delay-150"></div>
            </div>
          </div>
        )}
        
        {isFinished && feedback && (
           <div className="flex justify-center mt-8 animate-in fade-in duration-700">
             <div className="bg-[#003366] w-full p-8 rounded-[2rem] shadow-xl border-t-8 border-[#D4A017] text-white">
                <h3 className="text-2xl font-black uppercase tracking-tighter flex items-center gap-3 mb-8 border-b border-white/10 pb-4">
                  <span>🎓</span> Avaliação do Preceptor
                </h3>
                <div className="text-sm leading-relaxed whitespace-pre-wrap font-medium space-y-4">
                  {formatFeedback(feedback)}
                </div>
             </div>
           </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* ÁREA DE INPUT / BOTÕES */}
      <div className="shrink-0 bg-white p-2">
        {!isFinished ? (
          <div className="flex flex-col gap-4">
            <div className="flex gap-2 relative">
              <input
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSend()}
                placeholder="Ex: 'Sente dores?' ou 'Vou medir a sua pressão'"
                className="flex-grow p-4 bg-gray-50 rounded-2xl border-2 border-gray-200 focus:border-[#D4A017] outline-none transition-all font-medium text-[#003366]"
                disabled={isLoading}
              />
              <button 
                onClick={handleSend} 
                disabled={isLoading || !input.trim()} 
                className="bg-[#D4A017] text-[#003366] font-black px-6 md:px-8 rounded-2xl hover:bg-[#003366] hover:text-white transition-all disabled:opacity-50 disabled:scale-100 flex items-center justify-center text-xl shadow-md"
              >
                ➤
              </button>
            </div>
            
            {/* BOTÃO FINALIZAR DESTACADO */}
            <button 
              onClick={handleFinish} 
              disabled={isLoading || messages.length < 3}
              className="w-full bg-red-50 text-red-600 border-2 border-red-200 hover:bg-red-500 hover:text-white hover:border-red-500 py-4 rounded-2xl font-black uppercase text-[11px] tracking-widest transition-all disabled:opacity-40 flex items-center justify-center gap-2 shadow-sm"
            >
              <span>🛑</span> Finalizar Atendimento e Avaliar
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
