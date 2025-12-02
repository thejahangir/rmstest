import React from 'react';
import { Subject } from '../types';

interface StartScreenProps {
  onStart: (countPerSubject: number) => void;
  isLoading: boolean;
}

const StartScreen: React.FC<StartScreenProps> = ({ onStart, isLoading }) => {
  const [questionCount, setQuestionCount] = React.useState<number | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  const handleStart = () => {
    if (questionCount === null) {
      setError("Please select the number of questions.");
      return;
    }
    setError(null);
    onStart(questionCount);
  };

  const handleSelectCount = (count: number) => {
    setQuestionCount(count);
    setError(null);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] text-center px-4 animate-fade-in">
      <div className="bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent mb-6">
        <h1 className="text-6xl font-extrabold tracking-tight">RizaJabir MockLab</h1>
      </div>
      
      <p className="text-xl text-slate-400 mb-8 max-w-2xl">
        The ultimate RMS Entrance Exam (Class VI) preparation platform. 
        Experience our AI-powered mock tests covering English, GK, Reasoning, and Mathematics.
      </p>

      <div className="bg-surface border border-slate-700 p-8 rounded-2xl shadow-2xl w-full max-w-md mb-8">
        <h2 className="text-2xl font-bold text-white mb-6">Configure Exam</h2>
        
        {/* Question Count Selection */}
        <div className="flex flex-col gap-4 mb-6">
          <label className="text-left text-sm font-medium text-slate-300">
            Questions per Subject
          </label>
          <div className={`flex justify-between items-center bg-slate-900 p-2 rounded-lg border transition-colors ${error && !questionCount ? 'border-red-500/50' : 'border-slate-700'}`}>
             {[5, 10, 25, 50].map(count => (
               <button
                key={count}
                type="button"
                disabled={isLoading}
                onClick={() => handleSelectCount(count)}
                className={`px-4 py-2 rounded-md text-sm font-semibold transition-all duration-200 ${
                  questionCount === count 
                  ? 'bg-primary text-white shadow-lg' 
                  : 'text-slate-400 hover:text-white hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent'
                }`}
               >
                 {count}
               </button>
             ))}
          </div>
        </div>
          
        <div className="flex justify-between items-center min-h-[1.25rem] mb-4">
            {error ? (
              <p className="text-xs text-red-400 font-bold animate-pulse">
                {error}
              </p>
            ) : (
              <p className="text-xs text-slate-500 text-left">
                Total Questions: <span className="text-secondary font-bold">{questionCount ? questionCount * 4 : '-'}</span>
              </p>
            )}
        </div>

        <div className="space-y-3 mb-6 text-left">
           <div className="flex items-center gap-3 text-slate-300">
             <div className="relative group">
               <span className="w-3 h-3 rounded-full bg-blue-500 block ring-2 ring-blue-500/20 cursor-help transition-transform group-hover:scale-110"></span>
               <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 px-2 py-1 bg-slate-800 border border-slate-700 text-white text-xs font-medium rounded shadow-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                 English Language
               </div>
             </div>
             <span>English</span>
           </div>
           
           <div className="flex items-center gap-3 text-slate-300">
             <div className="relative group">
               <span className="w-3 h-3 rounded-full bg-green-500 block ring-2 ring-green-500/20 cursor-help transition-transform group-hover:scale-110"></span>
               <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 px-2 py-1 bg-slate-800 border border-slate-700 text-white text-xs font-medium rounded shadow-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                 GK & Current Affairs
               </div>
             </div>
             <span>GK & Current Affairs</span>
           </div>
           
           <div className="flex items-center gap-3 text-slate-300">
             <div className="relative group">
               <span className="w-3 h-3 rounded-full bg-purple-500 block ring-2 ring-purple-500/20 cursor-help transition-transform group-hover:scale-110"></span>
               <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 px-2 py-1 bg-slate-800 border border-slate-700 text-white text-xs font-medium rounded shadow-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                 Intelligence & Reasoning
               </div>
             </div>
             <span>Reasoning</span>
           </div>
           
           <div className="flex items-center gap-3 text-slate-300">
             <div className="relative group">
               <span className="w-3 h-3 rounded-full bg-orange-500 block ring-2 ring-orange-500/20 cursor-help transition-transform group-hover:scale-110"></span>
               <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 px-2 py-1 bg-slate-800 border border-slate-700 text-white text-xs font-medium rounded shadow-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                 Mathematics
               </div>
             </div>
             <span>Mathematics</span>
           </div>
        </div>

        <button
          onClick={handleStart}
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