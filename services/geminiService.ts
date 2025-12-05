import { GoogleGenAI, Modality } from "@google/genai";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  // In a real app, you'd handle this more gracefully.
  // For this example, we assume it's set.
  console.warn("API key for Gemini is not set in environment variables.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY! });

export const getLessonIdeas = async (ageGroup: string): Promise<string[]> => {
  try {
    let prompt = '';
    
    if (ageGroup === 'Livre') {
         prompt = `Gere 5 sugestões de temas de aulas bíblicas que sejam versáteis e adaptáveis para uma turma infantil multietária (várias idades juntas). Para cada tema, forneça um título criativo, uma breve descrição de uma linha e a referência bíblica principal. Formate a resposta como uma lista simples, com cada sugestão separada por uma nova linha.`;
    } else {
         prompt = `Gere 5 sugestões de temas de aulas bíblicas para crianças na faixa etária de ${ageGroup}. Para cada tema, forneça um título criativo, uma breve descrição de uma linha e a referência bíblica principal. Formate a resposta como uma lista simples, com cada sugestão separada por uma nova linha.`;
    }

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    
    const text = response.text;
    if (!text) {
        return ["Não foi possível gerar sugestões. Tente novamente."];
    }

    // Split the response text into an array of ideas
    return text.split('\n').filter(idea => idea.trim() !== '');

  } catch (error) {
    console.error("Error calling Gemini API:", error);
    return ["Ocorreu um erro ao buscar sugestões. Verifique sua chave de API e a conexão."];
  }
};

export const getRandomThemeSuggestion = async (ageGroup: string = 'Crianças'): Promise<string> => {
    try {
        const prompt = `Sugira um único tema bíblico criativo, curto e cativante para uma aula infantil (Faixa etária: ${ageGroup}). Responda apenas com o título do tema, sem aspas, sem explicações e sem referências.`;
        
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });

        return response.text?.trim() ?? "A Criação do Mundo";
    } catch (error) {
        console.error("Error generating random theme:", error);
        return "A Arca de Noé"; // Fallback
    }
}

export const generateCreativeThemes = async (ageGroup: string = 'Crianças', baseTheme?: string): Promise<string[]> => {
    try {
        if (!baseTheme || baseTheme.trim() === '') {
            return [];
        }

        const prompt = `Gere 5 variações de títulos criativos para uma aula bíblica infantil ESTRITAMENTE sobre o tema: "${baseTheme}".
            Faixa etária: ${ageGroup}.
            Os títulos devem ser curtos, cativantes e despertar a curiosidade.
            Não fuja do assunto principal.
            Retorne APENAS a lista de títulos, um por linha, sem numeração, sem marcadores e sem descrições.`;
        
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });

        const text = response.text;
        if (!text) return [];

        // Filter and clean up the response
        return text
            .split('\n')
            .map(t => t.replace(/^[-*•\d\.]+\s*/, '').replace(/["']/g, '').trim()) // Remove bullets, numbers, quotes
            .filter(t => t.length > 0);

    } catch (error) {
        console.error("Error generating creative themes:", error);
        return [];
    }
}

export const generateLessonPlan = async (theme: string, ageGroup?: string): Promise<string> => {
  try {
    let ageContext = '';
    let extraInstructions = '';

    if (ageGroup === 'Livre') {
        ageContext = ' para uma turma multietária (crianças de várias idades juntas)';
        extraInstructions = '- **Dicas de Adaptação Multietária**: Sugira como simplificar a atividade para os menores (2-5 anos) e como aprofundar para os maiores (6-10+ anos).';
    } else {
        ageContext = ageGroup ? ` para crianças de ${ageGroup}` : ' para crianças';
    }

    const prompt = `Crie um plano de aula bíblico detalhado${ageContext} sobre o tema "${theme}". A estrutura deve ser clara, envolvente e instrutiva. Inclua as seguintes seções, cada uma com um título em negrito:
- **Título Criativo**: Um nome divertido e memorável para a aula.
- **Referência Bíblica Principal**: Onde a história se encontra na Bíblia.
- **Objetivo da Aula**: O que as crianças devem aprender ou sentir ao final.
- **Introdução Lúdica**: Uma atividade rápida ou pergunta para captar a atenção das crianças (ex: uma brincadeira, uma pergunta curiosa).
- **Contação da História**: Um resumo da história bíblica de forma simples e cativante.
- **Atividade Prática**: Uma sugestão de atividade manual ou brincadeira que reforce o ensinamento da aula.
${extraInstructions}
- **Oração Final**: Um exemplo de oração curta relacionada ao tema da aula.

Formate a resposta de forma organizada.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text ?? "Não foi possível gerar o plano de aula. Tente novamente.";
  } catch (error) {
    console.error("Error generating lesson plan:", error);
    return "Ocorreu um erro ao gerar o plano de aula. Verifique o console para mais detalhes.";
  }
};

export const generateColoringImage = async (theme: string): Promise<string | null> => {
   try {
    // Prompt atualizado para estilo faceless (sem rosto)
    const prompt = `Desenho para colorir para crianças, sobre "${theme}", com linhas pretas grossas e claras, fundo branco, estilo cartoon simples, sem texto, ideal para impressão. IMPORTANTE: Os personagens humanos devem ser desenhados no estilo 'faceless' (SEM ROSTO), ou seja, sem desenhar olhos, boca ou nariz.`;
    
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
            parts: [{ text: prompt }],
        },
        config: {
            responseModalities: [Modality.IMAGE],
        },
    });

    for (const part of response.candidates?.[0]?.content?.parts ?? []) {
        if (part.inlineData) {
            return part.inlineData.data;
        }
    }
    return null;
  } catch (error) {
    console.error("Error generating coloring image:", error);
    return null;
  }
};