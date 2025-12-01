import React, { useState, useEffect } from 'react';
import { Question, Subject, UserAnswer } from '../types';

interface QuizViewProps {
  questions: Record<Subject, Question[]>;
  onComplete: (answers: UserAnswer[], timeTaken: number) => void;
}

const QuizView: React.FC<QuizViewProps> = ({ questions, onComplete }) => {
  // Flatten questions into a single array for linear navigation
  const allQuestions = React.useMemo(() => {
    return [
      ...questions[Subject.ENGLISH].map(q => ({ ...q, subject: Subject.ENGLISH })),
      ...questions[Subject.GK].map(q => ({ ...q, subject: Subject.GK })),
      ...questions[Subject.REASONING].map(q => ({ ...q, subject: Subject.REASONING })),
      ...questions[Subject.MATHS].map(q => ({ ...q, subject: Subject.MATHS })),
    ];
  }, [questions]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<UserAnswer[]>([]);
  const [timeLeft, setTimeLeft] = useState(0); // Count up timer

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const currentQuestion = allQuestions[currentIndex];

  const handleOptionSelect = (optionIndex: number) => {
    const newAnswer: UserAnswer = {
      questionId: currentQuestion.id,
      selectedOptionIndex: optionIndex,
      isCorrect: optionIndex === currentQuestion.correctAnswerIndex
    };

    setAnswers(prev => {
      const existing = prev.findIndex(a => a.questionId === currentQuestion.id);
      if (existing !== -1) {
        const updated = [...prev];
        updated[existing] = newAnswer;
        return updated;
      }
      return [...prev, newAnswer];
    });
  };

  const currentAnswerIndex = answers.find(a => a.questionId === currentQuestion.id)?.selectedOptionIndex;

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Determine subject color
  const getSubjectColor = (subj: Subject) => {
    switch (subj) {
      case Subject.ENGLISH: return 'text-blue-400 bg-blue-400/10 border-blue-400/20';
      case Subject.GK: return 'text-green-400 bg-green-400/10 border-green-400/20';
      case Subject.REASONING: return 'text-purple-400 bg-purple-400/10 border-purple-400/20';
      case Subject.MATHS: return 'text-orange-400 bg-orange-400/10 border-orange-400/20';
      default: return 'text-slate-400';
    }
  };

  const isLastQuestion = currentIndex === allQuestions.length - 1;

  return (
    <div className="w-full max-w-4xl mx-auto p-4 md:p-6 pb-24">
      {/* Header Bar */}
      <div className="sticky top-4 z-20 flex items-center justify-between bg-surface/80 backdrop-blur-md border border-slate-700 rounded-xl p-4 shadow-lg mb-8">
        <div className="flex flex-col">
          <span className="text-xs text-slate-400 uppercase tracking-wider font-bold">Time Elapsed</span>
          <span className="text-xl font-mono text-white font-bold">{formatTime(timeLeft)}</span>
        </div>
        
        <div className="flex flex-col items-end">
          <span className="text-xs text-slate-400 uppercase tracking-wider font-bold">Progress</span>
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold text-white">{currentIndex + 1}</span>
            <span className="text-sm text-slate-500">/ {allQuestions.length}</span>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-1.5 bg-slate-800 rounded-full mb-8 overflow-hidden">
        <div 
          className="h-full bg-gradient-to-r from-primary to-secondary transition-all duration-300 ease-out"
          style={{ width: `${((currentIndex + 1) / allQuestions.length) * 100}%` }}
        />
      </div>

      {/* Question Card */}
      <div className="bg-surface border border-slate-700 rounded-2xl p-6 md:p-10 shadow-xl relative overflow-hidden">
        <div className={`absolute top-0 left-0 w-1 h-full ${getSubjectColor(currentQuestion.subject).split(' ')[1].replace('/10', '')}`} />
        
        <div className="flex justify-between items-start mb-6">
          <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getSubjectColor(currentQuestion.subject)}`}>
            {currentQuestion.subject}
          </span>
          <span className="text-slate-500 text-xs font-mono">ID: {currentQuestion.id.split('-')[1]}</span>
        </div>

        <h2 className="text-2xl md:text-3xl font-bold text-white mb-8 leading-snug">
          {currentQuestion.text}
        </h2>

        <div className="grid grid-cols-1 gap-4">
          {currentQuestion.options.map((option, idx) => {
            const isSelected = currentAnswerIndex === idx;
            return (
              <button
                key={idx}
                onClick={() => handleOptionSelect(idx)}
                className={`group flex items-center p-4 rounded-xl border-2 transition-all duration-200 text-left
                  ${isSelected 
                    ? 'border-primary bg-primary/10 text-white shadow-lg shadow-primary/10' 
                    : 'border-slate-700 bg-slate-900/50 text-slate-300 hover:border-slate-500 hover:bg-slate-800'
                  }`}
              >
                <div className={`flex items-center justify-center w-8 h-8 rounded-full mr-4 text-sm font-bold border transition-colors
                  ${isSelected ? 'bg-primary border-primary text-white' : 'border-slate-600 text-slate-500 group-hover:border-slate-400'}
                `}>
                  {String.fromCharCode(65 + idx)}
                </div>
                <span className="text-lg">{option}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Navigation Footer - Sticky */}
      <div className="fixed bottom-0 left-0 w-full bg-slate-900/90 backdrop-blur-lg border-t border-slate-800 p-4 z-30">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
           <button
             onClick={() => setCurrentIndex(prev => Math.max(0, prev - 1))}
             disabled={currentIndex === 0}
             className="px-6 py-3 rounded-lg font-bold text-slate-300 hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
           >
             Previous
           </button>

           <div className="flex gap-2">
             <button
               onClick={() => setCurrentIndex(prev => Math.min(allQuestions.length - 1, prev + 1))}
               className={`px-6 py-3 rounded-lg font-bold bg-slate-800 text-white hover:bg-slate-700 transition-colors ${isLastQuestion ? 'hidden' : 'block'}`}
             >
               Next Question
             </button>
             
             {isLastQuestion && (
               <button
                onClick={() => onComplete(answers, timeLeft)}
                className="px-8 py-3 rounded-lg font-bold bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg hover:shadow-green-500/20 hover:scale-105 transition-all"
               >
                 Submit Exam
               </button>
             )}
           </div>
        </div>
      </div>
    </div>
  );
};

export default QuizView;