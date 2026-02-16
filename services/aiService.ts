// Já não importamos o Google SDK aqui! O frontend agora é "burro" e seguro.

export const getAIResponse = async (prompt: string, context: string = "") => {
  try {
    // Fazemos um pedido à nossa própria Vercel
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt, context }),
    });

    if (!response.ok) {
      throw new Error(`Erro no servidor: ${response.status}`);
    }

    const data = await response.json();
    return data.text; // Retorna o texto gerado pela IA

  } catch (error) {
    console.error("Erro na comunicação com a API segura:", error);
    return "Desculpe, tive um problema ao processar a sua dúvida. Tente novamente em instantes.";
  }
};
