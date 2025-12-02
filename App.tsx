import React, { useState } from 'react';
import { Subject, Question, UserAnswer, QuizStatus } from './types';
import StartScreen from './components/StartScreen';
import QuizView from './components/QuizView';
import ResultView from './components/ResultView';
import { generateQuestionsForSubject } from './services/geminiService';

// Utility to shuffle array ensuring randomness (Fisher-Yates Shuffle)
const shuffleArray = <T,>(array: T[]): T[] => {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
};

const App: React.FC = () => {
  const [status, setStatus] = useState<QuizStatus>('IDLE');
  const [questions, setQuestions] = useState<Record<Subject, Question[]>>({
    [Subject.ENGLISH]: [],
    [Subject.GK]: [],
    [Subject.REASONING]: [],
    [Subject.MATHS]: []
  });
  
  // Results State
  const [userAnswers, setUserAnswers] = useState<UserAnswer[]>([]);
  const [timeTaken, setTimeTaken] = useState(0);

  const startQuiz = async (countPerSubject: number) => {
    setStatus('LOADING');
    try {
      // Fetch questions for all subjects in parallel to save time
      const [eng, gk, reason, maths] = await Promise.all([
        generateQuestionsForSubject(Subject.ENGLISH, countPerSubject),
        generateQuestionsForSubject(Subject.GK, countPerSubject),
        generateQuestionsForSubject(Subject.REASONING, countPerSubject),
        generateQuestionsForSubject(Subject.MATHS, countPerSubject)
      ]);

      // Randomize the order of questions within each subject explicitly
      // This ensures that even if the generator produces questions in a pattern, 
      // the user sees them in a random order during the quiz.
      const randomizedQuestions = {
        [Subject.ENGLISH]: shuffleArray(eng),
        [Subject.GK]: shuffleArray(gk),
        [Subject.REASONING]: shuffleArray(reason),
        [Subject.MATHS]: shuffleArray(maths)
      };

      setQuestions(randomizedQuestions);
      setStatus('IN_PROGRESS');
    } catch (error) {
      console.error("Failed to start quiz", error);
      setStatus('IDLE');
      alert("Something went wrong while generating questions. Please check your connection or API limit.");
    }
  };

  const handleQuizCompletion = (answers: UserAnswer[], time: number) => {
    setUserAnswers(answers);
    setTimeTaken(time);
    setStatus('COMPLETED');
    window.scrollTo(0, 0);
  };

  const handleRestart = () => {
    setStatus('IDLE');
    setUserAnswers([]);
    setTimeTaken(0);
    setQuestions({
        [Subject.ENGLISH]: [],
        [Subject.GK]: [],
        [Subject.REASONING]: [],
        [Subject.MATHS]: []
    });
  };

  return (
    <div className="min-h-screen bg-background text-slate-100 font-sans selection:bg-primary/30">
      <main className="container mx-auto px-4 py-8">
        
        {/* Simple Navbar */}
        <nav className="flex items-center justify-between mb-8 pb-4 border-b border-slate-800">
           <div className="flex items-center gap-2">
             <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center font-bold text-white shadow-lg">
               R
             </div>
             <span className="text-xl font-bold tracking-tight">RizaJabir MockLab</span>
           </div>
           <div className="text-xs font-medium px-3 py-1 bg-surface border border-slate-700 rounded-full text-slate-400">
             Class VI Entrance
           </div>
        </nav>

        {(status === 'IDLE' || status === 'LOADING') && (
          <StartScreen 
            onStart={startQuiz} 
            isLoading={status === 'LOADING'} 
          />
        )}

        {status === 'IN_PROGRESS' && (
          <QuizView 
            questions={questions} 
            onComplete={handleQuizCompletion} 
          />
        )}

        {status === 'COMPLETED' && (
          <ResultView 
            answers={userAnswers} 
            questions={questions} 
            timeTaken={timeTaken}
            onRestart={handleRestart}
          />
        )}

      </main>
    </div>
  );
};

export default App;