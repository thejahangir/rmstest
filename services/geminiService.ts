import { GoogleGenAI, Type } from "@google/genai";
import { Subject, Question } from "../types";
import { getMockQuestions } from "./mockQuestionBank";

// Initialize Gemini Client
// Note: In a real environment, allow this to be empty and handle gracefully
const apiKey = process.env.API_KEY || '';

export const generateQuestionsForSubject = async (
  subject: Subject,
  count: number
): Promise<Question[]> => {
  // 1. Immediate Fallback if no API Key is configured
  if (!apiKey) {
    console.warn("No API Key found. Using Question Bank.");
    return getMockQuestions(subject, count);
  }

  const ai = new GoogleGenAI({ apiKey });

  // 2. Construct AI Prompt
  const prompt = `Generate ${count} distinct multiple-choice questions for the subject "${subject}" suitable for a Class VI RMS (Rashtriya Military School) Entrance Exam. 
  
  Guidelines:
  - Audience: 10-12 year old students.
  - Difficulty: Balanced mix of Easy, Medium, and Hard.
  - Format: JSON array.
  
  Subject Specifics:
  - Maths: Word problems, arithmetic, geometry, fractions, speed/distance/time.
  - English: Grammar (prepositions, conjunctions, tenses), synonyms/antonyms, vocabulary.
  - GK: Current affairs, Indian history, geography, general science.
  - Reasoning: Logical sequences, analogies, coding-decoding, odd one out, blood relations.

  Output strictly a JSON array of objects with this schema:
  [
    {
      "text": "Question text here",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctAnswerIndex": 0, // Integer 0-3
      "explanation": "Brief explanation why this is correct"
    }
  ]`;

  try {
    console.log(`Fetching ${count} questions for ${subject} via Gemini...`);
    
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
                description: "A list of exactly 4 options",
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

    // 3. Robust JSON Parsing
    // Sometimes models wrap JSON in markdown blocks even when requested as JSON
    let cleanJson = rawData.trim();
    if (cleanJson.startsWith('```json')) {
      cleanJson = cleanJson.replace(/^```json/, '').replace(/```$/, '');
    } else if (cleanJson.startsWith('```')) {
      cleanJson = cleanJson.replace(/^```/, '').replace(/```$/, '');
    }

    const parsedData: any[] = JSON.parse(cleanJson);

    if (!Array.isArray(parsedData) || parsedData.length === 0) {
      throw new Error("Invalid JSON format received from AI");
    }

    // 4. Transform to App Type
    const aiQuestions: Question[] = parsedData.map((q, index) => ({
      id: `${subject.substring(0, 3).toUpperCase()}-AI-${Date.now()}-${index}`,
      text: q.text,
      options: q.options,
      correctAnswerIndex: q.correctAnswerIndex,
      explanation: q.explanation || "No explanation provided.",
    }));

    // 5. Fill Gap if AI returned fewer questions than requested
    if (aiQuestions.length < count) {
      const remaining = count - aiQuestions.length;
      console.warn(`AI returned ${aiQuestions.length}/${count} questions. Filling ${remaining} from mock bank.`);
      const fillQuestions = getMockQuestions(subject, remaining);
      return [...aiQuestions, ...fillQuestions];
    }

    return aiQuestions.slice(0, count);

  } catch (error) {
    console.error(`Error generating questions for ${subject} via AI:`, error);
    console.log("Falling back to Mock Question Bank.");
    
    // 6. Seamless Fallback
    return getMockQuestions(subject, count);
  }
};