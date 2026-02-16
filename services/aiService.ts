export const getAIResponse = async (prompt: string, context: string = "") => {
  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt, context }),
    });

    if (!response.ok) {
      throw new Error(`Erro no servidor: ${response.status}`);
    }

    const data = await response.json();
    return data.text; 

  } catch (error) {
    console.error("Erro na comunicação com a API segura:", error);
    return "Desculpe, tive um problema ao processar a sua dúvida. Tente novamente em instantes.";
  }
};
