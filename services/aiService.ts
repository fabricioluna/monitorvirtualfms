import { GoogleGenerativeAI } from "@google/generative-ai";

// No Cloud Run/Vercel, esta chave deve estar nas variáveis de ambiente
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || "";
const genAI = new GoogleGenerativeAI(API_KEY);

export const getAIResponse = async (prompt: string, context: string = "") => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const fullPrompt = `Contexto acadêmico (FMS): ${context}\n\nPergunta do aluno: ${prompt}`;
    
    const result = await model.generateContent(fullPrompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Erro na IA:", error);
    return "Desculpe, tive um problema ao processar sua dúvida. Tente novamente em instantes.";
  }
};
