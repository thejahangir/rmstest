import React from 'react';
import { Subject } from '../types';

interface StartScreenProps {
  onStart: (countPerSubject: number) => void;
  isLoading: boolean;
}

const StartScreen: React.FC<StartScreenProps> = ({ onStart, isLoading }) => {
  const [questionCount, setQuestionCount] = React.useState(10); // Default lower for demo speed

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] text-center px-4 animate-fade-in">
      <div className="bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent mb-6">
        <h1 className="text-6xl font-extrabold tracking-tight">Jabir RMS Test</h1>
      </div>
      
      <p className="text-xl text-slate-400 mb-8 max-w-2xl">
        The ultimate RMS Entrance Exam (Class VI) preparation platform. 
        Experience our AI-powered mock tests covering English, GK, Reasoning, and Mathematics.
      </p>

      <div className="bg-surface border border-slate-700 p-8 rounded-2xl shadow-2xl w-full max-w-md mb-8">
        <h2 className="text-2xl font-bold text-white mb-6">Configure Exam</h2>
        
        <div className="flex flex-col gap-4 mb-6">
          <label className="text-left text-sm font-medium text-slate-300">
            Questions per Subject
          </label>
          <div className="flex justify-between items-center bg-slate-900 p-2 rounded-lg border border-slate-700">
             {[5, 10, 25, 50].map(count => (
               <button
                key={count}
                onClick={() => setQuestionCount(count)}
                className={`px-4 py-2 rounded-md text-sm font-semibold transition-all duration-200 ${
                  questionCount === count 
                  ? 'bg-primary text-white shadow-lg' 
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
               >
                 {count}
               </button>
             ))}
          </div>
          <p className="text-xs text-slate-500 text-left">
            Total Questions: <span className="text-secondary font-bold">{questionCount * 4}</span>
          </p>
        </div>

        <div className="space-y-3 mb-6 text-left">
           <div className="flex items-center gap-2 text-slate-300">
             <span className="w-2 h-2 rounded-full bg-blue-500"></span>
             <span>English</span>
           </div>
           <div className="flex items-center gap-2 text-slate-300">
             <span className="w-2 h-2 rounded-full bg-green-500"></span>
             <span>GK & Current Affairs</span>
           </div>
           <div className="flex items-center gap-2 text-slate-300">
             <span className="w-2 h-2 rounded-full bg-purple-500"></span>
             <span>Reasoning</span>
           </div>
           <div className="flex items-center gap-2 text-slate-300">
             <span className="w-2 h-2 rounded-full bg-orange-500"></span>
             <span>Mathematics</span>
           </div>
        </div>

        <button
          onClick={() => onStart(questionCount)}
          disabled={isLoading}
          className={`w-full py-4 text-lg font-bold rounded-xl text-white shadow-lg transition-all transform hover:scale-[1.02] active:scale-[0.98]
            ${isLoading 
              ? 'bg-slate-700 cursor-not-allowed opacity-70' 
              : 'bg-gradient-to-r from-primary to-accent hover:shadow-primary/50'
            }`}
        >
          {isLoading ? (
            <div className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Generating Paper...
            </div>
          ) : (
            'Start Mock Test'
          )}
        </button>
      </div>

      <p className="text-sm text-slate-500">
        Powered by Google Gemini 2.5 Flash
      </p>
    </div>
  );
};

export default StartScreen;