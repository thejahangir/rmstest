export enum Subject {
  ENGLISH = 'English',
  GK = 'GK & Current Affairs',
  REASONING = 'Reasoning',
  MATHS = 'Mathematics'
}

export interface Question {
  id: string;
  text: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
}

export interface QuizResult {
  totalQuestions: number;
  correctAnswers: number;
  score: number;
  timeTakenSeconds: number;
  subjectResults: Record<Subject, { total: number; correct: number }>;
}

export interface UserAnswer {
  questionId: string;
  selectedOptionIndex: number;
  isCorrect: boolean;
}

export type QuizStatus = 'IDLE' | 'LOADING' | 'IN_PROGRESS' | 'COMPLETED';

export interface QuizConfig {
  questionCountPerSubject: number;
}