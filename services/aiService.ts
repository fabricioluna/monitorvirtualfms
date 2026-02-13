
import { GoogleGenAI, Type } from "@google/genai";
import { Question } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

/**
 * Define o tipo de simulado para ajustar o comportamento da IA
 */
export type QuizMode = 'THEORY' | 'PRACTICAL';

export const generateMedicalQuestions = async (
  disciplineTitle: string,
  theme: string,
  mode: QuizMode = 'THEORY',
  count: number = 5
): Promise<Question[]> => {
  
  // Prompt especializado para Prova Teórica
  const theorySystemInstruction = `Você é um professor titular de medicina da Faculdade de Medicina do Sertão (FMS). 
  Sua especialidade é criar questões de alta complexidade para o 2º período, focadas em Metodologia Ativa (PBL).
  As questões TEÓRICAS devem focar em:
  1. Casos clínicos curtos com correlação fisiopatológica.
  2. Mecanismos moleculares e bioquímicos (ex: ciclo de Krebs, transporte de membrana).
  3. Integração entre sistemas (cardiovascular + renal + respiratório).
  4. Nível de dificuldade: Acadêmico rigoroso (não use questões triviais).`;

  // Prompt especializado para Prova Prática (Teórico-Prática)
  const practicalSystemInstruction = `Você é um monitor de laboratório de anatomia e histologia da FMS.
  Sua tarefa é criar questões PRÁTICAS (Teórico-Práticas) que avaliam a capacidade de identificação e função.
  As questões PRÁTICAS devem focar em:
  1. Descrição de estruturas em lâminas histológicas ou peças anatômicas.
  2. Identificação de marcadores e correlação com a função tecidual.
  3. Reconhecimento de manobras semiológicas (Anamnese/Exame Físico).
  4. Nível de dificuldade: Focado em morfologia, técnica e identificação visual.`;

  const prompt = `Gere ${count} questões de múltipla escolha para o tema "${theme}" na disciplina "${disciplineTitle}".
  Modo de Simulado: ${mode === 'THEORY' ? 'TEÓRICO (Raciocínio)' : 'PRÁTICO (Identificação e Técnica)'}.
  
  Regras de Saída:
  - 4 alternativas (A a D).
  - Linguagem médica técnica e precisa.
  - Explicações detalhadas que funcionem como material de estudo.`;

  const response = await ai.models.generateContent({
    model: "gemini-3-pro-preview",
    contents: prompt,
    config: {
      systemInstruction: mode === 'THEORY' ? theorySystemInstruction : practicalSystemInstruction,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            q: { type: Type.STRING, description: "O enunciado da questão médica." },
            options: { 
              type: Type.ARRAY, 
              items: { type: Type.STRING },
              description: "Lista de 4 alternativas." 
            },
            answer: { type: Type.INTEGER, description: "O índice da resposta correta (0 a 3)." },
            explanation: { type: Type.STRING, description: "Justificativa acadêmica baseada em livros-texto (ex: Guyton, Junqueira, Moore)." }
          },
          required: ["q", "options", "answer", "explanation"]
        }
      },
      thinkingConfig: { thinkingBudget: 2500 }
    }
  });

  try {
    const rawQuestions = JSON.parse(response.text || "[]");
    return rawQuestions.map((q: any, index: number) => ({
      ...q,
      id: `ai-${Date.now()}-${index}`,
      disciplineId: "", 
      theme: theme,
      tag: mode === 'THEORY' ? "IA - Simulado Teórico" : "IA - Prática/Laboratório",
      isPractical: mode === 'PRACTICAL'
    }));
  } catch (error) {
    console.error("Erro ao processar JSON da IA:", error);
    throw new Error("Falha ao processar as questões geradas pela IA.");
  }
};
