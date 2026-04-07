import { GoogleGenAI } from "@google/genai";

export const analyzeMetadata = async (metadata: any, imageBase64: string, language: 'pt' | 'en') => {
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });
  
  const metadataStr = JSON.stringify(metadata, null, 2);
  const prompt = language === 'pt' 
    ? `Analise esta imagem e seus metadados EXIF. 
       Metadados encontrados: ${metadataStr}
       
       Por favor, forneça:
       1. Uma breve descrição do que você vê na foto.
       2. Insights técnicos baseados nos metadados (se houver).
       3. Dicas de fotografia para melhorar este tipo de captura.
       4. Contexto geográfico se houver coordenadas GPS.
       
       Responda em Português de forma amigável e profissional.`
    : `Analyze this image and its EXIF metadata.
       Metadata found: ${metadataStr}
       
       Please provide:
       1. A brief description of what you see in the photo.
       2. Technical insights based on metadata (if any).
       3. Photography tips to improve this type of shot.
       4. Geographical context if GPS coordinates are present.
       
       Respond in English in a friendly and professional manner.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [
        {
          parts: [
            { text: prompt },
            { 
              inlineData: { 
                data: imageBase64.split(',')[1], 
                mimeType: "image/jpeg" 
              } 
            }
          ]
        }
      ],
    });
    
    return response.text;
  } catch (error) {
    console.error("AI Analysis Error:", error);
    throw error;
  }
};
