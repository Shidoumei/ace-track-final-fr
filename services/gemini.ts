
import { GoogleGenAI } from "@google/genai";
import { PaperProgress, Subject, Mistake } from "../types";

export const getAIStudyAdvice = async (
  subject: Subject, 
  progress: PaperProgress[]
): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const completedPapers = progress.filter(p => p.status === 'Completed');
  const allMistakes: Mistake[] = completedPapers.flatMap(p => p.mistakes || []);
  
  const mistakeSummary = allMistakes.reduce((acc: Record<string, number>, m) => {
    acc[m.category] = (acc[m.category] || 0) + 1;
    return acc;
  }, {});

  const prompt = `
    Subject: ${subject.name} (${subject.level})
    Syllabus Code: ${subject.code}
    Papers completed: ${completedPapers.length}
    
    Mistake Categories distribution:
    ${JSON.stringify(mistakeSummary)}

    Recent specific mistakes logged by the student:
    ${allMistakes.slice(-10).map(m => `- [${m.category}] ${m.description}`).join('\n')}

    As an expert academic tutor, provide a concise (3-4 bullet points) study strategy. 
    Analyze the mistake patterns. If they are mostly "Silly Errors", suggest focus and checking techniques. 
    If they are "Conceptual Gaps", recommend deep-diving into the specific topics mentioned.
    Keep the tone encouraging, professional, and actionable. Avoid generic advice.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: [{ parts: [{ text: prompt }] }],
      config: {
        thinkingConfig: { thinkingBudget: 0 },
        temperature: 0.7,
      }
    });

    return response.text || "Keep tracking your mistakes to see patterns! Your data is currently too sparse for a detailed analysis.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "The AI tutor is currently taking a break. Review your mistake categories manually to see if you're repeating the same types of errors.";
  }
};
