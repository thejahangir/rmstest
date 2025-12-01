import React, { useState, useRef } from 'react';
import { UserAnswer, Question, Subject } from '../types';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';

interface ResultViewProps {
  answers: UserAnswer[];
  questions: Record<Subject, Question[]>;
  timeTaken: number;
  onRestart: () => void;
}

// Updated colors to match QuizView themes and ensure high contrast on dark backgrounds
// Order: English, GK, Reasoning, Maths
const COLORS = [
  '#60a5fa', // English (Blue 400)
  '#4ade80', // GK (Green 400)
  '#c084fc', // Reasoning (Purple 400)
  '#fb923c', // Maths (Orange 400)
];

const ResultView: React.FC<ResultViewProps> = ({ answers, questions, timeTaken, onRestart }) => {
  const [showSolutions, setShowSolutions] = useState(false);
  const solutionsRef = useRef<HTMLDivElement>(null);

  const allQuestions = [
      ...questions[Subject.ENGLISH],
      ...questions[Subject.GK],
      ...questions[Subject.REASONING],
      ...questions[Subject.MATHS],
  ];

  const correctCount = answers.filter(a => a.isCorrect).length;
  const totalCount = allQuestions.length;
  const scorePercentage = totalCount > 0 ? Math.round((correctCount / totalCount) * 100) : 0;

  // Calculate subject-wise performance
  const subjectPerformance = Object.values(Subject).map(subject => {
    const subjectQuestions = questions[subject];
    const subjectQIds = new Set(subjectQuestions.map(q => q.id));
    const subjectAnswers = answers.filter(a => subjectQIds.has(a.questionId));
    const correct = subjectAnswers.filter(a => a.isCorrect).length;
    return {
      name: subject.split(' ')[0], // Short name
      total: subjectQuestions.length,
      correct: correct,
      percentage: subjectQuestions.length > 0 ? (correct / subjectQuestions.length) * 100 : 0
    };
  });

  const chartData = [
    { name: 'Correct', value: correctCount },
    { name: 'Incorrect', value: totalCount - correctCount },
  ];

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}m ${s}s`;
  };

  const handleReviewToggle = () => {
    setShowSolutions(prev => !prev);
    // Smooth scroll to solutions if opening
    if (!showSolutions) {
      setTimeout(() => {
        solutionsRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto p-4 md:p-8 animate-fade-in pb-20">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-extrabold text-white mb-2">Exam Results</h1>
        <p className="text-slate-400">RizaJabirTest - Class VI Entrance Mock</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Score Card */}
        <div className="bg-surface border border-slate-700 rounded-2xl p-6 flex flex-col items-center justify-center shadow-xl">
           <span className="text-slate-400 text-sm font-bold uppercase tracking-wider mb-2">Total Score</span>
           <div className="relative flex items-center justify-center w-32 h-32">
             <ResponsiveContainer width="100%" height="100%">
               <PieChart>
                 <Pie
                   data={chartData}
                   cx="50%"
                   cy="50%"
                   innerRadius={40}
                   outerRadius={60}
                   fill="#8884d8"
                   paddingAngle={5}
                   dataKey="value"
                 >
                   <Cell fill="#10b981" /> {/* Correct - Green */}
                   <Cell fill="#ef4444" /> {/* Incorrect - Red */}
                 </Pie>
               </PieChart>
             </ResponsiveContainer>
             <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-2xl font-bold text-white">{scorePercentage}%</span>
             </div>
           </div>
           <p className="mt-4 text-white text-lg font-bold">{correctCount} / {totalCount} Correct</p>
        </div>

        {/* Time Card */}
        <div className="bg-surface border border-slate-700 rounded-2xl p-6 flex flex-col items-center justify-center shadow-xl">
           <span className="text-slate-400 text-sm font-bold uppercase tracking-wider mb-4">Time Taken</span>
           <div className="text-5xl font-mono font-bold text-secondary mb-2">{formatTime(timeTaken)}</div>
           <p className="text-slate-500 text-sm">Avg time per question: {totalCount > 0 ? Math.round(timeTaken / totalCount) : 0}s</p>
        </div>

        {/* Subject Breakdown Chart */}
        <div className="bg-surface border border-slate-700 rounded-2xl p-6 shadow-xl">
          <span className="text-slate-400 text-sm font-bold uppercase tracking-wider block mb-4 text-center">Subject Performance</span>
          <div className="h-40 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={subjectPerformance}>
                <XAxis dataKey="name" tick={{fill: '#cbd5e1', fontSize: 11, fontWeight: 500}} axisLine={false} tickLine={false} />
                <YAxis hide />
                <Tooltip 
                  cursor={{fill: '#334155', opacity: 0.4}} 
                  contentStyle={{
                    backgroundColor: '#1e293b', 
                    borderColor: '#475569', 
                    color: '#f8fafc', 
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }}
                  itemStyle={{ color: '#f8fafc' }}
                />
                <Bar dataKey="percentage" radius={[6, 6, 0, 0]}>
                  {subjectPerformance.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row justify-center gap-4 mb-12">
        <button
          onClick={handleReviewToggle}
          className="px-8 py-3 bg-slate-800 border border-slate-600 text-slate-200 font-bold rounded-lg hover:bg-slate-700 hover:text-white hover:border-slate-500 transition-all shadow-lg"
        >
          {showSolutions ? 'Hide Solutions' : 'Review Solutions'}
        </button>

        <button
          onClick={onRestart}
          className="px-8 py-3 bg-gradient-to-r from-primary to-accent text-white font-bold rounded-lg hover:shadow-primary/50 hover:scale-105 transition-all shadow-lg"
        >
          Take Another Test
        </button>
      </div>

      {/* Detailed Review */}
      {showSolutions && (
        <div ref={solutionsRef} className="space-y-6 animate-fade-in-up">
          
          {/* Summary Section */}
          <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 text-center">
            <p className="text-xl text-slate-200 mb-2">
              You answered <span className="font-bold text-white">{correctCount}</span> out of <span className="font-bold text-white">{totalCount}</span> questions correctly.
            </p>
            <p className="text-lg text-slate-400">
              Your overall score is <span className={`font-bold ${scorePercentage >= 40 ? 'text-green-400' : 'text-orange-400'}`}>{scorePercentage}%</span>.
            </p>
          </div>

          <h2 className="text-2xl font-bold text-white mb-4 border-b border-slate-700 pb-2">Detailed Solutions</h2>
          {allQuestions.map((q, index) => {
            const answer = answers.find(a => a.questionId === q.id);
            const userSelected = answer?.selectedOptionIndex ?? -1;
            const isCorrect = answer?.isCorrect;
            
            return (
              <div key={q.id} className={`border rounded-xl p-6 ${isCorrect ? 'bg-green-500/5 border-green-500/20' : 'bg-slate-800/40 border-slate-700'}`}>
                <div className="flex justify-between items-start mb-4">
                   <div className="flex items-center gap-2">
                     <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">{q.subject}</span>
                     <span className="text-slate-600 text-xs">•</span>
                     <span className="text-xs font-bold text-slate-400">Question {index + 1}</span>
                   </div>
                   <span className={`text-xs font-bold px-3 py-1 rounded-full ${isCorrect ? 'text-green-400 bg-green-500/10 ring-1 ring-green-500/30' : 'text-red-400 bg-red-500/10 ring-1 ring-red-500/30'}`}>
                     {isCorrect ? 'Correct' : 'Incorrect'}
                   </span>
                </div>
                
                <h3 className="text-lg font-medium text-white mb-6 leading-relaxed">{q.text}</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
                  {q.options.map((opt, i) => {
                    const isSelected = i === userSelected;
                    const isCorrectOption = i === q.correctAnswerIndex;
                    const isWrongSelection = isSelected && !isCorrectOption;

                    let containerClasses = "border-slate-700 text-slate-400 bg-slate-900/30 hover:bg-slate-800/50";
                    let markerClasses = "border-slate-600 text-slate-500";
                    let badge = null;

                    if (isCorrectOption) {
                      containerClasses = "border-green-500/50 bg-green-500/10 text-green-200 shadow-[0_0_15px_-3px_rgba(34,197,94,0.1)]";
                      markerClasses = "border-green-500 bg-green-500 text-slate-900 font-bold";
                      badge = (
                        <span className="ml-auto shrink-0 text-[10px] uppercase font-bold px-2 py-1 rounded bg-green-500/20 text-green-400 border border-green-500/30 flex items-center gap-1">
                          {isSelected ? (
                             <>
                               <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                               Your Answer
                             </>
                          ) : 'Correct Answer'}
                        </span>
                      );
                    } else if (isWrongSelection) {
                      containerClasses = "border-red-500 bg-red-500/10 text-red-200 ring-1 ring-red-500/40 shadow-[0_0_15px_-3px_rgba(239,68,68,0.15)]";
                      markerClasses = "border-red-500 bg-red-500 text-white font-bold";
                      badge = (
                        <span className="ml-auto shrink-0 text-[10px] uppercase font-bold px-2 py-1 rounded bg-red-500/20 text-red-400 border border-red-500/30 flex items-center gap-1">
                          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                          Your Selection
                        </span>
                      );
                    }

                    return (
                      <div key={i} className={`p-4 rounded-xl border text-sm flex items-center justify-between gap-3 transition-all ${containerClasses}`}>
                        <div className="flex items-center gap-3">
                          <div className={`flex items-center justify-center w-6 h-6 rounded-full border text-xs flex-shrink-0 ${markerClasses}`}>
                            {String.fromCharCode(65 + i)}
                          </div>
                          <span className="font-medium leading-tight">{opt}</span>
                        </div>
                        {badge}
                      </div>
                    );
                  })}
                </div>

                <div className="bg-slate-900/50 p-5 rounded-xl border border-slate-800/60">
                  <p className="text-sm text-slate-300 leading-relaxed">
                    <span className="text-indigo-400 font-bold uppercase tracking-wider text-xs block mb-1">Explanation</span>
                    {q.explanation}
                  </p>
                </div>
              </div>
            );
          })}
          
          <div className="flex justify-center pt-8">
             <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="text-slate-400 hover:text-white text-sm font-semibold transition-colors"
             >
               Back to Top
             </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResultView;