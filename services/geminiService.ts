import { GoogleGenAI, Type } from "@google/genai";
import { Subject, Question } from "../types";
import { getMockQuestions } from "./mockQuestionBank";

// Initialize Gemini Client
const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export const generateQuestionsForSubject = async (
  subject: Subject,
  count: number
): Promise<Question[]> => {
  if (!apiKey) {
    console.warn("No API Key found. Using Question Bank.");
    return getMockQuestions(subject, count);
  }

  const prompt = `Generate ${count} multiple-choice questions for the subject "${subject}" suitable for a Class VI RMS (Rashtriya Military School) Entrance Exam. 
  Ensure questions are challenging but age-appropriate.
  For Maths, include word problems and arithmetic.
  For English, include grammar, vocabulary, and comprehension style questions.
  For GK, include recent current affairs and static GK.
  For Reasoning, include logical sequences, coding-decoding, and analogies.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              text: { type: Type.STRING, description: "The question text" },
              options: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: "A list of 4 options",
              },
              correctAnswerIndex: {
                type: Type.INTEGER,
                description: "The index (0-3) of the correct answer",
              },
              explanation: {
                type: Type.STRING,
                description: "Brief explanation of the answer",
              },
            },
            required: ["text", "options", "correctAnswerIndex", "explanation"],
          },
        },
      },
    });

    const rawData = response.text;
    if (!rawData) {
      throw new Error("Empty response from Gemini");
    }

    const parsedData: any[] = JSON.parse(rawData);

    // Map to our internal type and add IDs
    return parsedData.map((q, index) => ({
      id: `${subject.substring(0, 3).toUpperCase()}-${Date.now()}-${index}`,
      text: q.text,
      options: q.options,
      correctAnswerIndex: q.correctAnswerIndex,
      explanation: q.explanation,
    }));
  } catch (error) {
    console.error(`Error generating questions for ${subject}:`, error);
    // Fallback to robust question bank
    return getMockQuestions(subject, count);
  }
};