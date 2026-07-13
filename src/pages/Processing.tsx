import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, RefreshCw, MessageCircle } from 'lucide-react';
import { useDiagnosticStore } from '../store/diagnosticStore';
import { generateDiagnosticReport } from '../services/diagnose';

const messages = [
  "جاري تحليل بيانات شركتك...",
  "نفحص الفجوات بين إمكانياتك وأدائك الفعلي...",
  "نستشير 209 مصدراً علمياً وخبرة عملية...",
  "نحدد أعلى نقاط الأثر في وضعك تحديداً...",
  "جاري بناء تقريرك الاستراتيجي...",
  "اكتمل التحليل..."
];

const Processing: React.FC = () => {
  const navigate = useNavigate();
  const store = useDiagnosticStore();
  const { setField, sessionId } = store;
  
  const [messageIndex, setMessageIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<Error | null>(null);
  const [isGenerating, setIsGenerating] = useState(true);

  const runAnalysis = async () => {
    setIsGenerating(true);
    setError(null);
    setProgress(0);
    setMessageIndex(0);

    // Progress calculation to reach 99% in 6 seconds, then hold
    const progressInterval = setInterval(() => {
      setProgress(p => {
        if (p >= 99) return 99;
        // Ticks up to 99 over ~6000ms (120 ticks of 50ms)
        const step = 99 / (6000 / 50);
        const next = p + step;
        return next > 99 ? 99 : next;
      });
    }, 50);

    // Text messages rotation every 1.2 seconds
    const msgInterval = setInterval(() => {
      setMessageIndex(prev => {
        if (prev < messages.length - 1) return prev + 1;
        return prev;
      });
    }, 1200);

    const minimumTimePromise = new Promise(resolve => setTimeout(resolve, 6000));

    try {
      // Call the API
      const report = await generateDiagnosticReport(store);
      
      // Ensure the minimum 6 seconds has elapsed for user experience
      await minimumTimePromise;
      
      // Save report to diagnostic store
      setField('report', report);
      
      // Finish progress bar to 100%
      setProgress(100);
      
      // Clear intervals
      clearInterval(progressInterval);
      clearInterval(msgInterval);

      // Delay slightly for visual feedback before navigating
      setTimeout(() => {
        navigate('/lead-gate');
      }, 500);

    } catch (err: any) {
      // Log the exact error to console with full detail (message, status code if available)
      console.error("CRITICAL ERROR: AI report generation failed on Processing screen.", {
        message: err?.message,
        stack: err?.stack,
        rawError: err
      });

      // Clear intervals immediately
      clearInterval(progressInterval);
      clearInterval(msgInterval);

      // Save error to trigger failure UI
      setError(err instanceof Error ? err : new Error(err?.message || String(err)));
      setIsGenerating(false);
    }
  };

  useEffect(() => {
    runAnalysis();
    // Clean up on unmount
    return () => {
      // We can't clear intervals here directly unless we store them in refs,
      // but runAnalysis cleans them up on success or catch.
    };
  }, []);

  const ahmedWhatsapp = import.meta.env.VITE_AHMED_WHATSAPP || '201066966515';
  const whatsappText = `مرحباً، واجهت مشكلة أثناء تشخيص شركتي على منصة BIK. رمز الجلسة الخاص بي هو: ${sessionId || 'غير متوفر'}`;
  const whatsappUrl = `https://wa.me/${ahmedWhatsapp}?text=${encodeURIComponent(whatsappText)}`;

  return (
    <div className="min-h-screen bg-[#0F172A] flex flex-col items-center justify-center p-6 rtl font-arabic relative overflow-hidden">
      
      {/* Background static decoration */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-20 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-700 via-[#0F172A] to-[#0F172A]" />

      <motion.div
        animate={isGenerating ? { scale: [1, 1.1, 1], opacity: [0.8, 1, 0.8] } : {}}
        transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
        className="mb-12"
      >
        <span className="text-[#EF4444] font-bold text-6xl tracking-wider">BIK</span>
      </motion.div>

      <div className="w-full max-w-md relative z-10">
        <AnimatePresence mode="wait">
          {isGenerating ? (
            <motion.div
              key="loading-state"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center"
            >
              <motion.p
                key={messageIndex}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="text-white text-xl md:text-2xl text-center mb-8 h-16 flex items-center justify-center font-medium"
              >
                {messages[messageIndex]}
              </motion.p>

              <div className="w-full bg-[#1E293B] h-3 rounded-full overflow-hidden flex flex-row-reverse border border-slate-700">
                <div 
                  className="bg-[#EF4444] h-full transition-all ease-linear"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <div className="text-center mt-3 text-slate-500 font-mono text-sm">
                {Math.round(progress)}%
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="error-state"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="bg-[#1E293B] rounded-2xl border border-red-500/30 p-6 md:p-8 text-center shadow-xl shadow-red-500/5"
            >
              <div className="bg-red-500/10 text-red-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 border border-red-500/20">
                <AlertCircle size={32} />
              </div>

              <h2 className="text-xl font-bold text-white mb-3">تعذّر إكمال التحليل</h2>
              <p className="text-slate-300 text-sm leading-relaxed mb-6">
                تعذّر إكمال التحليل. حاول مرة أخرى، أو تواصل معنا مباشرة لمساعدتك يدوياً واسترداد إجاباتك.
              </p>

              <div className="space-y-3">
                <button
                  onClick={runAnalysis}
                  className="w-full bg-[#EF4444] hover:bg-red-600 text-white font-bold py-3.5 px-6 rounded-xl transition-colors flex items-center justify-center gap-2 shadow-md"
                >
                  <RefreshCw size={18} className="animate-spin-hover" />
                  <span>حاول مرة أخرى</span>
                </button>

                <a
                  href={whatsappUrl}
                  target="_blank"
                  referrerPolicy="no-referrer"
                  rel="noopener noreferrer"
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 px-6 rounded-xl transition-colors flex items-center justify-center gap-2 shadow-md"
                >
                  <MessageCircle size={18} />
                  <span>تواصل معنا عبر واتساب</span>
                </a>
              </div>

              <div className="mt-6 pt-6 border-t border-slate-800 text-right">
                <span className="text-xs text-slate-500 block mb-1 font-mono">Session ID: {sessionId || 'N/A'}</span>
                {error && (
                  <p className="text-xs text-red-400 font-mono max-h-24 overflow-y-auto bg-slate-900/50 p-2 rounded border border-slate-800 text-left ltr break-words whitespace-pre-wrap">
                    {error.message || 'Unknown network or parsing error'}
                  </p>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Processing;
