import { GoogleGenAI } from '@google/genai';

export default async function handler(req: any, res: any) {
  // Apenas aceitar requisições POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  try {
    const { prompt, context } = req.body;

    // Inicia a IA com a chave de ambiente SECRETA do servidor
    // Repare que já não tem o prefixo "VITE_", logo o navegador nunca a verá
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    
    const fullPrompt = `Contexto acadêmico (FMS): ${context}\n\nPergunta do aluno: ${prompt}`;
    
    // Chamada à Google usando o SDK que está no seu package.json
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash', // Atualizado para o modelo mais rápido e recente
        contents: fullPrompt,
    });

    // Devolve a resposta limpa para o seu frontend
    return res.status(200).json({ text: response.text });

  } catch (error) {
    console.error("Erro interno no Servidor Vercel:", error);
    return res.status(500).json({ error: 'Falha ao comunicar com a Inteligência Artificial.' });
  }
}
