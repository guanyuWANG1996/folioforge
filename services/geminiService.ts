import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export const polishText = async (
  text: string, 
  context: 'bio' | 'project' | 'title',
  tone: 'professional' | 'concise' | 'creative' = 'professional'
): Promise<string> => {
  if (!apiKey) {
    console.warn("API Key missing, returning mock response");
    return text + ` (AI Polished - ${tone})`;
  }

  try {
    const model = 'gemini-2.5-flash';
    let prompt = "";

    const toneInstructions = {
        professional: "formal, authoritative, and polished",
        concise: "brief, direct, and to-the-point",
        creative: "engaging, vibrant, and unique"
    };

    switch (context) {
      case 'bio':
        prompt = `Refine the following professional biography to be more ${toneInstructions[tone]}. Keep it suitable for a portfolio website.\n\n"${text}"`;
        break;
      case 'project':
        prompt = `Rewrite the following project description to highlight technical achievements. Make it ${toneInstructions[tone]}.\n\n"${text}"`;
        break;
      case 'title':
        prompt = `Suggest a job title based on this input that sounds ${toneInstructions[tone]}:\n\n"${text}"`;
        break;
    }

    const response = await ai.models.generateContent({
      model,
      contents: prompt,
    });

    return response.text.trim();
  } catch (error) {
    console.error("Gemini API Error:", error);
    return text;
  }
};

export const generateStructure = async (resumeText: string): Promise<any> => {
   if (!apiKey) {
       // Mock response for dev without API key
       return {
           fullName: "Alex 'Mock' Chen",
           title: "Senior Full Stack Engineer",
           email: "alex.mock@example.com",
           bio: "Experienced developer with a focus on React and Node.js ecosystems. Passionate about building scalable web applications.",
           projects: [
               {
                   title: "E-Commerce Platform",
                   description: "Built a scalable shopping platform serving 10k users.",
                   technologies: ["React", "Node.js", "MongoDB"]
               },
               {
                   title: "Portfolio Generator",
                   description: "AI-powered tool for creating personal websites.",
                   technologies: ["TypeScript", "Gemini API", "Tailwind"]
               }
           ]
       };
   }

   try {
       const model = 'gemini-2.5-flash';
       const prompt = `
         You are an expert Resume Parser. 
         Extract the following information from the resume text provided below and return it as a JSON object.
         
         Fields to extract:
         - fullName (string)
         - title (string)
         - email (string)
         - bio (string, summary of the candidate)
         - projects (array of objects with: title, description, technologies (array of strings))
         
         If a field is missing, use an empty string or empty array.
         
         Resume Text:
         ${resumeText}
       `;

       const response = await ai.models.generateContent({
           model,
           contents: prompt,
           config: {
               responseMimeType: 'application/json'
           }
       });

       const text = response.text;
       if (!text) return {};
       return JSON.parse(text);

   } catch (error) {
       console.error("Gemini Parse Error:", error);
       return {};
   }
}