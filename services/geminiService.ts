import { GoogleGenAI, Type } from "@google/genai";
import { Subject, Question } from "../types";

// Initialize Gemini Client
// CRITICAL: The API key must be provided via process.env.API_KEY
const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export const generateQuestionsForSubject = async (
  subject: Subject,
  count: number
): Promise<Question[]> => {
  if (!apiKey) {
    console.warn("No API Key found. Returning mock data.");
    return generateMockQuestions(subject, count);
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
    // Fallback to mock data if API fails
    return generateMockQuestions(subject, count);
  }
};

// Fallback Mock Data Generator
const generateMockQuestions = (subject: Subject, count: number): Question[] => {
  const mocks: Record<Subject, Question[]> = {
    [Subject.ENGLISH]: [
      {
        id: 'ENG-1',
        text: 'Identify the synonym of "Benevolent".',
        options: ['Cruel', 'Kind', 'Angry', 'Passive'],
        correctAnswerIndex: 1,
        explanation: 'Benevolent means well meaning and kindly.'
      },
      {
        id: 'ENG-2',
        text: 'Choose the correct preposition: The cat jumped ___ the table.',
        options: ['in', 'on', 'upon', 'at'],
        correctAnswerIndex: 2,
        explanation: 'Upon suggests motion towards the surface.'
      }
    ],
    [Subject.GK]: [
      {
        id: 'GK-1',
        text: 'Who is known as the "Iron Man of India"?',
        options: ['M.K. Gandhi', 'J.L. Nehru', 'Sardar Patel', 'B.R. Ambedkar'],
        correctAnswerIndex: 2,
        explanation: 'Sardar Vallabhbhai Patel played a key role in integrating India.'
      },
      {
        id: 'GK-2',
        text: 'Which is the largest planet in our solar system?',
        options: ['Earth', 'Mars', 'Jupiter', 'Saturn'],
        correctAnswerIndex: 2,
        explanation: 'Jupiter is the largest planet.'
      }
    ],
    [Subject.REASONING]: [
      {
        id: 'REA-1',
        text: 'Find the next number in the series: 2, 4, 8, 16, ?',
        options: ['24', '30', '32', '20'],
        correctAnswerIndex: 2,
        explanation: 'The pattern is doubling the previous number. 16 * 2 = 32.'
      },
      {
        id: 'REA-2',
        text: 'If CAT is coded as 3120, how is BAT coded?',
        options: ['2120', '2012', '2102', '2202'],
        correctAnswerIndex: 0,
        explanation: 'A=1, B=2, T=20. So BAT = 2-1-20.'
      }
    ],
    [Subject.MATHS]: [
      {
        id: 'MAT-1',
        text: 'What is the perimeter of a square with side 5cm?',
        options: ['20cm', '25cm', '15cm', '10cm'],
        correctAnswerIndex: 0,
        explanation: 'Perimeter of square = 4 * side = 4 * 5 = 20.'
      },
      {
        id: 'MAT-2',
        text: 'Simplify: 12 + 8 ÷ 4',
        options: ['5', '14', '16', '10'],
        correctAnswerIndex: 1,
        explanation: 'Using BODMAS, division comes first. 8/4 = 2. Then 12 + 2 = 14.'
      }
    ]
  };

  // Duplicate logic to reach requested count for mock
  let result = [...(mocks[subject] || [])];
  while (result.length < count && result.length > 0) {
     result = [...result, ...result.map(q => ({...q, id: q.id + Math.random()}))];
  }
  return result.slice(0, count);
};