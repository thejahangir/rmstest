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
  // Navigation State
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [navFilter, setNavFilter] = useState<'all' | 'correct' | 'incorrect'>('all');

  const solutionsRef = useRef<HTMLDivElement>(null);
  const questionRefs = useRef<(HTMLDivElement | null)[]>([]);

  const allQuestions = [
      ...questions[Subject.ENGLISH].map(q => ({ ...q, subject: Subject.ENGLISH })),
      ...questions[Subject.GK].map(q => ({ ...q, subject: Subject.GK })),
      ...questions[Subject.REASONING].map(q => ({ ...q, subject: Subject.REASONING })),
      ...questions[Subject.MATHS].map(q => ({ ...q, subject: Subject.MATHS })),
  ];

  const correctCount = answers.filter(a => a.isCorrect).length;
  const totalCount = allQuestions.length;
  const incorrectCount = totalCount - correctCount;
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

  // Calculate detailed Confidence Score (Accuracy based on attempted)
  const subjectAnalysis = Object.values(Subject).map((subject, index) => {
    const subjectQuestions = questions[subject];
    const subjectQIds = new Set(subjectQuestions.map(q => q.id));
    // Filter answers that belong to this subject
    const subjectAnswers = answers.filter(a => subjectQIds.has(a.questionId));
    
    const attempted = subjectAnswers.length;
    const correct = subjectAnswers.filter(a => a.isCorrect).length;
    
    // Confidence/Accuracy: Correct / Attempted
    // If no questions attempted, confidence is 0
    const confidence = attempted > 0 ? Math.round((correct / attempted) * 100) : 0;
    
    return {
      subject,
      total: subjectQuestions.length,
      attempted,
      correct,
      confidence,
      color: COLORS[index % COLORS.length]
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

  const scrollToQuestion = (index: number) => {
    setIsNavOpen(false); // Close nav on selection
    questionRefs.current[index]?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  return (
    <div className="w-full max-w-5xl mx-auto p-4 md:p-8 pb-24">
      {/* Back to Home Button */}
      <button
        onClick={onRestart}
        className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-6 group text-sm md:text-base animate-fade-in"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 md:w-5 md:h-5 group-hover:-translate-x-1 transition-transform">
          <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
        </svg>
        <span className="font-medium">Back to Home</span>
      </button>

      <div className="text-center mb-8 md:mb-10 animate-fade-in-up">
        <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-2">Exam Results</h1>
        <p className="text-sm md:text-base text-slate-400">RizaJabir MockLab - Class VI Entrance Mock</p>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-8 animate-fade-in-up delay-100">
        {/* Score Card */}
        <div className="bg-surface border border-slate-700 rounded-2xl p-6 flex flex-col items-center justify-center shadow-xl">
           <span className="text-slate-400 text-xs md:text-sm font-bold uppercase tracking-wider mb-2">Total Score</span>
           <div className="relative flex items-center justify-center w-28 h-28 md:w-32 md:h-32">
             <ResponsiveContainer width="100%" height="100%">
               <PieChart>
                 <Pie
                   data={chartData}
                   cx="50%"
                   cy="50%"
                   innerRadius={35}
                   outerRadius={55}
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
                <span className="text-xl md:text-2xl font-bold text-white">{scorePercentage}%</span>
             </div>
           </div>
           <p className="mt-4 text-white text-base md:text-lg font-bold">{correctCount} / {totalCount} Correct</p>
        </div>

        {/* Time Card */}
        <div className="bg-surface border border-slate-700 rounded-2xl p-6 flex flex-col items-center justify-center shadow-xl">
           <span className="text-slate-400 text-xs md:text-sm font-bold uppercase tracking-wider mb-4">Time Taken</span>
           <div className="text-4xl md:text-5xl font-mono font-bold text-secondary mb-2">{formatTime(timeTaken)}</div>
           <p className="text-slate-500 text-xs md:text-sm">Avg time per question: {totalCount > 0 ? Math.round(timeTaken / totalCount) : 0}s</p>
        </div>

        {/* Subject Breakdown Chart */}
        <div className="bg-surface border border-slate-700 rounded-2xl p-6 shadow-xl">
          <span className="text-slate-400 text-xs md:text-sm font-bold uppercase tracking-wider block mb-4 text-center">Subject Performance</span>
          <div className="h-40 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={subjectPerformance}>
                <XAxis dataKey="name" tick={{fill: '#cbd5e1', fontSize: 10, fontWeight: 500}} axisLine={false} tickLine={false} />
                <YAxis hide />
                <Tooltip 
                  cursor={{fill: '#334155', opacity: 0.4}} 
                  contentStyle={{
                    backgroundColor: '#1e293b', 
                    borderColor: '#475569', 
                    color: '#f8fafc', 
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                    fontSize: '12px'
                  }}
                  itemStyle={{ color: '#f8fafc' }}
                />
                <Bar dataKey="percentage" radius={[4, 4, 0, 0]}>
                  {subjectPerformance.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Confidence Score Section */}
      <div className="mb-8 md:mb-10 animate-fade-in-up delay-200">
        <h3 className="text-slate-400 text-xs md:text-sm font-bold uppercase tracking-wider mb-4 border-b border-slate-800 pb-2">Subject Confidence Analysis (Accuracy)</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
          {subjectAnalysis.map((stat) => (
            <div key={stat.subject} className="bg-surface border border-slate-700 rounded-xl p-4 md:p-5 shadow-lg flex flex-col justify-between hover:border-slate-600 transition-colors">
              <div>
                <div className="flex justify-between items-center mb-3">
                   <h4 className="text-sm font-bold text-slate-200 truncate pr-2" title={stat.subject}>{stat.subject}</h4>
                   <span className="text-[10px] font-mono font-bold text-slate-400 bg-slate-900 px-2 py-1 rounded border border-slate-800">
                      {stat.correct}/{stat.attempted}
                   </span>
                </div>
                
                <div className="flex items-baseline gap-2 mb-1">
                  <span className={`text-2xl md:text-3xl font-extrabold ${stat.confidence >= 80 ? 'text-green-400' : stat.confidence >= 50 ? 'text-yellow-400' : 'text-red-400'}`}>
                    {stat.confidence}%
                  </span>
                  <span className="text-[10px] md:text-xs text-slate-500 font-medium">Accuracy</span>
                </div>
              </div>
              
              <div className="w-full h-2 md:h-2.5 bg-slate-900 rounded-full overflow-hidden mt-3 border border-slate-800">
                <div 
                  className="h-full rounded-full transition-all duration-1000 ease-out relative overflow-hidden"
                  style={{ width: `${stat.confidence}%`, backgroundColor: stat.color }}
                >
                  <div className="absolute inset-0 bg-white/20" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col sm:flex-row justify-center gap-3 md:gap-4 mb-8 md:mb-12 animate-fade-in-up delay-300">
        <button
          onClick={handleReviewToggle}
          className="w-full sm:w-auto px-6 md:px-8 py-3 bg-slate-800 border border-slate-600 text-slate-200 font-bold rounded-lg hover:bg-slate-700 hover:text-white hover:border-slate-500 transition-all shadow-lg active:scale-95"
        >
          {showSolutions ? 'Hide Solutions' : 'Review Solutions'}
        </button>

        <button
          onClick={onRestart}
          className="w-full sm:w-auto px-6 md:px-8 py-3 bg-gradient-to-r from-primary to-accent text-white font-bold rounded-lg hover:shadow-primary/50 hover:scale-105 active:scale-95 transition-all shadow-lg"
        >
          Take Another Test
        </button>
      </div>

      {/* Detailed Review */}
      {showSolutions && (
        <div ref={solutionsRef} className="space-y-4 md:space-y-6 animate-fade-in-up">
          
          {/* Summary Section */}
          <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4 md:p-6 text-center relative overflow-hidden">
             <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-secondary opacity-50"></div>
             <h3 className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-3">Performance Overview</h3>
            <p className="text-lg md:text-xl text-slate-200 mb-2">
              You answered <span className="font-bold text-white">{correctCount}</span> out of <span className="font-bold text-white">{totalCount}</span> questions correctly.
            </p>
            <p className="text-base md:text-lg text-slate-400">
              Your overall score is <span className={`font-bold ${scorePercentage >= 80 ? 'text-green-400' : scorePercentage >= 50 ? 'text-yellow-400' : 'text-red-400'}`}>{scorePercentage}%</span>.
            </p>
          </div>

          {/* Sticky Navigation Bar - Refined UX with Collapsible Grid */}
          <div className="sticky top-0 z-30 -mx-4 md:-mx-8">
             <div className="bg-surface/95 backdrop-blur-md border-b border-slate-700 shadow-xl transition-all">
                <div className="max-w-5xl mx-auto px-4 py-2 md:py-3">
                  <div className="flex items-center justify-between">
                     <div className="flex flex-col">
                        <span className="text-sm font-bold text-white">Question Navigator</span>
                        <span className="text-[10px] text-slate-400 hidden sm:inline-block">Jump to specific questions</span>
                     </div>
                     <button 
                       onClick={() => setIsNavOpen(!isNavOpen)}
                       className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${isNavOpen ? 'bg-primary text-white border-primary' : 'bg-slate-800 text-slate-300 border-slate-600 hover:bg-slate-700'}`}
                     >
                       <span>{isNavOpen ? 'Close Grid' : 'Jump to Question'}</span>
                       <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 transition-transform ${isNavOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                       </svg>
                     </button>
                  </div>

                  {/* Collapsible Grid Panel */}
                  <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isNavOpen ? 'max-h-[80vh] opacity-100 mt-4' : 'max-h-0 opacity-0'}`}>
                    
                    {/* Filter Tabs */}
                    <div className="flex gap-2 mb-4 border-b border-slate-700 pb-2 overflow-x-auto no-scrollbar">
                      {[
                        { id: 'all', label: 'All Questions', count: totalCount },
                        { id: 'incorrect', label: 'Incorrect', count: incorrectCount },
                        { id: 'correct', label: 'Correct', count: correctCount },
                      ].map(filter => (
                        <button
                          key={filter.id}
                          onClick={() => setNavFilter(filter.id as any)}
                          className={`px-3 py-1.5 rounded-md text-xs font-bold whitespace-nowrap transition-colors flex items-center gap-2
                            ${navFilter === filter.id 
                              ? 'bg-slate-700 text-white shadow-sm ring-1 ring-slate-500' 
                              : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
                        >
                          {filter.label}
                          <span className={`px-1.5 py-0.5 rounded-full text-[9px] ${navFilter === filter.id ? 'bg-slate-900 text-white' : 'bg-slate-800 text-slate-500'}`}>
                            {filter.count}
                          </span>
                        </button>
                      ))}
                    </div>

                    {/* Question Grid */}
                    <div className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-12 gap-2 pb-4 overflow-y-auto max-h-[50vh] custom-scrollbar">
                       {allQuestions.map((q, idx) => {
                         const isCorrect = answers.find(a => a.questionId === q.id)?.isCorrect;
                         
                         // Filter Logic
                         if (navFilter === 'correct' && !isCorrect) return null;
                         if (navFilter === 'incorrect' && isCorrect) return null;

                         return (
                           <button
                             key={idx}
                             onClick={() => scrollToQuestion(idx)}
                             className={`h-8 md:h-9 rounded-lg flex items-center justify-center text-xs font-bold border transition-all hover:scale-105 active:scale-95
                               ${isCorrect 
                                 ? 'bg-green-500/10 text-green-400 border-green-500/30 hover:bg-green-500 hover:text-white hover:shadow-[0_0_10px_rgba(34,197,94,0.4)]' 
                                 : 'bg-red-500/10 text-red-400 border-red-500/30 hover:bg-red-500 hover:text-white hover:shadow-[0_0_10px_rgba(239,68,68,0.4)]'
                               }`}
                           >
                             {idx + 1}
                           </button>
                         )
                       })}
                    </div>
                  </div>
                </div>
             </div>
          </div>

          <h2 className="text-xl md:text-2xl font-bold text-white mb-4 border-b border-slate-700 pb-2">Detailed Solutions</h2>

          {allQuestions.map((q, index) => {
            const answer = answers.find(a => a.questionId === q.id);
            const userSelected = answer?.selectedOptionIndex ?? -1;
            const isCorrect = answer?.isCorrect;
            
            return (
              <div 
                key={q.id} 
                ref={el => questionRefs.current[index] = el}
                className={`border rounded-xl p-4 md:p-6 scroll-mt-36 md:scroll-mt-48 transition-colors duration-300 ${isCorrect ? 'bg-green-500/5 border-green-500/20' : 'bg-slate-800/40 border-slate-700'}`}
              >
                
                {/* Header with explicit Numbering */}
                <div className="flex flex-col mb-4">
                  <div className="flex justify-between items-center border-b border-slate-700/50 pb-2 md:pb-3 mb-2 md:mb-3">
                     <span className="text-lg md:text-xl font-bold text-white">Question {index + 1}</span>
                     <span className={`text-[10px] md:text-xs font-bold px-2 py-0.5 md:px-3 md:py-1 rounded-full ${isCorrect ? 'text-green-400 bg-green-500/10 ring-1 ring-green-500/30' : 'text-red-400 bg-red-500/10 ring-1 ring-red-500/30'}`}>
                       {isCorrect ? 'Correct' : 'Incorrect'}
                     </span>
                  </div>
                  <div className="mb-2">
                    <span className="inline-block text-[10px] font-bold text-slate-400 uppercase tracking-wider bg-slate-900/50 px-2 py-1 rounded border border-slate-700/50">
                       {q.subject}
                    </span>
                  </div>
                  <h3 className="text-base md:text-lg font-medium text-slate-200 leading-relaxed">{q.text}</h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4 md:mb-6">
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
                               <span className="hidden sm:inline">Your Answer</span>
                               <span className="sm:hidden">Yours</span>
                             </>
                          ) : (
                             <>
                               <span className="hidden sm:inline">Correct Answer</span>
                               <span className="sm:hidden">Correct</span>
                             </>
                          )}
                        </span>
                      );
                    } else if (isWrongSelection) {
                      containerClasses = "border-red-500 bg-red-500/10 text-red-200 ring-1 ring-red-500/40 shadow-[0_0_15px_-3px_rgba(239,68,68,0.15)]";
                      markerClasses = "border-red-500 bg-red-500 text-white font-bold";
                      badge = (
                        <span className="ml-auto shrink-0 text-[10px] uppercase font-bold px-2 py-1 rounded bg-red-500/20 text-red-400 border border-red-500/30 flex items-center gap-1">
                          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                          <span className="hidden sm:inline">Your Selection</span>
                          <span className="sm:hidden">Yours</span>
                        </span>
                      );
                    }

                    return (
                      <div key={i} className={`p-3 md:p-4 rounded-xl border text-sm flex items-center justify-between gap-2 md:gap-3 transition-all ${containerClasses}`}>
                        <div className="flex items-center gap-2 md:gap-3">
                          <div className={`flex items-center justify-center w-5 h-5 md:w-6 md:h-6 rounded-full border text-[10px] md:text-xs flex-shrink-0 ${markerClasses}`}>
                            {String.fromCharCode(65 + i)}
                          </div>
                          <span className="font-medium leading-tight">{opt}</span>
                        </div>
                        {badge}
                      </div>
                    );
                  })}
                </div>

                <div className="bg-slate-900/50 p-4 md:p-5 rounded-xl border border-slate-800/60">
                  <p className="text-sm text-slate-300 leading-relaxed">
                    <span className="text-indigo-400 font-bold uppercase tracking-wider text-[10px] md:text-xs block mb-1">Explanation</span>
                    {q.explanation}
                  </p>
                </div>
              </div>
            );
          })}
          
          <div className="flex justify-center pt-8">
             <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="text-slate-400 hover:text-white text-sm font-semibold transition-colors p-2"
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