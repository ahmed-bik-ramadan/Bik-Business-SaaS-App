import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Clock } from 'lucide-react';
import { useDiagnosticStore } from '../store/diagnosticStore';
import { universalQuestions } from '../data/universalQuestions';
import { sectorQuestions } from '../data/sectorQuestions';
import { DEEP_TIER_QUESTIONS } from '../data/sectorFinancialTaxonomy';
import { deltaQuestions } from '../data/deltaQuestions';
import { toastMessages } from '../data/toastMessages';
import { saveProgress, trackEvent } from '../services/supabase';

// Reusing the UniversalQuestion type
import type { UniversalQuestion } from '../data/universalQuestions';

const Questionnaire: React.FC = () => {
  const navigate = useNavigate();
  const { 
    sessionId, 
    sectorL1, 
    sectorL2, 
    userName, 
    universalAnswers, 
    sectorAnswers,
    diagnosticDepth,
    instantScore,
    setField
  } = useDiagnosticStore();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [toast, setToast] = useState<{ text: string, id: number } | null>(null);
  const [currentValue, setCurrentValue] = useState<any>(null);

  // We combine universal questions, sector questions, deep tier questions if deep mode is active, and subsector delta questions if available
  const sectorQs: UniversalQuestion[] = sectorQuestions[sectorL1] || [];
  const deepQs: UniversalQuestion[] = (diagnosticDepth === 'deep' && DEEP_TIER_QUESTIONS[sectorL1]) ? DEEP_TIER_QUESTIONS[sectorL1] : [];
  const subsectorDeltaQs: UniversalQuestion[] = deltaQuestions[sectorL2] || [];
  const allQuestions = [...universalQuestions, ...sectorQs, ...deepQs, ...subsectorDeltaQs];
  const totalQuestions = allQuestions.length;
  
  const question = allQuestions[currentIndex];
  const isUniversal = currentIndex < universalQuestions.length;

  useEffect(() => {
    trackEvent(sessionId, 'page_view', { page: 'questionnaire' }).catch(console.error);
    window.scrollTo(0, 0);
  }, [sessionId]);

  useEffect(() => {
    // Reset currentValue when question changes
    if (question) {
      if (question.type === 'slider') {
        setCurrentValue(question.min || 0);
      } else if (question.type === 'multi_choice') {
        setCurrentValue([]);
      } else {
        setCurrentValue('');
      }
    }
  }, [currentIndex, question]);

  const showToast = (key: string) => {
    const msg = toastMessages[key];
    if (msg) {
      const id = Date.now();
      setToast({ text: msg.text, id });
      setTimeout(() => {
        setToast(current => current?.id === id ? null : current);
      }, 3000);
    }
  };

  const handleNext = async (answer: any) => {
    // Save answer
    if (isUniversal) {
      const newAnswers = { ...universalAnswers, [question.id]: answer };
      setField('universalAnswers', newAnswers);
      setField('universalProgress', Math.round(((currentIndex + 1) / universalQuestions.length) * 100));
      
      if (question.id === 'u30') {
        try {
          const { computeInstantScore } = await import('../services/deterministicScoring');
          const scoreResult = computeInstantScore(newAnswers);
          setField('instantScore', scoreResult.overall);
          setField('axisScores', scoreResult.axisScores);
        } catch (e) {
          console.error("Error computing deterministic score:", e);
        }
      }
    } else {
      const newAnswers = { ...sectorAnswers, [question.id]: answer };
      setField('sectorAnswers', newAnswers);
      const totalNonUniversal = sectorQs.length + deepQs.length + subsectorDeltaQs.length;
      const completedNonUniversal = currentIndex - universalQuestions.length + 1;
      setField('sectorProgress', Math.round((completedNonUniversal / (totalNonUniversal || 1)) * 100));
    }

    showToast(question.toastKey);

    // Save to supabase every 5 questions non-blocking
    if ((currentIndex + 1) % 5 === 0) {
      console.time(`saveProgress_q_${currentIndex}`);
      saveProgress(sessionId, {
        universal_answers: isUniversal ? { ...universalAnswers, [question.id]: answer } : universalAnswers,
        sector_answers: isUniversal ? sectorAnswers : { ...sectorAnswers, [question.id]: answer }
      }).then(() => {
        console.timeEnd(`saveProgress_q_${currentIndex}`);
      }).catch((e) => {
        console.timeEnd(`saveProgress_q_${currentIndex}`);
        console.error("Non-blocking saveProgress error:", e);
      });
    }

    console.time(`navigation_q_${currentIndex}`);
    if (currentIndex + 1 < totalQuestions) {
      setCurrentIndex(prev => prev + 1);
      console.timeEnd(`navigation_q_${currentIndex}`);
    } else {
      // Finished all questions - save and navigate non-blocking
      saveProgress(sessionId, {
        universal_answers: isUniversal ? { ...universalAnswers, [question.id]: answer } : universalAnswers,
        sector_answers: isUniversal ? sectorAnswers : { ...sectorAnswers, [question.id]: answer },
        completion_pct: 100
      }).catch((e) => console.error("Final non-blocking saveProgress error:", e));
      
      console.timeEnd(`navigation_q_${currentIndex}`);
      navigate('/processing');
    }
  };

  const handleSingleSelect = (val: string) => {
    setCurrentValue(val);
    setTimeout(() => {
      handleNext(val);
    }, 300);
  };

  const toggleMultiSelect = (val: string) => {
    setCurrentValue((prev: string[]) => {
      if (prev.includes(val)) {
        return prev.filter(v => v !== val);
      }
      return [...prev, val];
    });
  };

  if (!question) return null;

  // Render transition screen if exactly at the start of sector questions
  if (currentIndex === universalQuestions.length && sectorQs.length > 0 && !currentValue) {
    return (
      <div className="min-h-screen bg-[#0F172A] flex flex-col items-center justify-center p-6 rtl font-arabic">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-6 leading-tight">
            ممتاز {userName}
          </h1>
          <p className="text-xl text-[#94A3B8] mb-12">
            الآن 12 سؤالاً متخصصاً في {sectorL2}
          </p>
          <button 
            onClick={() => setCurrentValue('transition_done')}
            className="bg-[#EF4444] hover:bg-red-600 text-white font-bold text-lg py-4 px-12 rounded-xl shadow-lg transition-colors"
          >
            استمرار
          </button>
        </motion.div>
      </div>
    );
  }

  const progressPct = Math.round(((currentIndex) / totalQuestions) * 100);
  const estMins = Math.ceil((totalQuestions - currentIndex) * (8 / 42)); // rough estimate

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-24 rtl font-arabic relative overflow-hidden">
      
      {/* Toast Notification */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -100, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed top-0 left-0 right-0 z-[9999] p-4 flex justify-center pointer-events-none"
          >
            <div className="bg-[#0F172A] text-white text-sm md:text-base px-6 py-4 rounded-xl shadow-2xl max-w-2xl w-full text-center font-medium border-b-4 border-[#EF4444]">
              {toast.text}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Top Bar / Progress */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-40 p-4">
        <div className="max-w-3xl mx-auto w-full">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-[#64748B]">السؤال {currentIndex + 1} من {totalQuestions}</span>
            <span className="text-sm font-bold text-[#0F172A]">+{progressPct}%</span>
          </div>
          <div className="w-full bg-[#E2E8F0] h-2 rounded-full overflow-hidden flex flex-row-reverse">
            <div 
              className="bg-[#EF4444] h-full transition-all duration-500 ease-out"
              style={{ width: `${progressPct}%` }}
            ></div>
          </div>
          
          <div className="flex justify-between items-center mt-4">
            <div className="bg-slate-100 px-3 py-1 rounded-lg text-sm text-slate-600 font-medium">
              البُعد: {question.dimension}
            </div>
            <div className="flex items-center gap-1 text-slate-500 text-sm">
              <Clock size={14} />
              <span>حوالي {estMins} دقيقة</span>
            </div>
          </div>

          {instantScore !== null && currentIndex >= universalQuestions.length && (
            <div className="mt-3 bg-emerald-50 text-emerald-800 border border-emerald-100 rounded-xl p-3 text-center text-sm font-medium flex items-center justify-center gap-2 shadow-sm">
              <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>مؤشرك الأولي: <strong className="text-emerald-950 font-bold text-base">{instantScore}/100</strong> — يتحسن دقة مع الأسئلة القادمة</span>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-3xl mx-auto w-full p-4 mt-8 flex flex-col items-center">
        
        <AnimatePresence mode="wait">
          <motion.div
            key={question.id}
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 50 }}
            transition={{ duration: 0.2 }}
            className="w-full max-w-[600px] bg-white rounded-2xl shadow-sm border border-slate-200 p-6 md:p-8"
          >
            <span className="block text-xs font-bold text-slate-400 mb-4 uppercase tracking-widest">
              السؤال {currentIndex + 1}
            </span>
            <h2 className="text-xl md:text-2xl font-bold text-[#0F172A] mb-8 leading-relaxed">
              {question.question}
            </h2>

            <div className="space-y-4">
              
              {/* SINGLE CHOICE */}
              {question.type === 'single_choice' && question.options?.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => handleSingleSelect(opt.value)}
                  className={`w-full text-right p-4 rounded-xl border-2 transition-colors flex justify-between items-center
                    ${currentValue === opt.value 
                      ? 'border-[#EF4444] bg-red-50 text-[#EF4444]' 
                      : 'border-slate-200 text-slate-700 hover:border-red-300'
                    }
                  `}
                >
                  <span className="font-medium text-lg">{opt.label}</span>
                  {currentValue === opt.value && (
                    <div className="w-5 h-5 rounded-full bg-[#EF4444] flex items-center justify-center text-white">
                      ✓
                    </div>
                  )}
                </button>
              ))}

              {/* MULTI CHOICE */}
              {question.type === 'multi_choice' && (
                <>
                  <div className="space-y-3 mb-6">
                    {question.options?.map((opt) => {
                      const isSelected = Array.isArray(currentValue) && currentValue.includes(opt.value);
                      return (
                        <button
                          key={opt.value}
                          onClick={() => toggleMultiSelect(opt.value)}
                          className={`w-full text-right p-4 rounded-xl border-2 transition-colors flex items-center gap-3
                            ${isSelected ? 'border-[#EF4444] bg-red-50 text-[#EF4444]' : 'border-slate-200 text-slate-700 hover:border-red-300'}`}
                        >
                          <div className={`w-5 h-5 rounded flex items-center justify-center border-2 ${isSelected ? 'border-[#EF4444] bg-[#EF4444] text-white' : 'border-slate-300'}`}>
                            {isSelected && '✓'}
                          </div>
                          <span className="font-medium text-lg">{opt.label}</span>
                        </button>
                      );
                    })}
                  </div>
                  {Array.isArray(currentValue) && currentValue.length > 0 && (
                    <motion.button
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      onClick={() => handleNext(currentValue)}
                      className="w-full bg-[#EF4444] text-white p-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-red-600 transition-colors"
                    >
                      <span>متابعة</span>
                      <ArrowLeft size={18} />
                    </motion.button>
                  )}
                </>
              )}

              {/* SLIDER */}
              {question.type === 'slider' && (
                <div className="py-6">
                  <div className="text-center mb-8">
                    <span className="text-4xl font-bold text-[#EF4444]">
                      {currentValue !== null ? currentValue : (question.min || 0)}
                    </span>
                    {question.unit && <span className="text-slate-500 mr-2 text-lg">{question.unit}</span>}
                  </div>
                  <input
                    type="range"
                    min={question.min}
                    max={question.max}
                    step={question.step}
                    value={currentValue !== null ? currentValue : (question.min || 0)}
                    onChange={(e) => setCurrentValue(parseInt(e.target.value))}
                    className="w-full accent-[#EF4444] h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                    dir="rtl"
                  />
                  <div className="flex justify-between text-sm text-slate-500 mt-4 px-1">
                    <span>{question.min}</span>
                    <span>{question.max}</span>
                  </div>
                  
                  <motion.button
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    onClick={() => handleNext(currentValue !== null ? currentValue : (question.min || 0))}
                    className="w-full mt-10 bg-[#EF4444] text-white p-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-red-600 transition-colors"
                  >
                    <span>متابعة</span>
                    <ArrowLeft size={18} />
                  </motion.button>
                </div>
              )}

              {/* TEXT */}
              {question.type === 'text' && (
                <div>
                  <textarea
                    value={currentValue || ''}
                    onChange={(e) => setCurrentValue(e.target.value)}
                    placeholder={question.placeholder || "اكتب إجابتك هنا..."}
                    className="w-full border-2 border-slate-200 rounded-xl p-4 min-h-[150px] focus:border-[#EF4444] focus:outline-none resize-none text-lg text-[#0F172A]"
                  />
                  
                  <AnimatePresence>
                    {typeof currentValue === 'string' && currentValue.trim().length > 0 && (
                      <motion.button
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        onClick={() => handleNext(currentValue)}
                        className="w-full mt-6 bg-[#EF4444] text-white p-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-red-600 transition-colors"
                      >
                        <span>متابعة</span>
                        <ArrowLeft size={18} />
                      </motion.button>
                    )}
                  </AnimatePresence>
                </div>
              )}

            </div>
          </motion.div>
        </AnimatePresence>
      </div>

    </div>
  );
};

export default Questionnaire;
