
import { GoogleGenAI } from "@google/genai";
import { Plant } from "../types";

export const getAIGrowAdvice = async (plant: Plant, userQuery: string): Promise<string> => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Você é um master grower profissional com 30 anos de experiência no cultivo de cannabis.
      Analise o estado atual desta planta e responda à dúvida do usuário em Português do Brasil.
      
      Dados da Planta:
      - Nome: ${plant.name}
      - Strain: ${plant.strain}
      - Genética: ${plant.genetics}
      - Estágio: ${plant.currentStage}
      - Idade: ${Math.floor((Date.now() - plant.startDate) / (24*60*60*1000))} dias
      
      Pergunta do Usuário: ${userQuery}
      
      Mantenha os conselhos concisos, científicos e práticos. Use um tom prestativo, porém profissional. Responda SEMPRE em Português do Brasil.`,
    });

    return response.text || "Desculpe, não consegui processar o conselho agora.";
  } catch (error) {
    console.error("Erro do Assistente IA:", error);
    return "O assistente de IA está offline no momento. Por favor, verifique sua conexão.";
  }
};
