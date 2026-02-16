import React, { useState, useEffect, useRef } from 'react';
import { OsceStation } from '../types';
import { getAIResponse } from '../services/aiService';

interface OsceAIViewProps {
  station: OsceStation;
  onBack: () => void;
}

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
  const defaultSetting = 'Consultório médico padrão. Disponível: maca, pia, estetoscópio, esfigmomanômetro, termômetro, oftalmoscópio, otoscópio, martelo de reflexos, lanterna, luvas e espátulas.';
  const currentSetting = station.setting || defaultSetting;

  const [messages, setMessages] = useState<{role: 'user'|'patient'|'system', text: string}[]>([
    { 
      role: 'system', 
      text: `🩺 SIMULAÇÃO INICIADA\n\n📍 AMBIENTE:\n${currentSetting}\n\n📝 CENÁRIO CLÍNICO:\n${station.scenario}\n\n🎯 TAREFA:\n${station.task}\n\n---\n💬 O paciente acaba de entrar e aguarda a sua abordagem...` 
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [feedback, setFeedback] = useState('');

  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, feedback, isLoading]);

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

    const context = `Você é um PACIENTE simulado interagindo com um estudante de medicina em um exame OSCE. 
    SEU CENÁRIO CLÍNICO: "${station.scenario}".
    AMBIENTE FÍSICO DA SALA: "${currentSetting}".
    
    REGRAS DE INTERAÇÃO (CRÍTICO):
    1. Incorpore a persona. Responda APENAS o que foi perguntado, de forma direta e coloquial.
    2. NÃO entregue o seu diagnóstico de mão beijada.
    3. DINÂMICA EMOCIONAL: Reaja ao tom do médico. (Se ele for educado -> alivio/colaboração; se ríspido/sem se apresentar -> desconforto/ansiedade).
    4. SIMULAÇÃO FÍSICA E LIMITAÇÃO DE RECURSOS: 
       - Se o estudante realizar uma ação física de consultório (ex: "Aferir pressão", "Auscultar pulmão", "Palpar pescoço"), forneça IMEDIATAMENTE os achados clínicos compatíveis com a sua doença.
       - SE O ESTUDANTE PEDIR EXAMES LABORATORIAIS OU DE IMAGEM (Ex: Raio-X, Tomografia, Hemograma, Ultrassom) NA SALA: Incorpore o narrador da simulação e diga explicitamente: "[SISTEMA]: Você está na sala de exame clínico. Este recurso não está disponível aqui no momento. Foco na anamnese e no exame físico."
    
    Histórico da conversa até agora:
    ${chatHistory}
    `;

    const prompt = `Médico (Aluno): ${userMsg}\nPaciente/Sistema:`;

    const response = await getAIResponse(prompt, context);
    const cleanResponse = response.replace(/^Paciente:\s*/i, '').replace(/^Paciente\/Sistema:\s*/i, '').trim();
    
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

    const context = `Você é um PRECEPTOR MÉDICO SÊNIOR avaliando um aluno em uma estação OSCE simulada.
    Cenário Original: "${station.scenario}".
    Checklist Oficial: ${station.checklist.join(', ')}.
    Ambiente Disponível: "${currentSetting}".
    `;

    const prompt = `Abaixo está a transcrição da anamnese/exame que o aluno fez com o Paciente Virtual:
    \n${chatHistory}\n
    
    Gere uma avaliação final madura, justa e muito didática. Foque em se o aluno cumpriu o *objetivo clínico* de cada etapa do checklist.
    Siga EXATAMENTE esta estrutura (use negrito **texto** para destacar os termos cruciais):

    🤝 POSTURA E COMUNICAÇÃO (SOFT SKILLS):
    (Avalie se o aluno se apresentou, foi empático e soube conduzir a consulta.)

    🎯 ACERTOS CLÍNICOS E USO DO AMBIENTE:
    (Diga quais itens do checklist ele investigou bem e se usou bem os materiais disponíveis no consultório.)

    ⚠️ O QUE FALTOU OU PODE MELHORAR:
    (Aponte falhas graves do checklist ou condutas irreais/precipitadas para o ambiente do exame.)

    💡 ESSÊNCIA DO CASO:
    (Explique a lição central que este caso ensina e o raciocínio clínico esperado.)

    📊 NOTA FINAL (0 a 10):
    (Dê a nota baseada no desempenho técnico e atitude)`;

    const response = await getAIResponse(prompt, context);
    setFeedback(response);
    setIsLoading(false);
  };

  return (
    /* AQUI ESTÁ O SEGREDO DA ALTURA: h-[88vh] em vez de ter pb-32 esmagando a tela */
    <div className="max-w-5xl mx-auto px-4 pt-6 pb-2 h-[88vh] flex flex-col">
      
      <div className="flex justify-between items-center mb-3 border-b pb-3 shrink-0">
        <button onClick={onBack} className="text-[#003366] font-black uppercase text-[10px] flex items-center gap-2 hover:text-[#D4A017]">
          <span>←</span> Encerrar
        </button>
        <div className="text-right">
          <span className="text-[10px] font-black text-[#D4A017] uppercase tracking-widest">Paciente Virtual</span>
          <h2 className="text-xl font-black text-[#003366] uppercase tracking-tighter">{station.title}</h2>
        </div>
      </div>

      {!isFinished && (
        <div className="bg-blue-50/50 p-3 rounded-xl mb-3 border border-blue-100 text-sm shrink-0">
          <p className="font-bold text-[#003366] mb-1 flex items-center gap-2">
            <span>💡</span> Dicas de Ouro para a Simulação:
          </p>
          <ul className="list-disc pl-5 space-y-1 text-gray-600 text-[11px] font-medium">
            <li><b>Aja como na vida real:</b> Apresente-se, seja educado. O paciente reage ao seu tom de voz.</li>
            <li><b>Leia o "Ambiente":</b> Só use os instrumentos listados abaixo.</li>
            <li>Para o exame físico, informe o paciente (ex: <i>"Vou auscultar seu pulmão agora"</i>).</li>
          </ul>
        </div>
      )}

      {/* A ÁREA DO CHAT AGORA ESTÁ MUITO MAIS ALTA E FLUIDA */}
      <div className="flex-grow overflow-y-auto space-y-5 p-4 md:p-6 bg-white rounded-[1.5rem] shadow-inner mb-4 border border-gray-100 flex flex-col">
        {messages.map((msg, i) => (
           <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : msg.role === 'system' ? 'justify-center' : 'justify-start'}`}>
             <div className={`whitespace-pre-wrap leading-relaxed ${
               msg.role === 'user' ? 'p-4 max-w-[85%] md:max-w-[70%] rounded-2xl bg-[#003366] text-white rounded-br-sm shadow-md font-medium text-sm md:text-base' :
               msg.role === 'system' ? 'p-5 md:p-8 w-full rounded-[1.5rem] bg-yellow-50/80 text-yellow-900 text-sm md:text-base text-left border-2 border-yellow-200 shadow-sm font-medium mb-2' :
               'p-4 max-w-[85%] md:max-w-[70%] rounded-2xl bg-gray-50 text-[#003366] font-medium rounded-bl-sm border border-gray-200 shadow-sm text-sm md:text-base'
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

        {isLoading && isFinished && !feedback && (
          <div className="flex justify-center mt-6 animate-in fade-in duration-500">
            <div className="bg-white p-6 rounded-[1.5rem] shadow-lg border-2 border-dashed border-[#D4A017] flex flex-col items-center justify-center gap-4 text-[#003366] w-full md:w-3/4">
              <div className="text-4xl animate-spin text-[#D4A017]">⏳</div>
              <div className="text-center">
                <h4 className="font-black uppercase tracking-widest text-sm mb-1">Analisando sua Anamnese</h4>
                <p className="text-xs font-medium text-gray-500">O Preceptor está escrevendo o seu relatório...</p>
              </div>
            </div>
          </div>
        )}
        
        {isFinished && feedback && (
           <div className="flex justify-center mt-6 animate-in fade-in duration-700">
             <div className="bg-[#003366] w-full p-6 md:p-10 rounded-[1.5rem] shadow-xl border-t-8 border-[#D4A017] text-white">
                <h3 className="text-xl font-black uppercase tracking-tighter flex items-center gap-3 mb-6 border-b border-white/10 pb-4">
                  <span>🎓</span> Relatório do Preceptor
                </h3>
                <div className="text-sm md:text-base leading-relaxed whitespace-pre-wrap font-medium space-y-4">
                  {formatFeedback(feedback)}
                </div>
             </div>
           </div>
        )}
        <div ref={chatEndRef} />
      </div>

      <div className="shrink-0 bg-white pt-1">
        {!isFinished ? (
          <div className="flex flex-col gap-3">
            <div className="flex gap-2 relative">
              <input
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSend()}
                placeholder="Escreva a sua ação ou pergunta aqui..."
                className="flex-grow p-4 bg-gray-50 rounded-2xl border-2 border-gray-200 focus:border-[#D4A017] outline-none transition-all font-medium text-[#003366]"
                disabled={isLoading}
              />
              <button 
                onClick={handleSend} 
                disabled={isLoading || !input.trim()} 
                className="bg-[#D4A017] text-[#003366] font-black px-6 md:px-8 rounded-2xl hover:bg-[#003366] hover:text-white transition-all disabled:opacity-50 flex items-center justify-center text-xl shadow-md"
              >
                ➤
              </button>
            </div>
            
            <button 
              onClick={handleFinish} 
              disabled={isLoading || messages.length < 3}
              className="w-full bg-red-50 text-red-600 border-2 border-red-200 hover:bg-red-500 hover:text-white hover:border-red-500 py-3 rounded-2xl font-black uppercase text-[11px] tracking-widest transition-all disabled:opacity-40 flex items-center justify-center gap-2 shadow-sm"
            >
              <span>🛑</span> Finalizar Atendimento e Avaliar
            </button>
          </div>
        ) : (
          <button 
            onClick={onBack}
            className="w-full bg-[#D4A017] text-[#003366] py-4 rounded-2xl font-black uppercase text-sm tracking-widest shadow-xl hover:scale-105 transition-all"
          >
            Voltar para o Menu
          </button>
        )}
      </div>
    </div>
  );
};

export default OsceAIView;
